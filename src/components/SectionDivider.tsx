import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
  className?: string;
  glow?: boolean;
}

/**
 * Subtle, semi-transparent horizontal divider line
 * Designed with a soft gradient falloff and optional subtle emerald accent shimmer
 * for refined section boundaries and content flow.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  className = '',
  glow = true,
}) => {
  return (
    <div
      className={`w-full relative pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle semi-transparent gradient line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-300/60 dark:via-zinc-800/80 to-transparent" />

          {/* Soft ambient center shimmer */}
          {glow && (
            <div className="absolute w-36 sm:w-64 h-px bg-gradient-to-r from-transparent via-emerald-500/30 dark:via-emerald-400/25 to-transparent blur-[0.5px]" />
          )}
        </motion.div>
      </div>
    </div>
  );
};
