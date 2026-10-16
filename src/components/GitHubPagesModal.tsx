import React, { useState } from 'react';
import { X, Globe, Terminal, Check, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Create a Repository on GitHub',
      detail: 'Go to GitHub and create a new public repository (e.g. "portfolio" or "arshdeep-portfolio").',
      command: `git init\ngit add .\ngit commit -m "Deploy Arshdeep Kaur Portfolio PWA"\ngit branch -M main\ngit remote add origin https://github.com/arshdeepk1209-web/portfolio.git\ngit push -u origin main`
    },
    {
      title: '2. Enable GitHub Pages in Repo Settings',
      detail: 'In your GitHub repository, click Settings → Pages. Under "Build and deployment" Source, select "GitHub Actions".',
      command: `# The repo includes .github/workflows/deploy.yml\n# GitHub Actions will automatically build & publish your site within 60 seconds!`
    },
    {
      title: '3. Your Live Free URL',
      detail: 'Your portfolio will be available 24/7 with zero hosting fees and free SSL encryption at:',
      command: `https://arshdeepk1209-web.github.io/portfolio/`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Free GitHub Pages Hosting Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% free forever · Zero server fees · No backend to maintain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-900 dark:text-teal-200 block text-xs">
                Zero-Config GitHub Actions Ready
              </span>
              <p className="text-[11px] text-teal-700 dark:text-teal-300/90 mt-0.5">
                We have pre-configured <code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> and relative path routing (<code className="font-mono bg-teal-100 dark:bg-teal-900 px-1 py-0.5 rounded">base: &apos;./&apos;</code>). All assets, icons, service workers, and simulators work out-of-the-box on GitHub Pages!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{step.title}</span>
                  <button
                    onClick={() => copyCode(step.command, idx)}
                    className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">{step.detail}</p>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-teal-300 font-mono text-[10px] overflow-x-auto">
                  {step.command}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
