export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Computer Vision' | 'Generative AI' | 'Machine Learning' | 'Data Analytics';
  description: string;
  bullets: string[];
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  tableauUrl?: string;
  badge?: string;
  simulationType?: 'vision' | 'resume-generator' | 'route-optimizer';
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  skills: string[];
  link?: {
    label: string;
    url: string;
  };
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  status: string;
  gradeOrFocus?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; tags?: string[] }[];
}

export const PROFILE_DATA = {
  name: 'Arshdeep Kaur',
  title: 'AI & ML Graduate',
  subheading: 'AI & Machine Learning · Data Analytics · Computer Vision',
  location: 'Chandigarh, India (140301)',
  email: 'arshdeepk1209@gmail.com',
  phone: '+91 7888981630',
  linkedin: 'https://linkedin.com/in/arshdeep-kaur-9ba3a1357',
  github: 'https://github.com/arshdeepk1209-web',
  tableau: 'https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes',
  availability: 'Open for roles in AI/ML & Data Analytics',
  summary: `AI & ML Graduate with hands-on, applied experience across machine learning, computer vision, data analysis, and predictive modeling. Currently pursuing an MCA specializing in AI & Machine Learning (2025–2027), backed by an Intel-mentored AI/ML internship and practical project engineering. Skilled at translating machine learning models and data insights into practical solutions — from computer vision pipelines (YOLOv8, BLIP-2, OpenVINO) to interactive Tableau analytics dashboards. Comfortable collaborating with teams, adapting communication for technical and non-technical audiences, and applying AI/ML tools in real-world contexts.`,
  
  coreStats: [
    { label: 'Role Focus', value: 'AI/ML & Data Analytics' },
    { label: 'Mentorship', value: 'Intel Summer Training' },
    { label: 'Degree', value: 'MCA (2025–2027)' },
    { label: 'Availability', value: 'Open for Roles' }
  ],

  experiences: [
    {
      role: 'AI & Emerging Technologies Intern',
      company: 'Intel Summer Training 2026 — Chandigarh University',
      location: 'Chandigarh, India',
      period: 'May 2026 – Jun 2026',
      highlights: [
        'Completed an intensive, industry-mentored programme covering applied AI/ML, data science, and emerging technology; built interactive Tableau dashboards for KPI tracking and performance analysis.',
        'Worked with Tableau Desktop, calculated fields, filters, parameters, maps, stories, and dashboard actions.',
        'Applied Python (Pandas, NumPy, Matplotlib) for data preprocessing and analysis, gained foundational SQL skills, and explored machine learning concepts including regression, classification, clustering, and model evaluation for business decision-making.'
      ],
      skills: ['Tableau Desktop', 'Python', 'Pandas', 'NumPy', 'Matplotlib', 'SQL', 'Regression', 'Classification', 'Clustering', 'Model Evaluation'],
      link: {
        label: 'View Tableau Public Portfolio',
        url: 'https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes'
      }
    },
    {
      role: 'AI Training & Quality Assurance Analyst',
      company: 'Freelance & Independent Client Engagements',
      location: 'Remote',
      period: 'Ongoing',
      highlights: [
        'Conducting structured AI model evaluations, model response scoring, comparative analysis, and structured justification writing across models.',
        'Analyzing evaluation benchmarks, model consistency, and criteria alignment to improve deterministic outputs in applied contexts.',
        'Collaborating with stakeholders to translate business requirements into structured evaluation benchmarks.'
      ],
      skills: ['Model Evaluation', 'Comparative Analysis', 'Data Analysis', 'Quality Assurance', 'Team Communication', 'Stakeholder Collaboration']
    }
  ] as Experience[],

  projects: [
    {
      id: 'vaab',
      title: 'VAAB — Visual AI Assistant for the Blind',
      subtitle: 'Real-time scene narration and obstacle detection with Intel OpenVINO acceleration',
      category: 'Computer Vision',
      badge: 'Computer Vision',
      description: 'An assistive vision pipeline built on FastAPI that combines BLIP-2 image captioning, YOLOv8 object detection, EasyOCR text recognition, and gTTS audio synthesis, optimized with Intel OpenVINO for real-time edge inference.',
      bullets: [
        'Real-time scene description system for visually impaired users built on FastAPI, combining BLIP-2, YOLOv8, EasyOCR, and gTTS, deployed with Intel OpenVINO for optimized inference.',
        'Added multi-language narration (including Hindi) and a hands-free auto-narrate mode with a continuous camera loop.',
        'Engineered edge-optimized inference pipelines with low latency for assistive vision and obstacle detection.'
      ],
      techStack: ['FastAPI', 'Intel OpenVINO', 'YOLOv8', 'BLIP-2', 'EasyOCR', 'gTTS', 'Python', 'OpenCV'],
      simulationType: 'vision'
    },
    {
      id: 'ai-resume',
      title: 'AI Resume & Cover Letter Generator',
      subtitle: 'Intelligent profile-matching resume and cover letter synthesis engine',
      category: 'Generative AI',
      badge: 'Interactive Generator',
      description: 'AI-powered web app that analyses user career input and auto-generates tailored, job-ready resumes and cover letters with customizable templates and downloadable PDF output.',
      bullets: [
        'Engineered an automated parsing and generation pipeline that aligns candidate profiles against target job descriptions.',
        'Integrated dynamic prompt templates with automated LaTeX/PDF layout synthesis.',
        'Provided real-time ATS keyword matching and role-tailored cover letter generator.'
      ],
      techStack: ['Python', 'Streamlit / Web UI', 'Generative AI', 'LLM Prompt Engineering', 'PDF Generation', 'REST APIs'],
      githubUrl: 'https://github.com/arshdeepk1209-web/AI-resume-Cover-letter-maker.git',
      simulationType: 'resume-generator'
    },
    {
      id: 'smart-route',
      title: 'Smart Route AI System',
      subtitle: 'Predictive routing and congestion bypass algorithm using ML',
      category: 'Machine Learning',
      badge: 'Optimization Engine',
      description: 'AI-driven route optimization system utilizing machine learning models to compute the most efficient paths by ingesting real-time traffic sensor data and historical congestion trends.',
      bullets: [
        'Developed graph-based route optimization models leveraging historical traffic logs and live data feeds.',
        'Minimizes commute latency and carbon footprint through predictive rerouting.',
        'Includes telemetry dashboard with ETA calculation and alternate path confidence scoring.'
      ],
      techStack: ['Python', 'Machine Learning', 'NumPy', 'Pandas', 'Graph Algorithms', 'Scikit-Learn', 'REST APIs'],
      githubUrl: 'https://github.com/arshdeepk1209-web/Smart-Route-AI-system.git',
      simulationType: 'route-optimizer'
    },
    {
      id: 'tableau-bi',
      title: 'Executive KPI & Business Analytics Dashboards',
      subtitle: 'Enterprise-grade visual analytics and machine learning decision models',
      category: 'Data Analytics',
      badge: 'Intel Summer Training',
      description: 'Interactive analytics suites hosted on Tableau Public, leveraging calculated fields, custom geographic mapping, parameters, and predictive clustering for business KPI forecasting.',
      bullets: [
        'Created interactive dashboards with synchronized filters, actions, and drill-downs.',
        'Implemented exploratory data analysis in Python and mapped findings to business KPI scorecards.',
        'Published live on Tableau Public portfolio for stakeholder visibility.'
      ],
      techStack: ['Tableau Desktop', 'SQL', 'Data Analytics', 'Python', 'Pandas', 'Tableau Public'],
      tableauUrl: 'https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes'
    }
  ] as Project[],

  skillCategories: [
    {
      title: 'Machine Learning & Computer Vision',
      skills: [
        { name: 'Computer Vision & Scene Captioning', level: 88, tags: ['BLIP-2', 'YOLOv8', 'OpenCV'] },
        { name: 'Optical Character Recognition', level: 86, tags: ['EasyOCR'] },
        { name: 'Inference Acceleration', level: 85, tags: ['Intel OpenVINO', 'Quantization'] },
        { name: 'ML Algorithms & Modeling', level: 84, tags: ['Regression', 'Classification', 'Clustering'] }
      ]
    },
    {
      title: 'Data Analytics & Technical Stack',
      skills: [
        { name: 'Python Programming', level: 90, tags: ['Pandas', 'NumPy', 'Matplotlib'] },
        { name: 'Data Visualization & BI', level: 92, tags: ['Tableau Desktop', 'Tableau Public', 'Dashboards'] },
        { name: 'Databases & Querying', level: 84, tags: ['SQL', 'MongoDB'] },
        { name: 'Backend & APIs', level: 85, tags: ['FastAPI', 'REST APIs', 'gTTS'] }
      ]
    },
    {
      title: 'AI Evaluation & Applied AI',
      skills: [
        { name: 'Model Evaluation & Response Rating', level: 92, tags: ['Benchmarking', 'Comparative Scoring'] },
        { name: 'Evaluation Framework Design', level: 90, tags: ['Structured Justification', 'Metrics'] },
        { name: 'Data Preprocessing & Analysis', level: 88, tags: ['Feature Engineering', 'Cleaning'] },
        { name: 'Predictive Modeling', level: 85, tags: ['Time-series', 'Graph Optimization'] }
      ]
    },
    {
      title: 'Soft Skills',
      skills: [
        { name: 'Communication', level: 95, tags: ['Technical & Non-Technical', 'Reporting', 'Active Listening'] },
        { name: 'Team Management & Collaboration', level: 92, tags: ['Coordination', 'Cross-Functional', 'Agile'] },
        { name: 'Problem Solving & Critical Thinking', level: 94, tags: ['Analytical', 'Debugging', 'Root Cause'] },
        { name: 'Adaptability & Continuous Learning', level: 90, tags: ['Quick Learner', 'Emerging Tech'] }
      ]
    }
  ] as SkillCategory[],

  education: [
    {
      degree: 'Master of Computer Applications (MCA) — AI & Machine Learning',
      institution: 'Chandigarh University',
      period: '2025 – 2027 (Pursuing)',
      status: 'Pursuing (Specialization in AI & Machine Learning)',
      gradeOrFocus: 'Core Focus: Deep Learning, Neural Networks, Computer Vision, Big Data'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'MCM DAV College for Women, Chandigarh',
      period: 'Graduated 2025',
      status: 'Completed',
      gradeOrFocus: 'Foundations: Algorithms, Data Structures, Database Systems, Software Engineering'
    }
  ] as Education[],

  certifications: [
    {
      name: 'Certificate of Completion — Intel Summer Training 2026',
      issuer: 'Intel & Chandigarh University',
      year: '2026',
      description: 'Hands-on industry-mentored certification in Applied AI, Data Science, Machine Learning, and Python for Business Analytics.'
    },
    {
      name: 'Internship Certificate — Graphic Design & Client Communication',
      issuer: 'Younity Corporation',
      year: '2024',
      description: 'Professional certification demonstrating excellence in client communication, team collaboration, and creative delivery.'
    }
  ] as Certification[]
};
