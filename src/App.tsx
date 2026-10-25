/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem, framerEase } from './components/ScrollReveal';
import { SectionDivider } from './components/SectionDivider';
import { ProjectTiltCard } from './components/ProjectTiltCard';
import { PROFILE_DATA } from './data/profile';
import { generateResumePDF } from './utils/generateResumePDF';
import { AvatarProfile } from './components/AvatarProfile';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ResumeModal } from './components/ResumeModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { PortfolioChatbot } from './components/PortfolioChatbot';
import { SkillsAndStatsDashboard } from './components/SkillsAndStatsDashboard';
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
  Layers,
  ArrowUpRight,
  Loader2,
  Briefcase,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSenderEmail, setContactSenderEmail] = useState('');
  const [contactSenderName, setContactSenderName] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
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

  // Sync dark class on html root & body
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() && !contactMessage.trim()) {
      setContactError('Please provide the role title and your message.');
      return;
    }

    setIsSendingContact(true);
    setContactError(null);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${PROFILE_DATA.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `Direct Recruiter Inquiry: ${contactSubject.trim() || 'Role Opportunity for Arshdeep Kaur'}`,
          Role_Opportunity: contactSubject.trim() || 'General AI/ML Opportunity',
          Message: contactMessage.trim(),
          Recruiter_Email: contactSenderEmail.trim() || 'Not specified',
          Recruiter_Name: contactSenderName.trim() || 'Recruiter / Hiring Team',
          _replyto: contactSenderEmail.trim() || PROFILE_DATA.email,
          _template: 'box',
          _captcha: 'false',
        }),
      });

      // FormSubmit responds with JSON
      const result = await response.json().catch(() => ({}));

      setContactSent(true);
      setContactSubject('');
      setContactMessage('');
      setContactSenderName('');
      setContactSenderEmail('');
    } catch (err) {
      console.error('Contact transmission error:', err);
      // If network fails, still give friendly message
      setContactError('Transmission encountered a network delay. Please retry or verify your connection.');
    } finally {
      setIsSendingContact(false);
    }
  };

  const filteredProjects = activeCategory === 'All'
    ? PROFILE_DATA.projects
    : PROFILE_DATA.projects.filter(p => p.category === activeCategory);


  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors duration-300 relative selection:bg-emerald-500 selection:text-white overflow-x-hidden`}>
      {/* Framer-style ambient blurred mesh background (Emerald & Warm Amber - Zero Blue) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[110px] animate-drift"></div>
        <div className="absolute top-1/3 -right-32 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-amber-500/8 dark:bg-amber-500/10 rounded-full blur-[120px] animate-drift-slow"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-600/10 dark:bg-emerald-600/15 rounded-full blur-[130px] animate-drift"></div>
      </div>

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

      {/* Ask Me Anything (AMA) Portfolio Chatbot */}
      <PortfolioChatbot />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: framerEase }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
              AK
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 dark:text-white block leading-tight">
                Arshdeep Kaur
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-wider block font-semibold">
                AI & ML GRADUATE
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: framerEase }}
            className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600 dark:text-zinc-300"
          >
            <a href="#about" className="hover:text-emerald-500 transition-colors">About</a>
            <a href="#projects" className="hover:text-emerald-500 transition-colors">Projects</a>
            <a href="#experience" className="hover:text-emerald-500 transition-colors">Experience</a>
            <a href="#stats" className="hover:text-emerald-500 transition-colors flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Stats Dashboard</span>
            </a>
            <a href="#skills" className="hover:text-emerald-500 transition-colors">Skills</a>
            <a href="#education" className="hover:text-emerald-500 transition-colors">Education</a>
            <a href="#contact" className="hover:text-emerald-500 transition-colors">Contact</a>
          </motion.nav>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: framerEase }}
            className="flex items-center gap-2.5"
          >
            {/* PWA Install */}
            <PWAInstallButton />

            {/* Resume Button */}
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 dark:text-zinc-300 hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: framerEase }}
              className="md:hidden border-b border-stone-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 py-3 space-y-2 text-sm font-medium overflow-hidden"
            >
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                About
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                Projects
              </a>
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                Experience
              </a>
              <a
                href="#stats"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 font-bold text-emerald-600 dark:text-emerald-400"
              >
                Stats & Skills Dashboard
              </a>
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                Skills
              </a>
              <a
                href="#education"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                Education & Certifications
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-stone-700 dark:text-zinc-200 hover:text-emerald-500"
              >
                Contact
              </a>
              <div className="pt-2 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsResumeModalOpen(true);
                  }}
                  className="text-xs text-emerald-500 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsGitHubModalOpen(true);
                  }}
                  className="text-xs text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
                >
                  Hosting Guide
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="about" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b border-stone-200/70 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: framerEase }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: framerEase }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open for Roles in AI/ML & Data Analytics</span>
              </motion.div>

              {/* Title & Name */}
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.15, ease: framerEase }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 dark:text-white"
                >
                  Hi, I&apos;m{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                    Arshdeep Kaur
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.25, ease: framerEase }}
                  className="text-lg sm:text-xl font-medium text-stone-600 dark:text-zinc-300"
                >
                  AI & ML Graduate | Data Analytics & Computer Vision
                </motion.p>
              </div>

              {/* Summary */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.35, ease: framerEase }}
                className="text-sm sm:text-base text-stone-600 dark:text-zinc-300/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                AI & ML Graduate with hands-on, applied experience across machine learning, computer vision, data analysis, and predictive modeling. Currently pursuing an MCA specializing in AI & Machine Learning (2025–2027) with Intel-mentored training, computer vision pipelines (FastAPI + OpenVINO + YOLOv8 + BLIP-2), and Tableau analytics.
              </motion.p>

              {/* Call to Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.45, ease: framerEase }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
              >
                <button
                  onClick={generateResumePDF}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </button>

                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-stone-300 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span>View Full Resume</span>
                </button>

                <a
                  href="#contact"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white text-sm font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </a>
              </motion.div>

              {/* Quick links & contact info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-stone-500 dark:text-zinc-400 border-t border-stone-200 dark:border-zinc-800/80"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {PROFILE_DATA.location}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  {PROFILE_DATA.phone}
                </span>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-stone-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-emerald-500" />
                  LinkedIn
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-stone-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
                <a
                  href={PROFILE_DATA.tableau}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-stone-600 dark:text-zinc-300 hover:text-amber-500 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                  Tableau Public
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: Photograph & Stat Highlights */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: framerEase }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <AvatarProfile size="lg" showControls={true} />

              {/* Quick credential cards */}
              <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: framerEase }}
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 shadow-xs text-center backdrop-blur-md"
                >
                  <span className="text-xs text-stone-400 dark:text-zinc-400 block font-medium">Mentorship</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">Intel Training</span>
                  <span className="text-[10px] text-emerald-500 block font-mono font-semibold">Summer 2026</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: framerEase }}
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 shadow-xs text-center backdrop-blur-md"
                >
                  <span className="text-xs text-stone-400 dark:text-zinc-400 block font-medium">Education</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">MCA (AI/ML)</span>
                  <span className="text-[10px] text-emerald-500 block font-mono font-semibold">2025–2027 (Pursuing)</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55, ease: framerEase }}
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 shadow-xs text-center backdrop-blur-md"
                >
                  <span className="text-xs text-stone-400 dark:text-zinc-400 block font-medium">Domain Focus</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">Data Analytics</span>
                  <span className="text-[10px] text-amber-500 block font-semibold">Tableau & Python</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65, ease: framerEase }}
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 shadow-xs text-center backdrop-blur-md"
                >
                  <span className="text-xs text-stone-400 dark:text-zinc-400 block font-medium">Opportunities</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Open for Roles</span>
                  <span className="text-[10px] text-stone-500 dark:text-zinc-400 block font-medium">AI/ML & Analytics</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-16 md:py-28 border-b border-stone-200/70 dark:border-zinc-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: framerEase }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
                <Code2 className="w-4 h-4" />
                Featured Engineering Projects
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
                Applied AI & Machine Learning Systems
              </h2>
              <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Real-world solutions combining edge computer vision, automated ML pipelines, predictive routing, and executive business analytics.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-stone-200/70 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 self-start md:self-auto text-xs">
              {['All', 'Computer Vision', 'Generative AI', 'Machine Learning', 'Data Analytics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Project Cards Grid with Framer Motion 3D Tilt Variants */}
          <div className="space-y-10">
            {filteredProjects.map((project, index) => (
              <ProjectTiltCard
                key={project.id}
                index={index}
              >
                <div className="p-6 sm:p-8">
                  {/* Header info */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          {project.category}
                        </span>
                        {project.badge && (
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                            ★ {project.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-200 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                          <ArrowUpRight className="w-3 h-3 text-stone-400" />
                        </a>
                      )}
                      {project.tableauUrl && (
                        <a
                          href={project.tableauUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-colors"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>View on Tableau Public</span>
                          <ArrowUpRight className="w-3 h-3 text-amber-500" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="mt-5 space-y-2">
                    {project.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 dark:text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                        <p className="leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack tags */}
                  <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-stone-100 dark:border-zinc-800/80">
                    <span className="text-[11px] text-stone-400 dark:text-zinc-500 font-semibold mr-1">Architecture Stack:</span>
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700/80"
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
              </ProjectTiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* SUBTLE HORIZONTAL SECTION DIVIDER */}
      <SectionDivider />

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-16 md:py-28 bg-stone-100/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: framerEase }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Cpu className="w-4 h-4" />
              Work History & Professional Mentorship
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Relevant Experience & Fitment
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-6 space-y-12">
            {PROFILE_DATA.experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: framerEase }}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-950 group-hover:scale-125 transition-transform duration-300"></div>

                <div className="rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-medium text-stone-500 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {exp.highlights.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  {exp.link && (
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                      <a
                        href={exp.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>{exp.link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-700/60 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBTLE HORIZONTAL SECTION DIVIDER */}
      <SectionDivider />

      {/* LIVE SKILLS & STATS DASHBOARD */}
      <SkillsAndStatsDashboard />

      {/* SUBTLE HORIZONTAL SECTION DIVIDER */}
      <SectionDivider />

      {/* SKILLS SECTION */}
      <section id="skills" className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: framerEase }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              Technical & Professional Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Skills Aligned to Role Requirements
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-2">
              From applied computer vision models to exploratory analytics and agile team execution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILE_DATA.skillCategories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: framerEase }}
                className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs backdrop-blur-md"
              >
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white pb-3 mb-4 border-b border-stone-100 dark:border-zinc-800 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-500" />
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-stone-800 dark:text-zinc-200">{skill.name}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">{skill.level}%</span>
                      </div>
                      {/* Animated Progress bar */}
                      <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.1 * i, ease: framerEase }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-amber-500"
                        ></motion.div>
                      </div>
                      {skill.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skill.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[9px] font-mono text-stone-400 dark:text-zinc-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBTLE HORIZONTAL SECTION DIVIDER */}
      <SectionDivider />

      {/* EDUCATION & CERTIFICATIONS */}
      <section id="education" className="py-16 md:py-28 bg-stone-100/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: framerEase }}
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
                <GraduationCap className="w-4 h-4" />
                Academic Background
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-6">
                Education
              </h2>

              <div className="space-y-4">
                {PROFILE_DATA.education.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: idx * 0.12, ease: framerEase }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 shadow-xs backdrop-blur-md hover:border-emerald-500/40 hover:shadow-md transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-bold text-stone-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 whitespace-nowrap">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-600 dark:text-zinc-300 mt-1">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-2">
                      {edu.status}
                    </p>
                    {edu.gradeOrFocus && (
                      <p className="text-xs font-medium text-stone-700 dark:text-zinc-300/80 mt-1 pt-2 border-t border-stone-100 dark:border-zinc-800">
                        {edu.gradeOrFocus}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: 0.15, ease: framerEase }}
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
                <Award className="w-4 h-4" />
                Industry Credentials
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-6">
                Certifications
              </h2>

              <div className="space-y-4">
                {PROFILE_DATA.certifications.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55, delay: idx * 0.12, ease: framerEase }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 shadow-xs backdrop-blur-md hover:border-amber-500/40 hover:shadow-md transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-bold text-stone-900 dark:text-white">
                        {cert.name}
                      </h3>
                      <span className="text-xs font-mono text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      Issuer: {cert.issuer}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      {cert.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SUBTLE HORIZONTAL SECTION DIVIDER */}
      <SectionDivider />

      {/* CONTACT & RECRUITER INQUIRY SECTION */}
      <section id="contact" className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: framerEase }}
              className="lg:col-span-5 space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
                  <Mail className="w-4 h-4" />
                  Direct Channels
                </div>
                <h2 className="text-3xl font-black text-stone-900 dark:text-white">
                  Get in Touch
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-2">
                  Interested in discussing AI/ML engineering, data analytics, or full-time opportunities? Feel free to connect directly.
                </p>
              </div>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.1, ease: framerEase }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-zinc-400 uppercase font-semibold block">Email Address</span>
                      <a href={`mailto:${PROFILE_DATA.email}`} className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white hover:text-emerald-500 transition-colors">
                        {PROFILE_DATA.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.2, ease: framerEase }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 dark:text-zinc-400 uppercase font-semibold block">Phone</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                      {PROFILE_DATA.phone}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.3, ease: framerEase }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 dark:text-zinc-400 uppercase font-semibold block">Location</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                      {PROFILE_DATA.location}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Profiles */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: 0.35, ease: framerEase }}
                className="pt-2 flex flex-wrap gap-2"
              >
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-200 hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5 transition-all shadow-xs"
                >
                  <Linkedin className="w-4 h-4 text-emerald-500" />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-200 hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5 transition-all shadow-xs"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repositories</span>
                </a>
                <a
                  href={PROFILE_DATA.tableau}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-200 hover:border-amber-500 hover:text-amber-500 hover:-translate-y-0.5 transition-all shadow-xs"
                >
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>Tableau Vizzes</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Recruiter Instant Message Form */}
            <motion.div
              initial={{ opacity: 0, x: 25, y: 15 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: 0.15, ease: framerEase }}
              className="lg:col-span-7"
            >
              <div className="rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-stone-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <span>Direct Recruiter Inquiry</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Direct Inbox Delivery
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                      Sends directly to <span className="font-semibold text-stone-700 dark:text-zinc-200">{PROFILE_DATA.email}</span> — no mail client needed
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded font-semibold hidden sm:inline-block">
                    Response &lt; 24h
                  </span>
                </div>

                {contactSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 px-4 text-center space-y-4"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/25 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                        Message Dispatched Directly!
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                        Your message has reached Arshdeep Kaur's email (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">{PROFILE_DATA.email}</span>) directly through the site without opening any external mail software.
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-zinc-500 pt-1">
                        Expect a reply within 24 hours. Thank you for reaching out!
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setContactSent(false);
                          setContactError(null);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    {contactError && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{contactError}</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Role / Opportunity Title</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">*Required</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. AI/ML Engineer, Data Scientist, or Full-Time Opportunity"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 block mb-1">
                          Your Email <span className="text-stone-400 text-[10px] font-normal">(so Arshdeep can reply)</span>
                        </label>
                        <input
                          type="email"
                          value={contactSenderEmail}
                          onChange={(e) => setContactSenderEmail(e.target.value)}
                          placeholder="e.g. recruiter@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 block mb-1">
                          Your Name / Company <span className="text-stone-400 text-[10px] font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={contactSenderName}
                          onChange={(e) => setContactSenderName(e.target.value)}
                          placeholder="e.g. Hiring Team at Meta"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center justify-between mb-1">
                        <span>Message / Project Details</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">*Required</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Hi Arshdeep, we came across your AI/ML portfolio and would love to schedule a preliminary conversation regarding..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                        Direct in-page transmission — reaches Arshdeep's inbox directly.
                      </span>
                      <button
                        type="submit"
                        disabled={isSendingContact}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        {isSendingContact ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending to Inbox...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Email Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.65, ease: framerEase }}
        className="py-10 bg-white dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 text-xs text-stone-500 dark:text-zinc-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 dark:text-white">Arshdeep Kaur</span>
            <span>·</span>
            <span>AI & ML Graduate</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="hover:text-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GitHub Pages Free Hosting Guide</span>
            </button>
            <span>·</span>
            <button
              onClick={generateResumePDF}
              className="hover:text-emerald-500 transition-colors cursor-pointer"
            >
              Download PDF Resume
            </button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
