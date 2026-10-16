import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi, Info, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isOnline ? (
        <div className="flex flex-col gap-2">
          <div 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2.5 rounded-full bg-amber-500/90 text-white backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold shadow-lg shadow-amber-500/20 border border-amber-400/40 cursor-pointer transition hover:bg-amber-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode Active</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded">Cached</span>
          </div>

          {showDetails && (
            <div className="w-72 rounded-xl bg-slate-900/95 border border-slate-700 p-3.5 text-xs text-slate-200 shadow-xl backdrop-blur-lg">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                <Info className="w-4 h-4" />
                <span>Zero-Internet Viewing Ready</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                This portfolio is cached via Service Worker. You can view all projects, generate and download Arshdeep&apos;s resume, test interactive simulations, and access contact details completely offline.
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Status: Fully Offline Capable</span>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Offline Ready</span>
        </div>
      )}
    </div>
  );
};
