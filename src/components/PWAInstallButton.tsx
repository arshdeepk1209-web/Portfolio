import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, render a subtle indicator
  if (isInstalled) {
    return (
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        title="Install this portfolio as a standalone app on your desktop or mobile home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-zinc-200 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 shadow-2xl text-stone-900 dark:text-zinc-100">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800">
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-zinc-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <p>
                    Tap the <strong className="text-stone-900 dark:text-white inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</strong> icon in your Safari bottom menu.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <p>
                    Scroll down and tap <strong className="text-stone-900 dark:text-white">Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <p>
                    Open from your home screen for full offline instant access!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
