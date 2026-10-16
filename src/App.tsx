/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from './data/profile';
import { generateResumePDF } from './utils/generateResumePDF';
import { AvatarProfile } from './components/AvatarProfile';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ResumeModal } from './components/ResumeModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { VaabSimulator, ResumeGeneratorSimulator, SmartRouteSimulator } from './components/ProjectSimulators';
import {
  Moon,
  Sun,
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Code2,
  Cpu,
  Sparkles,
  GraduationCap,
  Award,
  CheckCircle2,
  Menu,
  X,
  Send,
  Copy,
  Check,
  Globe,
  Brain,
  ShieldCheck,
  Eye,
  Navigation,
  Layers
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Initialize theme from system or localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    } catch {
      setDarkMode(true);
    }
  }, []);

  // Sync dark class on html root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(contactSubject || 'Job Opportunity / Inquiry for Arshdeep Kaur')}&body=${encodeURIComponent(contactMessage || 'Hi Arshdeep, I reviewed your AI/ML portfolio...')}`;
    window.location.href = mailto;
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
  };

  const filteredProjects = activeCategory === 'All'
    ? PROFILE_DATA.projects
    : PROFILE_DATA.projects.filter(p => p.category === activeCategory);

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200`}>
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Recruiter Resume Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* GitHub Pages Setup Modal */}
      <GitHubPagesModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
              AK
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                Arshdeep Kaur
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono tracking-wider block">
                AI & ML GRADUATE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#about" className="hover:text-teal-500 transition">About</a>
            <a href="#projects" className="hover:text-teal-500 transition">Projects</a>
            <a href="#experience" className="hover:text-teal-500 transition">Experience</a>
            <a href="#skills" className="hover:text-teal-500 transition">Skills</a>
            <a href="#education" className="hover:text-teal-500 transition">Education</a>
            <a href="#contact" className="hover:text-teal-500 transition">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install */}
            <PWAInstallButton />

            {/* Resume Button */}
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 text-sm font-medium">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              Projects
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              Experience
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              Skills
            </a>
            <a
              href="#education"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              Education & Certifications
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-teal-500"
            >
              Contact
            </a>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsResumeModalOpen(true);
                }}
                className="text-xs text-teal-500 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume (PDF)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGitHubModalOpen(true);
                }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Hosting Guide
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="about" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 dark:border-slate-800/60">
        {/* Ambient gradient blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[300px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Intro */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Open for Roles in AI/ML & Data Analytics</span>
              </div>

              {/* Title & Name */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Hi, I&apos;m <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Arshdeep Kaur</span>
                </h1>
                <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300">
                  AI & ML Graduate | Data Analytics & Computer Vision
                </p>
              </div>

              {/* Summary */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AI & ML Graduate with hands-on, applied experience across machine learning, computer vision, data analysis, and predictive modeling. Currently pursuing an MCA specializing in AI & Machine Learning (2025–2027) with Intel-mentored training, computer vision pipelines (FastAPI + OpenVINO + YOLOv8 + BLIP-2), and Tableau analytics.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={generateResumePDF}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-bold shadow-lg shadow-teal-500/25 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </button>

                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4 text-teal-500" />
                  <span>View Full Resume</span>
                </button>

                <a
                  href="#contact"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </a>
              </div>

              {/* Quick links & contact info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  {PROFILE_DATA.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-500" />
                  {PROFILE_DATA.phone}
                </span>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyan-500" />
                  LinkedIn
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
                <a
                  href={PROFILE_DATA.tableau}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                  Tableau Public
                </a>
              </div>
            </div>

            {/* Right Column: Photograph & Stat Highlights */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <AvatarProfile size="lg" showControls={true} />

              {/* Quick credential cards */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <span className="text-xs text-slate-400 block font-medium">Mentorship</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Intel Training</span>
                  <span className="text-[10px] text-teal-500 block font-mono">Summer 2026</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <span className="text-xs text-slate-400 block font-medium">Education</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">MCA (AI/ML)</span>
                  <span className="text-[10px] text-teal-500 block font-mono">2025–2027 (Pursuing)</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <span className="text-xs text-slate-400 block font-medium">Domain Focus</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Data Analytics</span>
                  <span className="text-[10px] text-slate-400 block">Tableau & Python</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <span className="text-xs text-slate-400 block font-medium">Opportunities</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Open for Roles</span>
                  <span className="text-[10px] text-slate-400 block">AI/ML & Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
                <Code2 className="w-4 h-4" />
                Featured Engineering Projects
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Applied AI & Machine Learning Systems
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Real-world solutions combining edge computer vision, automated generative AI prompts, predictive routing, and executive business analytics.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 self-start md:self-auto text-xs">
              {['All', 'Computer Vision', 'Generative AI', 'Machine Learning', 'Data Analytics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-teal-500 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="space-y-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition duration-300 hover:border-teal-500/50"
              >
                <div className="p-6 sm:p-8">
                  {/* Header info */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20">
                          {project.category}
                        </span>
                        {project.badge && (
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                            ★ {project.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                      {project.tableauUrl && (
                        <a
                          href={project.tableauUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 transition"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>View on Tableau Public</span>
                          <ExternalLink className="w-3 h-3 text-amber-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="mt-5 space-y-2">
                    {project.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></span>
                        <p className="leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack tags */}
                  <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Architecture Stack:</span>
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Interactive Simulator inside card */}
                  {project.simulationType === 'vision' && <VaabSimulator />}
                  {project.simulationType === 'resume-generator' && <ResumeGeneratorSimulator />}
                  {project.simulationType === 'route-optimizer' && <SmartRouteSimulator />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800/60 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Cpu className="w-4 h-4" />
              Work History & Professional Mentorship
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Relevant Experience & Fitment
            </h2>
          </div>

          <div className="relative border-l-2 border-teal-500/30 ml-4 sm:ml-6 space-y-12">
            {PROFILE_DATA.experiences.map((exp, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-white dark:ring-slate-950 group-hover:scale-125 transition"></div>

                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {exp.highlights.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  {exp.link && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={exp.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>{exp.link.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              Technical & Professional Matrix
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Skills Aligned to Role Requirements
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              From frontier model prompt engineering to production vision deployment and executive dashboard design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILE_DATA.skillCategories.map((category, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
              >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-500" />
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{skill.name}</span>
                        <span className="font-mono text-teal-600 dark:text-teal-400">{skill.level}%</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      {skill.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skill.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[9px] font-mono text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <section id="education" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800/60 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Education */}
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
                <GraduationCap className="w-4 h-4" />
                Academic Background
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                Education
              </h2>

              <div className="space-y-4">
                {PROFILE_DATA.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold px-2 py-0.5 rounded bg-teal-500/10 whitespace-nowrap">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {edu.status}
                    </p>
                    {edu.gradeOrFocus && (
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300/80 mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {edu.gradeOrFocus}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
                <Award className="w-4 h-4" />
                Industry Credentials
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                Certifications
              </h2>

              <div className="space-y-4">
                {PROFILE_DATA.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {cert.name}
                      </h3>
                      <span className="text-xs font-mono text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">
                      Issuer: {cert.issuer}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & RECRUITER INQUIRY SECTION */}
      <section id="contact" className="py-16 md:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold tracking-wider uppercase mb-1">
                  <Mail className="w-4 h-4" />
                  Direct Channels
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Get in Touch
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Interested in discussing AI engineering, Generative AI evaluation, or full-time opportunities? Feel free to connect directly.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                      <a href={`mailto:${PROFILE_DATA.email}`} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-teal-500 transition">
                        {PROFILE_DATA.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {PROFILE_DATA.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {PROFILE_DATA.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profiles */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-500 transition"
                >
                  <Linkedin className="w-4 h-4 text-cyan-500" />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-500 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repositories</span>
                </a>
                <a
                  href={PROFILE_DATA.tableau}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500 hover:text-amber-500 transition"
                >
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>Tableau Vizzes</span>
                </a>
              </div>
            </div>

            {/* Recruiter Instant Message Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Direct Recruiter Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dispatches directly to {PROFILE_DATA.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                    Response &lt; 24h
                  </span>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Subject / Role Title
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. AI/ML Engineering Opportunity at [Company]"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Hi Arshdeep, we came across your AI portfolio and would love to schedule a preliminary conversation regarding..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-slate-400">
                      Zero backend required: opens your default email client.
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{contactSent ? 'Draft Dispatched!' : 'Send Email Message'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Arshdeep Kaur</span>
            <span>·</span>
            <span>AI & ML Graduate</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="hover:text-teal-500 transition flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GitHub Pages Free Hosting Guide</span>
            </button>
            <span>·</span>
            <button
              onClick={generateResumePDF}
              className="hover:text-teal-500 transition cursor-pointer"
            >
              Download PDF Resume
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
