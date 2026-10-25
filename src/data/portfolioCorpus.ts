export interface PortfolioChunk {
  id: string;
  title: string;
  category: 'project' | 'skill' | 'education' | 'experience' | 'certification' | 'bio' | 'contact';
  tags: string[];
  content: string;
}

export const PORTFOLIO_CORPUS: PortfolioChunk[] = [
  // BIO & SUMMARY
  {
    id: 'bio-overview',
    title: 'Arshdeep Kaur — Professional Summary & Focus',
    category: 'bio',
    tags: ['about', 'bio', 'who', 'summary', 'profile', 'overview', 'role', 'specialization', 'objective', 'location'],
    content: `Arshdeep Kaur is an AI & Machine Learning Graduate based in Chandigarh, India (Pincode: 140301). She specializes in applied machine learning, computer vision, data analytics, and predictive modeling. She is currently pursuing her Master of Computer Applications (MCA) in AI & Machine Learning (2025–2027) at Chandigarh University. She has hands-on experience through an Intel-mentored AI/ML internship and practical project engineering. She is actively available and open for roles in AI/ML engineering, Computer Vision, and Data Analytics.`
  },
  {
    id: 'contact-details',
    title: 'Contact Information & Social Profiles',
    category: 'contact',
    tags: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'location', 'tableau'],
    content: `Arshdeep Kaur can be contacted directly via email at arshdeepk1209@gmail.com and by phone at +91 7888981630. Her location is Chandigarh, India. Her professional profiles include LinkedIn (https://linkedin.com/in/arshdeep-kaur-9ba3a1357), GitHub (https://github.com/arshdeepk1209-web), and Tableau Public (https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes). In addition, visitors and recruiters can use the direct in-app contact form on this portfolio to send messages immediately to her inbox.`
  },

  // PROJECTS
  {
    id: 'project-vaab',
    title: 'VAAB — Visual AI Assistant for the Blind',
    category: 'project',
    tags: ['vaab', 'vision', 'computer vision', 'blind', 'assistive', 'yolov8', 'blip-2', 'openvino', 'fastapi', 'easyocr', 'gtts', 'opencv', 'object detection', 'scene captioning', 'edge ai'],
    content: `VAAB (Visual AI Assistant for the Blind) is an assistive computer vision system engineered for real-time scene description and obstacle detection for visually impaired users. It is built on FastAPI and combines BLIP-2 image captioning, YOLOv8 object detection, EasyOCR text recognition, and gTTS audio narration. It is deployed and optimized with Intel OpenVINO for low-latency edge inference. Key features include multi-language narration (including Hindi and English), a hands-free continuous camera loop auto-narrate mode, and low-latency obstacle tracking. Tech stack: FastAPI, Intel OpenVINO, YOLOv8, BLIP-2, EasyOCR, gTTS, Python, and OpenCV.`
  },
  {
    id: 'project-ai-resume',
    title: 'AI Resume & Cover Letter Generator',
    category: 'project',
    tags: ['resume', 'cover letter', 'generator', 'generative ai', 'llm', 'nlp', 'ats', 'prompt engineering', 'pdf', 'latex', 'streamlit'],
    content: `The AI Resume & Cover Letter Generator is an intelligent profile-matching application that analyzes candidate career input against job descriptions to auto-generate tailored, job-ready resumes and cover letters. Key capabilities include dynamic LLM prompt engineering, ATS keyword alignment scoring, automated PDF generation, and customizable template styling. Tech stack: Python, Streamlit, Generative AI, LLM Prompt Engineering, PDF Generation, and REST APIs. GitHub repository: https://github.com/arshdeepk1209-web/AI-resume-Cover-letter-maker.git.`
  },
  {
    id: 'project-smart-route',
    title: 'Smart Route AI System',
    category: 'project',
    tags: ['smart route', 'route', 'traffic', 'optimization', 'machine learning', 'graph', 'scikit-learn', 'pandas', 'numpy', 'congestion', 'eta'],
    content: `The Smart Route AI System is a predictive routing and congestion bypass algorithm using machine learning. It computes the most efficient travel paths by ingesting real-time traffic sensor data and historical congestion trends. It utilizes graph-based optimization algorithms to minimize commute latency and vehicle carbon footprint, paired with a telemetry dashboard calculating ETA and alternate path confidence scores. Tech stack: Python, Machine Learning, NumPy, Pandas, Graph Algorithms, Scikit-Learn, and REST APIs. GitHub repository: https://github.com/arshdeepk1209-web/Smart-Route-AI-system.git.`
  },
  {
    id: 'project-tableau-bi',
    title: 'Executive KPI & Business Analytics Dashboards (Tableau)',
    category: 'project',
    tags: ['tableau', 'bi', 'business intelligence', 'kpi', 'dashboards', 'analytics', 'data visualization', 'sql', 'python', 'eda', 'intel'],
    content: `Arshdeep developed enterprise-grade visual analytics and business decision dashboards hosted on Tableau Public during her Intel Summer Training. The dashboards feature calculated fields, custom geographic mapping, synchronized filters, parameters, stories, and predictive clustering for business KPI forecasting. She applied exploratory data analysis (EDA) in Python (Pandas, NumPy, Matplotlib) and mapped insights to executive KPI scorecards. Tableau Public link: https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes.`
  },

  // EXPERIENCE
  {
    id: 'exp-intel',
    title: 'AI & Emerging Technologies Intern — Intel Summer Training 2026',
    category: 'experience',
    tags: ['intel', 'internship', 'summer training', 'chandigarh university', 'tableau', 'python', 'pandas', 'numpy', 'sql', 'regression', 'clustering', 'experience'],
    content: `Arshdeep served as an AI & Emerging Technologies Intern in the Intel Summer Training 2026 program at Chandigarh University (May 2026 – June 2026). During this intensive industry-mentored program, she worked with applied AI/ML, data science, and business analytics. She built interactive Tableau dashboards for KPI tracking and performance analysis with calculated fields and parameters. She applied Python (Pandas, NumPy, Matplotlib) for data preprocessing and analysis, foundational SQL querying, and explored core machine learning models including regression, classification, clustering, and model evaluation.`
  },
  {
    id: 'exp-ai-qa',
    title: 'AI Training & Quality Assurance Analyst — Freelance Engagements',
    category: 'experience',
    tags: ['quality assurance', 'qa', 'model evaluation', 'benchmarking', 'scoring', 'annotation', 'comparative analysis', 'freelance'],
    content: `Arshdeep works as an AI Training & Quality Assurance Analyst across freelance and independent client engagements. Her responsibilities include conducting structured AI model evaluations, scoring model responses, performing comparative model analysis, and authoring rigorous justifications across LLMs and AI outputs. She analyzes evaluation benchmarks and criteria alignment to improve deterministic outputs and collaborates with stakeholders to translate business requirements into structured evaluation benchmarks.`
  },

  // EDUCATION
  {
    id: 'edu-mca',
    title: 'Master of Computer Applications (MCA) — AI & Machine Learning',
    category: 'education',
    tags: ['mca', 'master', 'chandigarh university', 'degree', 'education', 'college', 'university', 'ai', 'machine learning', '2025', '2027'],
    content: `Arshdeep Kaur is currently pursuing her Master of Computer Applications (MCA) with a specialization in Artificial Intelligence & Machine Learning at Chandigarh University (2025–2027). Her curriculum focuses on deep learning, neural networks, computer vision, natural language processing, advanced data analytics, and big data systems.`
  },
  {
    id: 'edu-bca',
    title: 'Bachelor of Computer Applications (BCA)',
    category: 'education',
    tags: ['bca', 'bachelor', 'mcm dav', 'chandigarh', 'degree', 'education', 'undergraduate', 'graduated', '2025'],
    content: `Arshdeep graduated with a Bachelor of Computer Applications (BCA) in 2025 from MCM DAV College for Women, Chandigarh. Her academic foundations cover data structures and algorithms, object-oriented programming, database management systems (DBMS/SQL), software engineering, and computer networking.`
  },

  // CERTIFICATIONS
  {
    id: 'cert-intel',
    title: 'Certificate of Completion — Intel Summer Training 2026',
    category: 'certification',
    tags: ['certificate', 'intel', 'certification', 'credentials', 'chandigarh university', 'applied ai', 'data science'],
    content: `Certified in Applied AI & Emerging Technologies from Intel and Chandigarh University (2026). Hands-on industry-mentored training covering Applied AI, Data Science, Machine Learning modeling (regression, classification, clustering), and Python for Business Analytics.`
  },
  {
    id: 'cert-younity',
    title: 'Internship Certificate — Client Communication & Design (Younity Corporation)',
    category: 'certification',
    tags: ['certificate', 'younity', 'certification', 'communication', 'design', 'soft skills'],
    content: `Awarded Internship Certificate from Younity Corporation (2024), demonstrating professional excellence in client communication, cross-functional team collaboration, and creative visual delivery.`
  },

  // SKILLS & TECHNICAL STACK
  {
    id: 'skills-ml-cv',
    title: 'Machine Learning & Computer Vision Skills',
    category: 'skill',
    tags: ['skills', 'machine learning', 'computer vision', 'yolov8', 'blip-2', 'opencv', 'easyocr', 'openvino', 'regression', 'classification', 'clustering', 'scikit-learn'],
    content: `Arshdeep's core Machine Learning & Computer Vision technical capabilities include:
- Computer Vision: Object detection (YOLOv8), image captioning (BLIP-2), image processing (OpenCV), and Optical Character Recognition (EasyOCR).
- Inference Acceleration: Edge optimization with Intel OpenVINO and model quantization.
- ML Modeling: Supervised and unsupervised algorithms including Linear/Logistic Regression, Decision Trees, Random Forests, K-Means Clustering, and Scikit-Learn evaluation metrics.`
  },
  {
    id: 'skills-data-programming',
    title: 'Programming, Data Analytics & Database Skills',
    category: 'skill',
    tags: ['python', 'pandas', 'numpy', 'matplotlib', 'tableau', 'sql', 'mongodb', 'fastapi', 'rest api', 'programming', 'languages'],
    content: `Arshdeep's programming and data engineering toolkit comprises:
- Languages & Core Tools: Python (NumPy, Pandas, Matplotlib, Scikit-Learn), SQL.
- Business Intelligence: Tableau Desktop and Tableau Public (interactive KPI dashboards, calculated fields, parameters, stories).
- Databases: Relational SQL and NoSQL (MongoDB).
- Web & APIs: FastAPI, RESTful microservices, and gTTS audio synthesis.`
  },
  {
    id: 'skills-web-react',
    title: 'Web Technologies & Frontend Knowledge (React, TypeScript, Tailwind)',
    category: 'skill',
    tags: ['react', 'frontend', 'typescript', 'javascript', 'tailwind', 'css', 'html', 'web', 'pwa', 'ui'],
    content: `Does Arshdeep know React? Yes. Arshdeep possesses hands-on working knowledge of React, TypeScript, and modern frontend styling with Tailwind CSS, as showcased in her interactive portfolio and modern web user interfaces. While her primary career specialization is Applied AI, Machine Learning, and Data Analytics, she is proficient at integrating AI/ML models with responsive, accessible React applications, PWA architecture, and interactive simulation interfaces.`
  },
  {
    id: 'skills-evaluation-soft',
    title: 'AI Evaluation, QA & Soft Skills',
    category: 'skill',
    tags: ['ai evaluation', 'model evaluation', 'communication', 'collaboration', 'problem solving', 'adaptability', 'team management'],
    content: `Arshdeep's analytical and professional competencies include:
- AI Model Evaluation: Structured response rating, comparative LLM scoring, and evaluation framework benchmarking.
- Soft Skills: Technical and non-technical communication (rated 95%), team coordination and agile collaboration (rated 92%), analytical problem-solving and debugging (rated 94%), and adaptability to emerging technologies (rated 90%).`
  },
  {
    id: 'skills-stats-dashboard',
    title: 'Live Skills & Stats Dashboard (Interactive Telemetry)',
    category: 'skill',
    tags: ['dashboard', 'stats', 'analytics', 'telemetry', 'charts', 'chart.js', 'github', 'activity', 'languages', 'tableau', 'embed', 'timeline'],
    content: `Arshdeep's portfolio features an interactive Live Skills & Stats Dashboard built with Chart.js and live GitHub API integration. Key capabilities include:
- Interactive category breakdown with proficiency meters across Machine Learning, Data Analytics, AI Model QA, and Soft Skills.
- Tech stack usage frequency chart displaying real project implementations (Python, Tableau, SQL, FastAPI, YOLOv8, OpenVINO, React/TypeScript).
- Project domain distribution doughnut chart across Computer Vision, Machine Learning, Generative AI, and Data Analytics.
- Live GitHub integration showing public repositories, commit activity, and language breakdown (58% Python, 24% TypeScript/React, 12% Jupyter Notebook).
- In-page interactive Tableau Public embed featuring executive KPI scorecards from the Intel Summer Training 2026.
- Academic and certification chronological timeline.`
  }
];
