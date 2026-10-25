import { PORTFOLIO_CORPUS, PortfolioChunk } from '../data/portfolioCorpus';

export interface RetrievalResult {
  chunk: PortfolioChunk;
  score: number;
  matchedTokens: string[];
}

export interface RAGResponse {
  answer: string;
  retrievedChunks: RetrievalResult[];
  confidence: number;
  isGrounded: boolean;
  sourceType: 'gemini-llm' | 'local-rag-synthesizer';
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'tell', 'know', 'give', 'show', 'list'
]);

// Semantic synonyms and expansion mappings for technical vocabulary
const SYNONYMS: Record<string, string[]> = {
  ml: ['machine', 'learning', 'algorithms', 'scikit-learn', 'models'],
  ai: ['artificial', 'intelligence', 'deep', 'learning', 'models'],
  cv: ['computer', 'vision', 'opencv', 'yolov8', 'blip-2', 'easyocr', 'image'],
  vision: ['computer', 'vision', 'yolov8', 'blip-2', 'opencv', 'easyocr', 'vaab'],
  react: ['react', 'frontend', 'typescript', 'tailwind', 'ui'],
  college: ['education', 'degree', 'chandigarh', 'university', 'mca', 'bca', 'mcm', 'dav'],
  university: ['chandigarh', 'university', 'education', 'degree', 'mca'],
  school: ['education', 'degree', 'chandigarh', 'university', 'mca', 'bca'],
  degree: ['mca', 'bca', 'education', 'master', 'bachelor', 'chandigarh'],
  studies: ['education', 'degree', 'mca', 'bca', 'chandigarh'],
  internship: ['intel', 'experience', 'training', 'summer', 'younity'],
  work: ['experience', 'intel', 'internship', 'analyst', 'qa', 'training'],
  job: ['experience', 'role', 'internship', 'analyst', 'intel', 'availability'],
  cert: ['certification', 'certificate', 'intel', 'younity', 'credentials'],
  certificates: ['certification', 'certificate', 'intel', 'younity', 'credentials'],
  courses: ['certification', 'certificate', 'intel', 'training'],
  contact: ['email', 'phone', 'reach', 'message', 'inbox', 'hire', 'linkedin', 'github'],
  email: ['arshdeepk1209@gmail.com', 'email', 'contact', 'inbox', 'message'],
  hire: ['availability', 'contact', 'email', 'roles', 'open'],
  reach: ['contact', 'email', 'phone', 'linkedin'],
  phone: ['phone', 'contact', 'call', '+91', '7888981630'],
  location: ['chandigarh', 'india', '140301', 'address', 'city'],
  where: ['chandigarh', 'india', 'location'],
  projects: ['vaab', 'resume', 'smart', 'route', 'tableau', 'github'],
  fastapi: ['fastapi', 'vaab', 'api', 'backend', 'python'],
  tableau: ['tableau', 'desktop', 'public', 'bi', 'dashboards', 'kpi', 'intel'],
  python: ['python', 'pandas', 'numpy', 'scikit-learn', 'matplotlib'],
  nlp: ['resume', 'blip-2', 'generative', 'llm', 'language'],
  stats: ['dashboard', 'analytics', 'charts', 'telemetry', 'github', 'tableau'],
  dashboard: ['stats', 'analytics', 'charts', 'chart.js', 'github', 'tableau', 'timeline'],
  lstm: ['lstm', 'autocomplete', 'next-word', 'rnn', 'recurrent', 'sequence', 'nlp', 'model'],
  autocomplete: ['autocomplete', 'lstm', 'next-word', 'suggestions', 'prediction']
};

/**
 * Tokenize a text string into normalized stems and terms
 */
export function tokenize(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(w => w.length > 1 && !STOP_WORDS.has(w));

  // Expand with synonyms
  const tokens = new Set<string>();
  for (const word of words) {
    tokens.add(word);
    if (SYNONYMS[word]) {
      for (const syn of SYNONYMS[word]) {
        tokens.add(syn);
      }
    }
  }

  return Array.from(tokens);
}

/**
 * Build term frequency vector for a text chunk
 */
function createVector(chunk: PortfolioChunk): Record<string, number> {
  const vector: Record<string, number> = {};
  
  // Title tokens weighted heavily
  const titleTokens = tokenize(chunk.title);
  for (const t of titleTokens) {
    vector[t] = (vector[t] || 0) + 3.0;
  }

  // Tags weighted very heavily
  for (const tag of chunk.tags) {
    const tagTokens = tokenize(tag);
    for (const t of tagTokens) {
      vector[t] = (vector[t] || 0) + 4.0;
    }
  }

  // Content tokens
  const contentTokens = tokenize(chunk.content);
  for (const t of contentTokens) {
    vector[t] = (vector[t] || 0) + 1.0;
  }

  // Normalize vector
  let sumSq = 0;
  for (const key in vector) {
    sumSq += vector[key] * vector[key];
  }
  const mag = Math.sqrt(sumSq) || 1;
  for (const key in vector) {
    vector[key] = vector[key] / mag;
  }

  return vector;
}

// Pre-computed vector index for the portfolio corpus
interface IndexedChunk {
  chunk: PortfolioChunk;
  vector: Record<string, number>;
}

const INDEXED_CORPUS: IndexedChunk[] = PORTFOLIO_CORPUS.map(chunk => ({
  chunk,
  vector: createVector(chunk)
}));

/**
 * Semantic Vector Search & Ranking:
 * Computes Cosine Similarity between Query Vector and Chunk Vectors.
 */
export function retrieveRelevantChunks(query: string, topK: number = 3): RetrievalResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  // Build query vector
  const queryVec: Record<string, number> = {};
  for (const t of queryTokens) {
    queryVec[t] = (queryVec[t] || 0) + 1.0;
  }
  let qSumSq = 0;
  for (const k in queryVec) {
    qSumSq += queryVec[k] * queryVec[k];
  }
  const qMag = Math.sqrt(qSumSq) || 1;
  for (const k in queryVec) {
    queryVec[k] = queryVec[k] / qMag;
  }

  const results: RetrievalResult[] = [];

  for (const item of INDEXED_CORPUS) {
    let dotProduct = 0;
    const matchedTokens: string[] = [];

    for (const token in queryVec) {
      if (item.vector[token]) {
        dotProduct += queryVec[token] * item.vector[token];
        matchedTokens.push(token);
      }
    }

    // Keyword exact phrase bonus for technical terms
    const lowerContent = item.chunk.content.toLowerCase();
    const lowerTitle = item.chunk.title.toLowerCase();
    const rawQuery = query.toLowerCase().trim();

    let bonus = 0;
    for (const qWord of queryTokens) {
      if (lowerTitle.includes(qWord)) {
        bonus += 0.15;
      }
      if (item.chunk.tags.some(tag => tag.toLowerCase().includes(qWord))) {
        bonus += 0.2;
      }
    }

    // Specific exact matches (e.g. "React", "Tableau", "VAAB", "Intel")
    if (rawQuery.includes('react') && item.chunk.id === 'skills-web-react') {
      bonus += 0.45;
    }
    if ((rawQuery.includes('intel') || rawQuery.includes('training')) && (item.chunk.id === 'exp-intel' || item.chunk.id === 'cert-intel')) {
      bonus += 0.35;
    }
    if ((rawQuery.includes('mca') || rawQuery.includes('college') || rawQuery.includes('degree') || rawQuery.includes('university') || rawQuery.includes('education')) && item.chunk.category === 'education') {
      bonus += 0.35;
    }
    if ((rawQuery.includes('cert') || rawQuery.includes('credential')) && item.chunk.category === 'certification') {
      bonus += 0.35;
    }
    if ((rawQuery.includes('contact') || rawQuery.includes('email') || rawQuery.includes('reach') || rawQuery.includes('phone') || rawQuery.includes('hire')) && (item.chunk.id === 'contact-details' || item.chunk.id === 'bio-overview')) {
      bonus += 0.35;
    }
    if ((rawQuery.includes('ml') || rawQuery.includes('machine learning') || rawQuery.includes('vision') || rawQuery.includes('project')) && item.chunk.category === 'project') {
      bonus += 0.25;
    }

    const finalScore = Math.min(1.0, dotProduct + bonus);

    if (finalScore > 0.08) {
      results.push({
        chunk: item.chunk,
        score: finalScore,
        matchedTokens
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/**
 * Anti-Hallucination & Grounding Check:
 * If the query is completely outside the domain of Arshdeep's verified portfolio,
 * we strictly return the unknown response.
 */
const UNKNOWN_RESPONSE = 
  "I don't have information about that in Arshdeep's verified portfolio. " +
  "As her portfolio AI assistant, I only answer questions strictly verified from her projects, skills, education, experience, and certifications.";

/**
 * Local Grounded Synthesis Engine (RAG fallback for static GitHub Pages / offline):
 * Accurately synthesizes the grounded answer using retrieved facts and citations.
 */
function synthesizeLocalGroundedAnswer(query: string, retrieved: RetrievalResult[]): string {
  const lowerQuery = query.toLowerCase();

  // Check for specific common recruiter inquiries
  if (lowerQuery.includes('react')) {
    const reactChunk = retrieved.find(r => r.chunk.id === 'skills-web-react') || retrieved[0];
    return `**Yes, Arshdeep knows React.**\n\n` +
      `Arshdeep possesses practical, hands-on working knowledge of **React, TypeScript, and Tailwind CSS**, as demonstrated in her interactive portfolio and web application interfaces.\n\n` +
      `While her primary specialization and career focus is in **Applied AI, Machine Learning, and Data Analytics**, she is adept at integrating machine learning pipelines with responsive React frontend applications and interactive simulations.\n\n` +
      `*[Source: ${reactChunk.chunk.title}]*`;
  }

  if (lowerQuery.includes('machine learning') && (lowerQuery.includes('project') || lowerQuery.includes('done') || lowerQuery.includes('work'))) {
    return `**Arshdeep's Machine Learning & AI Projects:**\n\n` +
      `1. **VAAB — Visual AI Assistant for the Blind**: An assistive computer vision system combining YOLOv8 object detection, BLIP-2 image captioning, EasyOCR, and gTTS, accelerated with Intel OpenVINO on FastAPI.\n` +
      `2. **Smart Route AI System**: Predictive routing algorithm utilizing machine learning and graph optimization to minimize commute latency and vehicle emissions based on real-time and historical sensor traffic logs.\n` +
      `3. **AI Resume & Cover Letter Generator**: Generative AI system aligning candidate qualifications to target job descriptions with automated ATS keyword matching and PDF generation.\n` +
      `4. **Executive KPI & Business Analytics Dashboards**: Interactive Tableau Public dashboards featuring predictive clustering and calculated metrics developed during her Intel Summer Training.\n\n` +
      `*[Sources: Projects & Experience Knowledge Base]*`;
  }

  if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('college') || lowerQuery.includes('university') || lowerQuery.includes('mca') || lowerQuery.includes('bca')) {
    return `**Arshdeep Kaur's Educational Background:**\n\n` +
      `• **Master of Computer Applications (MCA) — AI & Machine Learning**: Currently pursuing at **Chandigarh University** (2025–2027), focusing on deep learning, neural networks, computer vision, and big data analytics.\n` +
      `• **Bachelor of Computer Applications (BCA)**: Completed in **2025** at **MCM DAV College for Women, Chandigarh**, with a strong foundation in data structures, algorithms, databases, and software engineering.\n\n` +
      `*[Source: Verified Education Credentials]*`;
  }

  if (lowerQuery.includes('intel') || lowerQuery.includes('internship') || lowerQuery.includes('training')) {
    return `**Intel Summer Training 2026 Experience:**\n\n` +
      `Arshdeep served as an **AI & Emerging Technologies Intern** during the Intel Summer Training 2026 program at Chandigarh University (May–June 2026).\n\n` +
      `• Built interactive Tableau dashboards for KPI tracking, using calculated fields, parameters, and predictive clustering.\n` +
      `• Conducted exploratory data analysis in Python using Pandas, NumPy, and Matplotlib.\n` +
      `• Explored core machine learning concepts including regression, classification, clustering, and model evaluation for business decisions.\n\n` +
      `*[Source: Intel Summer Training 2026 Experience & Certification]*`;
  }

  if (lowerQuery.includes('certif') || lowerQuery.includes('credential')) {
    return `**Arshdeep's Verified Certifications:**\n\n` +
      `1. **Certificate of Completion — Intel Summer Training 2026** (Intel & Chandigarh University): Industry-mentored program covering Applied AI, Data Science, Machine Learning, and Python for Business Analytics.\n` +
      `2. **Internship Certificate — Graphic Design & Client Communication (2024)** (Younity Corporation): Professional credential demonstrating excellence in client communication and cross-functional team delivery.\n\n` +
      `*[Source: Verified Certifications Record]*`;
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('phone') || lowerQuery.includes('reach') || lowerQuery.includes('hire')) {
    return `**How to Contact & Hire Arshdeep Kaur:**\n\n` +
      `• **Email**: [arshdeepk1209@gmail.com](mailto:arshdeepk1209@gmail.com)\n` +
      `• **Phone**: +91 7888981630\n` +
      `• **Location**: Chandigarh, India (140301)\n` +
      `• **LinkedIn**: [linkedin.com/in/arshdeep-kaur-9ba3a1357](https://linkedin.com/in/arshdeep-kaur-9ba3a1357)\n` +
      `• **GitHub**: [github.com/arshdeepk1209-web](https://github.com/arshdeepk1209-web)\n` +
      `• **Tableau Portfolio**: [public.tableau.com/app/profile/arshdeep.kaur7968/vizzes](https://public.tableau.com/app/profile/arshdeep.kaur7968/vizzes)\n\n` +
      `You can also send a direct message immediately via the in-app contact form at the bottom of this portfolio.\n\n` +
      `*[Source: Verified Contact Details]*`;
  }

  // General grounded synthesis from top retrieved chunks
  const primaryChunk = retrieved[0].chunk;
  const secondaryChunks = retrieved.slice(1);

  let synthesized = `Based on Arshdeep Kaur's verified portfolio:\n\n`;
  synthesized += `${primaryChunk.content}\n\n`;

  if (secondaryChunks.length > 0 && secondaryChunks[0].score > 0.3) {
    synthesized += `**Related Context (${secondaryChunks[0].chunk.title}):**\n${secondaryChunks[0].chunk.content}\n\n`;
  }

  synthesized += `*[Sources: ${retrieved.map(r => r.chunk.title).join('; ')}]*`;
  return synthesized;
}

/**
 * Execute the complete RAG Pipeline:
 * 1. Text chunking & tokenization
 * 2. Semantic vector cosine similarity retrieval
 * 3. Confidence threshold / Anti-hallucination verification
 * 4. Grounded generation (via /api/chat LLM endpoint or local deterministic RAG engine)
 */
export async function askPortfolioAI(query: string): Promise<RAGResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      answer: "Please ask a question about Arshdeep's projects, skills, education, certifications, or experience.",
      retrievedChunks: [],
      confidence: 0,
      isGrounded: true,
      sourceType: 'local-rag-synthesizer'
    };
  }

  // Step 1 & 2: Semantic retrieval of relevant chunks
  const retrieved = retrieveRelevantChunks(trimmed, 3);
  const topScore = retrieved.length > 0 ? retrieved[0].score : 0;

  // Step 3: Strict anti-hallucination guardrail
  // If no chunks match with sufficient relevance, refuse to answer
  if (retrieved.length === 0 || topScore < 0.22) {
    return {
      answer: UNKNOWN_RESPONSE,
      retrievedChunks: retrieved,
      confidence: topScore,
      isGrounded: false,
      sourceType: 'local-rag-synthesizer'
    };
  }

  // Step 4: Generation via backend API endpoint if available, otherwise local RAG synthesis
  try {
    const apiPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: trimmed,
        retrievedChunks: retrieved.map(r => ({
          title: r.chunk.title,
          category: r.chunk.category,
          content: r.chunk.content
        }))
      })
    });

    // Timeout after 4 seconds so client falls back immediately without lag
    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('API Timeout')), 4000)
    );

    const res = await Promise.race([apiPromise, timeoutPromise]);
    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return {
          answer: data.answer,
          retrievedChunks: retrieved,
          confidence: topScore,
          isGrounded: true,
          sourceType: 'gemini-llm'
        };
      }
    }
  } catch {
    // Graceful fallback to client-side RAG engine (expected on GitHub Pages static host)
  }

  // Synthesize answer deterministically from retrieved verified facts
  const localAnswer = synthesizeLocalGroundedAnswer(trimmed, retrieved);
  return {
    answer: localAnswer,
    retrievedChunks: retrieved,
    confidence: topScore,
    isGrounded: true,
    sourceType: 'local-rag-synthesizer'
  };
}
