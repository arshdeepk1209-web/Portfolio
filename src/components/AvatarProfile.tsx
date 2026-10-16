import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Sparkles, Upload, Check } from 'lucide-react';
import defaultProfilePhoto from '../assets/arshdeep-profile.jpg';

interface AvatarProfileProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
}

export const AvatarProfile: React.FC<AvatarProfileProps> = ({
  className = '',
  size = 'lg',
  showControls = true
}) => {
  const [photoSrc, setPhotoSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('arshdeep_custom_photo');
      return saved || defaultProfilePhoto;
    } catch {
      return defaultProfilePhoto;
    }
  });
  const [hasCustomPhoto, setHasCustomPhoto] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('arshdeep_custom_photo');
    } catch {
      return false;
    }
  });
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arshdeep_custom_photo');
      if (saved) {
        setPhotoSrc(saved);
        setHasCustomPhoto(true);
      } else {
        setPhotoSrc(defaultProfilePhoto);
        setHasCustomPhoto(false);
      }
    } catch {
      setPhotoSrc(defaultProfilePhoto);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoSrc(base64);
        setHasCustomPhoto(true);
        setImageError(false);
        try {
          localStorage.setItem('arshdeep_custom_photo', base64);
        } catch {
          // localStorage full or restricted
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoSrc(defaultProfilePhoto);
    setHasCustomPhoto(false);
    setImageError(false);
    try {
      localStorage.removeItem('arshdeep_custom_photo');
    } catch {
      // ignore
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48 sm:w-60 sm:h-60',
    xl: 'w-64 h-64 sm:w-72 sm:h-72'
  }[size];

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`${sizeClasses} relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-zinc-900 dark:to-zinc-950 shadow-2xl shadow-emerald-500/10 flex items-center justify-center transition duration-500 group-hover:border-emerald-400/80 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]`}
      >
        {!imageError ? (
          <img
            src={photoSrc}
            alt="Arshdeep Kaur - AI & ML Engineer"
            onError={() => {
              // If custom photo failed, fall back to default profile photo
              if (photoSrc !== defaultProfilePhoto) {
                setPhotoSrc(defaultProfilePhoto);
              } else {
                setImageError(true);
              }
            }}
            loading="eager"
            className="w-full h-full object-cover object-[center_28%] transition-transform duration-700 group-hover:scale-105 select-none"
          />
        ) : (
          /* High-fidelity Vector Portrait fallback if image fails to load */
          <svg
            viewBox="0 0 320 380"
            className="w-full h-full object-cover select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="curtainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4c5b3" />
                <stop offset="50%" stopColor="#ede3d5" />
                <stop offset="100%" stopColor="#c9b9a6" />
              </linearGradient>
              <linearGradient id="sweaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#134e4a" />
                <stop offset="60%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#115e59" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9d4b6" />
                <stop offset="100%" stopColor="#ebb995" />
              </linearGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#261c16" />
                <stop offset="100%" stopColor="#150f0c" />
              </linearGradient>
            </defs>

            {/* Neutral Curtain Backdrop matching photo */}
            <rect width="320" height="380" fill="url(#curtainGrad)" />
            <path d="M70 0 L70 380 M130 0 L130 380 M200 0 L200 380 M260 0 L260 380" stroke="#bda892" strokeWidth="3" opacity="0.4" />

            {/* Dark Green Textured Cardigan / Sweater */}
            <path d="M30 380 C40 280 80 250 120 240 L160 290 L200 240 C240 250 280 280 290 380 Z" fill="url(#sweaterGrad)" />
            <circle cx="80" cy="310" r="1.5" fill="#042f2e" opacity="0.5" />
            <circle cx="100" cy="330" r="1.5" fill="#042f2e" opacity="0.5" />
            <circle cx="220" cy="320" r="1.5" fill="#042f2e" opacity="0.5" />
            <circle cx="240" cy="350" r="1.5" fill="#042f2e" opacity="0.5" />
            <circle cx="140" cy="340" r="1.5" fill="#042f2e" opacity="0.5" />
            <circle cx="180" cy="350" r="1.5" fill="#042f2e" opacity="0.5" />

            {/* Black Turtleneck Inner */}
            <path d="M125 240 L195 240 L185 285 L135 285 Z" fill="#18181b" />
            <rect x="132" y="195" width="56" height="50" rx="10" fill="#18181b" />

            {/* Silver chain necklace with delicate swan/pendant */}
            <path d="M140 235 Q160 280 180 235" stroke="#e2e8f0" strokeWidth="2" fill="none" />
            <circle cx="160" cy="265" r="4" fill="#cbd5e1" />
            <path d="M158 263 L162 267 M162 263 L158 267" stroke="#ffffff" strokeWidth="1.5" />

            {/* Neck */}
            <rect x="142" y="170" width="36" height="35" rx="6" fill="url(#skinGrad)" />

            {/* Head / Face */}
            <ellipse cx="160" cy="140" rx="50" ry="60" fill="url(#skinGrad)" />

            {/* Tied Back Hair behind */}
            <path d="M100 135 C95 80 130 50 160 50 C190 50 225 80 220 135 C215 110 200 80 160 80 C120 80 105 110 100 135 Z" fill="url(#hairGrad)" />

            {/* Hairline and parted styled hair */}
            <path d="M110 120 C120 75 145 68 160 85 C175 68 200 75 210 120 C195 100 175 92 160 94 C145 92 125 100 110 120 Z" fill="url(#hairGrad)" />

            {/* Ears */}
            <ellipse cx="110" cy="142" rx="6" ry="11" fill="url(#skinGrad)" />
            <ellipse cx="210" cy="142" rx="6" ry="11" fill="url(#skinGrad)" />

            {/* Eyebrows */}
            <path d="M126 118 Q138 114 148 117" stroke="#261c16" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M172 117 Q182 114 194 118" stroke="#261c16" strokeWidth="2.6" strokeLinecap="round" fill="none" />

            {/* Expressive Warm Eyes */}
            <ellipse cx="137" cy="128" rx="8.5" ry="5.5" fill="#ffffff" />
            <ellipse cx="183" cy="128" rx="8.5" ry="5.5" fill="#ffffff" />
            <circle cx="137" cy="128" r="4.2" fill="#382417" />
            <circle cx="183" cy="128" r="4.2" fill="#382417" />
            <circle cx="135.5" cy="126.5" r="1.5" fill="#ffffff" />
            <circle cx="181.5" cy="126.5" r="1.5" fill="#ffffff" />
            <path d="M128 123 Q137 121 146 123" stroke="#1c1917" strokeWidth="1.2" fill="none" />
            <path d="M174 123 Q183 121 192 123" stroke="#1c1917" strokeWidth="1.2" fill="none" />

            {/* Nose */}
            <path d="M160 128 L158 147 Q160 152 164 147" stroke="#d99b75" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Friendly Gentle Smile */}
            <path d="M145 160 Q160 173 175 160" stroke="#b45347" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M148 162 Q160 170 172 162" fill="#ffffff" opacity="0.8" />
          </svg>
        )}

        {/* Live Availability Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Open for Roles (AI/ML & Analytics)</span>
        </div>

        {/* Optional change photo controls on hover */}
        {showControls && (
          <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Update Photo</span>
            </button>
            {hasCustomPhoto && (
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            )}
            <p className="text-[10px] text-zinc-400 mt-1 max-w-[160px] leading-tight">
              Permanently set for all visitors
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Decorative ambient ring glow */}
      <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-tr from-emerald-500/25 via-emerald-600/15 to-amber-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
    </div>
  );
};
