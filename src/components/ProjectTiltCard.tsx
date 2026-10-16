import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { framerEase } from './ScrollReveal';

export interface TiltCoordinates {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

/**
 * 3D Tilt-on-hover framer-motion variants
 * Provides subtle rotation along X and Y axes, gentle scale, 
 * elevation on Z-axis, and soft emerald ambient shadow.
 */
export const projectTiltVariants: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    y: 0,
    z: 0,
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.07)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      mass: 0.8
    }
  },
  hover: (coords?: TiltCoordinates) => ({
    rotateX: coords ? coords.rotateX : -2.5,
    rotateY: coords ? coords.rotateY : 3,
    scale: 1.012,
    y: -4,
    z: 25,
    boxShadow: '0 25px 45px -12px rgba(16, 185, 129, 0.16), 0 0 25px rgba(16, 185, 129, 0.08)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 22,
      mass: 0.6
    }
  })
};

interface ProjectTiltCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  maxTilt?: number;
}

/**
 * Subtle 3D Tilt Card using Framer Motion variants
 * Tracks cursor coordinates to apply realistic, subtle 3D perspective tilt
 * with spring physics and an ambient glare reflection.
 */
export const ProjectTiltCard: React.FC<ProjectTiltCardProps> = ({
  children,
  className = '',
  index = 0,
  maxTilt = 3.5
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<TiltCoordinates>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Calculate rotation angles (-maxTilt to +maxTilt degrees)
    // Positive Y mouse movement tilts forward (negative rotateX)
    const rotateX = Number((((y - height / 2) / (height / 2)) * -maxTilt).toFixed(2));
    // Positive X mouse movement tilts right (positive rotateY)
    const rotateY = Number((((x - width / 2) / (width / 2)) * maxTilt).toFixed(2));

    // Glare position in percent
    const glareX = Number(((x / width) * 100).toFixed(1));
    const glareY = Number(((y / height) * 100).toFixed(1));

    setCoords({ rotateX, rotateY, glareX, glareY });
    setIsHovered(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: framerEase }}
      style={{ perspective: 1200 }}
      className="w-full"
    >
      <motion.div
        ref={cardRef}
        variants={projectTiltVariants}
        custom={coords}
        initial="rest"
        animate={isHovered ? 'hover' : 'rest'}
        whileHover="hover"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transformPerspective: 1200
        }}
        className={`relative rounded-3xl bg-white/85 dark:bg-zinc-900/85 border border-stone-200/80 dark:border-zinc-800/80 overflow-hidden backdrop-blur-md transition-colors duration-300 hover:border-emerald-500/50 ${className}`}
      >
        {/* Subtle dynamic 3D glare light effect following cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 350px at ${coords.glareX}% ${coords.glareY}%, rgba(16, 185, 129, 0.08), transparent 80%)`
          }}
        />

        {/* Card Content with 3D depth */}
        <div className="relative z-20" style={{ transform: 'translateZ(1px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
