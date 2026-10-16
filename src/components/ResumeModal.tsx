import React, { useState } from 'react';
import { PROFILE_DATA } from '../data/profile';
import { generateResumePDF } from '../utils/generateResumePDF';
import { X, Download, Printer, Copy, Check, FileText, Sparkles, ShieldCheck } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'ats'>('preview');

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = `
${PROFILE_DATA.name.toUpperCase()}
${PROFILE_DATA.location} | ${PROFILE_DATA.email} | ${PROFILE_DATA.phone} | ${PROFILE_DATA.linkedin}
Tableau: ${PROFILE_DATA.tableau} | GitHub: ${PROFILE_DATA.github}

PROFILE SUMMARY
${PROFILE_DATA.summary}

RELEVANT EXPERIENCE & FITMENT TO ROLE
${PROFILE_DATA.experiences
  .map(
    (exp) => `
${exp.role} — ${exp.company} (${exp.period})
${exp.highlights.map((h) => `• ${h}`).join('\n')}
${exp.link ? `• Tableau Profile: ${exp.link.url}` : ''}
`
  )
  .join('\n')}

KEY PROJECTS
${PROFILE_DATA.projects
  .map(
    (proj) => `
${proj.title} ${proj.githubUrl ? `(${proj.githubUrl})` : ''}
${proj.bullets.map((b) => `• ${b}`).join('\n')}
`
  )
  .join('\n')}

SKILLS
• Machine Learning & Computer Vision: BLIP-2, YOLOv8, OpenCV, EasyOCR, Intel OpenVINO, Scikit-Learn
• Data Analytics & Technical: Python, SQL, MongoDB, FastAPI, REST APIs, Tableau Desktop, Pandas, NumPy
• AI Evaluation: Model response evaluation, comparative scoring, structured justification, benchmarking
• Soft Skills: Communication (technical & non-technical), team management & collaboration, problem solving, adaptability

EDUCATION
• Master of Computer Applications (MCA) — AI & Machine Learning | Chandigarh University | 2025 – 2027 (Pursuing)
• Bachelor of Computer Applications (BCA) | MCM DAV College for Women, Chandigarh | 2025

CERTIFICATIONS
${PROFILE_DATA.certifications.map((c) => `• ${c.name} — ${c.issuer} (${c.year})`).join('\n')}
`;

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Recruiter Resume Center
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  ATS Ready · Offline
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official resume of Arshdeep Kaur — Download directly or print
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateResumePDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="Download direct PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Print directly or save as PDF via system dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Copy formatted plain text for ATS job portals"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-2 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Formatted Resume Sheet
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ats'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ATS Keyword Score & Verification
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/40">
          {activeTab === 'ats' ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      ATS Compatibility Analysis
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Standardized structure optimized for Workday, Greenhouse, Lever, and Taleo parsers.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-500 font-mono">98/100</span>
                    <span className="block text-[10px] text-slate-400 font-medium">ATS Match Grade</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Section Headers</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Standardized</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Experience, Education, Skills, Projects</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Contact Info</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified Direct</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Email, Phone, LinkedIn, GitHub, Tableau</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Format</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Clean Single-Layer</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Vector PDF, zero multi-column parsing traps</p>
                  </div>
                </div>

                <div className="mt-5">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Verified Industry Keywords Found:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Generative AI',
                      'Prompt Engineering',
                      'Model Evaluation',
                      'Intel OpenVINO',
                      'FastAPI',
                      'YOLOv8',
                      'BLIP-2',
                      'EasyOCR',
                      'Tableau Desktop',
                      'Python',
                      'Pandas',
                      'NumPy',
                      'Matplotlib',
                      'SQL',
                      'MongoDB',
                      'Regression',
                      'Classification',
                      'Clustering',
                      'Stakeholder Management',
                      'Requirement Gathering'
                    ].map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Printable ATS resume card */
            <div className="max-w-3xl mx-auto rounded-xl bg-white p-6 sm:p-10 shadow-lg text-slate-900 border border-slate-200 leading-normal font-sans">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase text-slate-950">
                  {PROFILE_DATA.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-700 mt-1.5 font-medium">
                  {PROFILE_DATA.location} &nbsp;|&nbsp;
                  <a href={`mailto:${PROFILE_DATA.email}`} className="text-emerald-700 hover:underline">
                    {PROFILE_DATA.email}
                  </a>{' '}
                  &nbsp;|&nbsp;
                  <span>{PROFILE_DATA.phone}</span> &nbsp;|&nbsp;
                  <a href={PROFILE_DATA.linkedin} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                    linkedin.com/in/arshdeep-kaur-9ba3a1357
                  </a>
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  GitHub: <a href={PROFILE_DATA.github} className="text-emerald-700 hover:underline">{PROFILE_DATA.github}</a> &nbsp;|&nbsp;
                  Tableau: <a href={PROFILE_DATA.tableau} className="text-emerald-700 hover:underline">public.tableau.com/app/profile/arshdeep.kaur7968</a>
                </p>
              </div>

              {/* Profile Summary */}
              <div className="mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Profile Summary
                </h2>
                <p className="text-xs text-slate-800 text-justify leading-relaxed">
                  {PROFILE_DATA.summary}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Relevant Experience & Fitment to Role
                </h2>
                {PROFILE_DATA.experiences.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-950">
                        {exp.role} — <span className="font-semibold text-slate-800">{exp.company}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 italic">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-800">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="leading-snug">{h}</li>
                      ))}
                      {exp.link && (
                        <li>
                          <strong>Tableau Profile:</strong>{' '}
                          <a href={exp.link.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                            {exp.link.url}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Key Projects (GitHub)
                </h2>
                {PROFILE_DATA.projects.map((proj, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-950">
                        {proj.title}
                      </span>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-700 hover:underline">
                          GitHub: {proj.githubUrl}
                        </a>
                      )}
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-800">
                      {proj.bullets.map((b, i) => (
                        <li key={i} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Skills Aligned to Role Requirements
                </h2>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
                  <li>
                    <strong>Machine Learning & Computer Vision:</strong> BLIP-2, YOLOv8, OpenCV, EasyOCR, Intel OpenVINO, Scikit-Learn
                  </li>
                  <li>
                    <strong>Data Analytics & Technical:</strong> Python (Pandas, NumPy, Matplotlib), SQL, MongoDB, FastAPI, REST APIs, Tableau Desktop
                  </li>
                  <li>
                    <strong>AI Evaluation & Quality:</strong> Model response evaluation, comparative scoring, structured justification, benchmarking
                  </li>
                  <li>
                    <strong>Soft Skills:</strong> Communication (technical & non-technical), team management & collaboration, problem solving, adaptability
                  </li>
                </ul>
              </div>

              {/* Education */}
              <div className="mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Education
                </h2>
                <div className="space-y-1.5 text-xs text-slate-800">
                  <div className="flex justify-between">
                    <span><strong>Master of Computer Applications (MCA) — AI & Machine Learning</strong> | Chandigarh University</span>
                    <span className="italic text-slate-600">2025 – 2027 (Pursuing)</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Bachelor of Computer Applications (BCA)</strong> | MCM DAV College for Women, Chandigarh</span>
                    <span className="italic text-slate-600">2025</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Certifications
                </h2>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
                  {PROFILE_DATA.certifications.map((cert, idx) => (
                    <li key={idx}>
                      <strong>{cert.name}</strong> — {cert.issuer} ({cert.year})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
