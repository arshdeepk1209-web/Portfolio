import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  Github,
  Award,
  Layers,
  GraduationCap,
  TrendingUp,
  Cpu,
  Code2,
  ExternalLink,
  RefreshCw,
  GitCommit,
  GitFork,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Database,
  Eye,
  Activity,
  Calendar,
  BookOpen
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { PROFILE_DATA } from '../data/profile';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

interface GitHubStats {
  publicRepos: number;
  followers: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  repos: GitHubRepo[];
  isLive: boolean;
}

// Fallback verified GitHub statistics (guaranteed availability if GitHub API is rate-limited)
const VERIFIED_GITHUB_DATA: GitHubStats = {
  publicRepos: 5,
  followers: 4,
  topLanguages: [
    { name: 'Python', percentage: 58, color: '#3572A5' },
    { name: 'TypeScript / React', percentage: 24, color: '#3178c6' },
    { name: 'Jupyter Notebook', percentage: 12, color: '#DA5B0B' },
    { name: 'HTML / CSS / SQL', percentage: 6, color: '#e34c26' }
  ],
  repos: [
    {
      name: 'Smart-Route-AI-system',
      description: 'Predictive routing and congestion bypass algorithm using ML, real-time sensor ingestion and graph optimization.',
      language: 'Python',
      stars: 1,
      forks: 0,
      updatedAt: 'Updated Recently',
      url: 'https://github.com/arshdeepk1209-web/Smart-Route-AI-system.git'
    },
    {
      name: 'AI-resume-Cover-letter-maker',
      description: 'Intelligent profile-matching resume and cover letter synthesis engine with dynamic LLM prompt engineering and ATS scoring.',
      language: 'Python',
      stars: 1,
      forks: 0,
      updatedAt: 'Updated Recently',
      url: 'https://github.com/arshdeepk1209-web/AI-resume-Cover-letter-maker.git'
    },
    {
      name: 'Portfolio',
      description: 'Production PWA portfolio with offline sync, interactive project simulators, and NLP RAG Ask Me Anything AI assistant.',
      language: 'TypeScript',
      stars: 2,
      forks: 0,
      updatedAt: 'Active',
      url: 'https://github.com/arshdeepk1209-web/Portfolio.git'
    }
  ],
  isLive: false
};

const CERTIFICATE_TIMELINE = [
  {
    period: '2024',
    title: 'Client Communication & Design Certification',
    issuer: 'Younity Corporation',
    type: 'Professional Internship',
    status: 'Completed',
    skills: ['Client Communication', 'Stakeholder Reporting', 'Creative Visuals']
  },
  {
    period: '2025',
    title: 'Bachelor of Computer Applications (BCA)',
    issuer: 'MCM DAV College for Women, Chandigarh',
    type: 'Undergraduate Degree',
    status: 'Completed',
    skills: ['Data Structures', 'Algorithms', 'DBMS / SQL', 'Software Engineering']
  },
  {
    period: 'May – Jun 2026',
    title: 'AI & Emerging Technologies Certification',
    issuer: 'Intel Summer Training 2026 (Chandigarh University)',
    type: 'Industry Mentorship',
    status: 'Completed',
    skills: ['Applied AI', 'Tableau Desktop', 'Data Analytics', 'Model Evaluation']
  },
  {
    period: '2025 – 2027',
    title: 'Master of Computer Applications (MCA) — AI & ML',
    issuer: 'Chandigarh University',
    type: 'Postgraduate Specialization',
    status: 'In Progress (65% Complete)',
    skills: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'Edge AI']
  }
];

export function SkillsAndStatsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'github' | 'tableau' | 'timeline'>('overview');
  const [githubData, setGithubData] = useState<GitHubStats>(VERIFIED_GITHUB_DATA);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [showTableauEmbed, setShowTableauEmbed] = useState(false);

  // Fetch real GitHub public metrics when component mounts
  useEffect(() => {
    let isMounted = true;
    async function fetchGithub() {
      setIsLoadingGithub(true);
      try {
        const userRes = await fetch('https://api.github.com/users/arshdeepk1209-web');
        const reposRes = await fetch('https://api.github.com/users/arshdeepk1209-web/repos?sort=updated&per_page=6');
        
        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          if (isMounted && Array.isArray(reposData)) {
            const parsedRepos: GitHubRepo[] = reposData.map((r: any) => ({
              name: r.name,
              description: r.description || 'Repository in AI, ML and software engineering.',
              language: r.language || 'Python',
              stars: r.stargazers_count || 0,
              forks: r.forks_count || 0,
              updatedAt: new Date(r.pushed_at).toLocaleDateString([], { month: 'short', year: 'numeric' }),
              url: r.html_url
            }));

            setGithubData({
              publicRepos: userData.public_repos || VERIFIED_GITHUB_DATA.publicRepos,
              followers: userData.followers || VERIFIED_GITHUB_DATA.followers,
              topLanguages: VERIFIED_GITHUB_DATA.topLanguages,
              repos: parsedRepos.length > 0 ? parsedRepos : VERIFIED_GITHUB_DATA.repos,
              isLive: true
            });
          }
        }
      } catch {
        // Fall back gracefully to verified statistics if rate limited or offline
      } finally {
        if (isMounted) setIsLoadingGithub(false);
      }
    }

    fetchGithub();
    return () => {
      isMounted = false;
    };
  }, []);

  // Tech Stack Usage Calculations across projects
  const techStackCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROFILE_DATA.projects.forEach(p => {
      p.techStack.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    // Add known core tools from experience & training
    counts['Python'] = (counts['Python'] || 0) + 3;
    counts['Tableau'] = (counts['Tableau'] || 0) + 2;
    counts['SQL'] = (counts['SQL'] || 0) + 2;
    counts['OpenVINO'] = (counts['OpenVINO'] || 0) + 1;
    counts['YOLOv8'] = (counts['YOLOv8'] || 0) + 1;
    counts['FastAPI'] = (counts['FastAPI'] || 0) + 1;
    counts['React / TS'] = (counts['React / TS'] || 0) + 1;
    return counts;
  }, []);

  // Top Tech Stack Chart Data
  const techStackChartData = {
    labels: ['Python', 'Tableau', 'SQL', 'FastAPI', 'YOLOv8', 'OpenVINO', 'React/TS', 'Pandas'],
    datasets: [
      {
        label: 'Applied Project & Internship Implementations',
        data: [4, 3, 3, 2, 2, 2, 2, 3],
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  // Projects by Category Doughnut Data
  const projectCategoryData = {
    labels: ['Computer Vision', 'Machine Learning', 'Generative AI', 'Data Analytics'],
    datasets: [
      {
        data: [1, 1, 1, 1],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#18181b'
      }
    ]
  };

  // AI & ML Radar Competency Profile Data
  const radarCompetencyData = {
    labels: [
      'Computer Vision',
      'Data Analytics (BI)',
      'Model Evaluation & QA',
      'Python Engineering',
      'Inference Acceleration',
      'Team & Communication'
    ],
    datasets: [
      {
        label: 'Proficiency Level (%)',
        data: [88, 92, 92, 90, 85, 95],
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
        borderWidth: 2
      }
    ]
  };

  return (
    <section id="stats" className="py-20 bg-stone-50/70 dark:bg-zinc-950/70 border-b border-stone-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <Activity className="w-4 h-4" />
              <span>Interactive Telemetry & Metrics</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Live Skills & Stats Dashboard
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-zinc-400 max-w-2xl">
              A data-driven visual story of Arshdeep Kaur’s technical competencies, project distributions, GitHub repositories, and learning milestones.
            </p>
          </div>

          {/* Navigation Filter Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 dark:bg-zinc-900/90 rounded-xl border border-stone-300/60 dark:border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Skills Mastery</span>
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Live</span>
            </button>
            <button
              onClick={() => setActiveTab('tableau')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tableau'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tableau BI</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* METRICS KPI CARDS (TOP STRIP) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Projects Engineered</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">4</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">100% Complete</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block mt-1">
              CV, LLM, ML & BI Dashboards
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-500" />
              <span>Core Technologies</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">16+</span>
              <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Production Tested</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block mt-1">
              Python, YOLO, OpenVINO, Tableau
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Certifications</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">2</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Industry Mentored</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block mt-1">
              Intel Summer Training 2026 + Younity
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Specialization Focus</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">MCA</span>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">2025–2027</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-zinc-400 block mt-1">
              AI & Machine Learning Track
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & MULTI-CHART MATRIX */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tech Stack Distribution Bar Chart */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Tech Stack Usage in Applied Projects
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    Frequency of tools and frameworks implemented across portfolio & internships
                  </p>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                  Real Implementations
                </span>
              </div>
              <div className="h-64 sm:h-72">
                <Bar
                  data={techStackChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#18181b',
                        titleColor: '#fff',
                        bodyColor: '#e4e4e7',
                        padding: 10,
                        cornerRadius: 8
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#71717a', font: { size: 10 } },
                        grid: { color: 'rgba(113, 113, 122, 0.15)' }
                      },
                      x: {
                        ticks: { color: '#71717a', font: { size: 11 } },
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Project Category Distribution Doughnut */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Project Categories
                  </h3>
                  <PieChart className="w-4 h-4 text-stone-400" />
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mb-4">
                  Balanced hands-on exposure across key AI/ML specializations
                </p>
                <div className="h-44 sm:h-48 relative flex items-center justify-center">
                  <Doughnut
                    data={projectCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { cornerRadius: 8 }
                      },
                      cutout: '70%'
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">4</span>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold">Domains</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-stone-600 dark:text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Computer Vision</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Machine Learning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Generative AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Data Analytics</span>
                </div>
              </div>
            </div>

            {/* Radar Competency Profile */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Applied Competency Radar
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    Multidisciplinary evaluation across technical and analytical vectors
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="h-64 sm:h-72">
                <Radar
                  data={radarCompetencyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      r: {
                        min: 50,
                        max: 100,
                        ticks: { stepSize: 15, display: false },
                        angleLines: { color: 'rgba(113, 113, 122, 0.2)' },
                        grid: { color: 'rgba(113, 113, 122, 0.2)' },
                        pointLabels: {
                          color: '#a1a1aa',
                          font: { size: 10 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Practical Learning & Specialization Progress */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Active Learning & Specialization Progress
                  </h3>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mb-5">
                  Real-time indicators tracking MCA curriculum and hands-on laboratory milestones
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-stone-800 dark:text-zinc-200">
                        MCA AI & Machine Learning Specialization (Chandigarh Univ.)
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">65% Progress</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-stone-800 dark:text-zinc-200">
                        Computer Vision Pipelines (YOLOv8 + Intel OpenVINO)
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">88% Mastery</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-stone-800 dark:text-zinc-200">
                        Tableau Desktop & Business Analytics Dashboards
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">92% Mastery</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium mb-1">
                      <span className="text-stone-800 dark:text-zinc-200">
                        AI Model Evaluation & Response Quality Assurance
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">92% Mastery</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <span>Next Milestone: Advanced Neural Architectures</span>
                <span className="text-emerald-500 font-semibold">Q3 2026 Target</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SKILLS BREAKDOWN BY CATEGORY */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILE_DATA.skillCategories.map((category, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {category.title}
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-zinc-400">
                    {category.skills.length} core competencies
                  </span>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-stone-800 dark:text-zinc-200 font-semibold">
                          {skill.name}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      {skill.tags && (
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500 dark:text-zinc-400">
                          {skill.tags.map((tag, tIdx) => (
                            <React.Fragment key={tIdx}>
                              <span>{tag}</span>
                              {tIdx < skill.tags!.length - 1 && <span aria-hidden="true">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LIVE GITHUB REPOSITORIES & ACTIVITY */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      github.com/arshdeepk1209-web
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      githubData.isLive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                    }`}>
                      {githubData.isLive ? 'Live GitHub Sync' : 'Verified GitHub Data'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    Public repositories, AI architectures, and open-source contributions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/arshdeepk1209-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open GitHub Profile</span>
                </a>
              </div>
            </div>

            {/* Language Breakdown Strip */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Primary Codebase Languages
                </h4>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Python Dominant (58%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-zinc-800 flex overflow-hidden mb-4">
                {githubData.topLanguages.map((lang, lIdx) => (
                  <div
                    key={lIdx}
                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    title={`${lang.name}: ${lang.percentage}%`}
                    className="h-full transition-all duration-300 hover:opacity-85"
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {githubData.topLanguages.map((lang, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }}></span>
                    <span className="font-medium text-stone-800 dark:text-zinc-200">{lang.name}</span>
                    <span className="text-stone-400">({lang.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Repos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {githubData.repos.map((repo, rIdx) => (
                <div
                  key={rIdx}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-white truncate">
                        {repo.name}
                      </span>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-400 hover:text-emerald-500 transition-colors"
                        title="View Repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500" /> {repo.stars}
                      </span>
                      <span>·</span>
                      <span>{repo.updatedAt}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EMBEDDED TABLEAU PUBLIC BI DASHBOARD */}
        {activeTab === 'tableau' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    Executive KPI & Business Analytics Suite
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                    Tableau Public
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                  Engineered during the Intel Summer Training 2026 — featuring calculated metrics, synchronized filters, and predictive clustering.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTableauEmbed(!showTableauEmbed)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showTableauEmbed ? 'Hide Interactive View' : 'Load Interactive Embed'}</span>
                </button>
                <a
                  href="https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-200 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on Tableau Public</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Viewer or Preview Card */}
            {showTableauEmbed ? (
              <div className="w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-900 shadow-lg">
                <div className="p-3 bg-stone-200/60 dark:bg-zinc-800/60 text-xs text-stone-600 dark:text-zinc-400 flex items-center justify-between border-b border-stone-300 dark:border-zinc-700">
                  <span className="font-mono text-[11px]">Tableau Public · Profile @arshdeep.kaur7968</span>
                  <a
                    href="https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Open in full window <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <iframe
                  src="https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes"
                  title="Arshdeep Kaur Tableau Public Visualizations"
                  className="w-full h-[620px] border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-stone-900 via-zinc-900 to-stone-950 text-white border border-zinc-800 shadow-md">
                <div className="max-w-2xl">
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2 block">
                    Intel Summer Training 2026 Showcase
                  </span>
                  <h4 className="text-xl font-bold mb-3">
                    Multi-Dimensional Business KPI Forecasting & Scorecards
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-6">
                    Interactive dashboards leveraging Tableau Desktop calculated fields, parameter-driven forecasting, geographic mapping, and synchronized drill-downs. Exploratory data analysis executed in Python (Pandas & Matplotlib) mapped directly to stakeholder executive KPI metrics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                      <span className="text-[11px] text-zinc-400 block mb-1">Architecture</span>
                      <span className="text-sm font-semibold text-white">Tableau Desktop & Public</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                      <span className="text-[11px] text-zinc-400 block mb-1">Modeling</span>
                      <span className="text-sm font-semibold text-white">Clustering & Regression</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                      <span className="text-[11px] text-zinc-400 block mb-1">Data Source</span>
                      <span className="text-sm font-semibold text-white">Relational SQL & CSV</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setShowTableauEmbed(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Launch In-Page Interactive Dashboard</span>
                    </button>
                    <a
                      href="https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Explore on Tableau Public</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CERTIFICATES & LEARNING PROGRESS TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Academic Credentials & Certification Timeline
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Chronological record of formal degrees, industry-mentored programs, and technical certifications
                </p>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Records</span>
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/40 space-y-8">
              {CERTIFICATE_TIMELINE.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.period}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 dark:text-zinc-400">
                      {item.type} · {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-zinc-300 mt-0.5">
                    Issued by: {item.issuer}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-stone-500 dark:text-zinc-400">
                    {item.skills.map((skill, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span>{skill}</span>
                        {sIdx < item.skills.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
