import React, { useState } from 'react';
import { Eye, Volume2, Cpu, Sparkles, Navigation, CheckCircle2, Play, RefreshCw, FileText, Bot, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const VaabSimulator: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState<'crosswalk' | 'office' | 'reading'>('crosswalk');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scenes = {
    crosswalk: {
      title: 'Pedestrian Crosswalk & Traffic',
      captionEn: 'Caution: Pedestrian crossing active 4 meters ahead. Approaching silver vehicle on the right lane.',
      captionHi: 'सावधान: 4 मीटर आगे पैदल यात्री क्रॉसिंग चालू है। दाईं लेन में कार आ रही है।',
      objects: [
        { label: 'Pedestrian', conf: '96%', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' },
        { label: 'Traffic Signal (Walk)', conf: '98%', color: 'border-teal-400 bg-teal-500/20 text-teal-300' },
        { label: 'Sedan (Approaching)', conf: '91%', color: 'border-amber-400 bg-amber-500/20 text-amber-300' },
      ],
      ocrText: 'WALK SIGNAL - 15s REMAINING',
      openVinoLatency: '24.2 ms (Intel OpenVINO FP16)'
    },
    office: {
      title: 'Conference Room & Doorway',
      captionEn: 'Clear walking path. Open glass door ahead, conference table with chairs on your left.',
      captionHi: 'रास्ता साफ़ है। आगे खुला कांच का दरवाज़ा है, बाईं ओर टेबल और कुर्सियाँ हैं।',
      objects: [
        { label: 'Open Doorway', conf: '94%', color: 'border-teal-400 bg-teal-500/20 text-teal-300' },
        { label: 'Conference Table', conf: '92%', color: 'border-indigo-400 bg-indigo-500/20 text-indigo-300' },
        { label: 'Swivel Chair', conf: '88%', color: 'border-purple-400 bg-purple-500/20 text-purple-300' },
      ],
      ocrText: 'ROOM 302 - RESEARCH LAB',
      openVinoLatency: '21.8 ms (Intel OpenVINO FP16)'
    },
    reading: {
      title: 'Medicine Bottle / Document Reading',
      captionEn: 'Text detected: Paracetamol Tablets 500mg. Dosage instructions: Take one tablet after meals.',
      captionHi: 'टेक्स्ट मिला: पैरासिटामोल 500mg टैबलेट। खुराक निर्देश: भोजन के बाद एक गोली लें।',
      objects: [
        { label: 'Medicine Container', conf: '99%', color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300' },
        { label: 'Printed Label', conf: '97%', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' },
      ],
      ocrText: 'PARACETAMOL 500MG - EXP: 12/2027',
      openVinoLatency: '18.4 ms (Intel OpenVINO FP16)'
    }
  };

  const current = scenes[selectedScene];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = language === 'hi' ? current.captionHi : current.captionEn;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2500);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-5 backdrop-blur-md text-slate-200 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            VAAB Inference Engine Interactive Simulator
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            <Cpu className="w-3 h-3" />
            {current.openVinoLatency}
          </span>
        </div>
      </div>

      {/* Scene selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedScene('crosswalk')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            selectedScene === 'crosswalk'
              ? 'bg-teal-500 text-white font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Pedestrian Crosswalk
        </button>
        <button
          onClick={() => setSelectedScene('office')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            selectedScene === 'office'
              ? 'bg-teal-500 text-white font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Indoor Navigation
        </button>
        <button
          onClick={() => setSelectedScene('reading')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            selectedScene === 'reading'
              ? 'bg-teal-500 text-white font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          OCR Text Reading
        </button>
      </div>

      {/* Vision pipeline representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 rounded-xl p-4 border border-slate-800">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>YOLOv8 & EasyOCR Bounding Layers</span>
            <span className="text-teal-400 text-[10px]">Real-time loop</span>
          </div>
          <div className="space-y-2">
            {current.objects.map((obj, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs ${obj.color}`}>
                <span className="font-medium">{obj.label}</span>
                <span className="font-mono text-[10px] font-bold">Conf: {obj.conf}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-xs text-slate-300">
              <span className="font-mono text-[11px]">OCR: &quot;{current.ocrText}&quot;</span>
              <span className="text-teal-400 text-[10px]">EasyOCR</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>BLIP-2 Scene Caption & gTTS Audio</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  language === 'en' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  language === 'hi' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                HI
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 min-h-[82px] flex flex-col justify-between">
            <p className="text-xs text-teal-200 leading-relaxed font-medium">
              &quot;{language === 'hi' ? current.captionHi : current.captionEn}&quot;
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-teal-400" />
                Multi-language Narration Engine
              </span>
              <button
                onClick={handleSpeak}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-teal-500 hover:bg-teal-600 text-white text-[11px] font-semibold transition cursor-pointer shadow"
              >
                {isSpeaking ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>Speaking...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play Audio (TTS)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResumeGeneratorSimulator: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Generative AI Engineer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<{ summary: string; matchScore: number; keywords: string[] }>({
    summary: 'Results-driven Generative AI Engineer specialized in LLM prompt refinement, structured model evaluation, and multimodal vision pipeline integration with Intel OpenVINO. Proven track record building end-to-end AI applications.',
    matchScore: 98,
    keywords: ['Prompt Engineering', 'LLM Evaluation', 'Intel OpenVINO', 'FastAPI', 'YOLOv8', 'Python']
  });

  const roles = [
    {
      name: 'Generative AI Engineer',
      summary: 'Results-driven Generative AI Engineer specialized in LLM prompt refinement, structured model evaluation, and multimodal vision pipeline integration with Intel OpenVINO. Proven track record building end-to-end AI applications.',
      score: 98,
      keywords: ['Prompt Engineering', 'LLM Evaluation', 'Intel OpenVINO', 'FastAPI', 'YOLOv8', 'Python']
    },
    {
      name: 'Computer Vision & ML Specialist',
      summary: 'Applied Machine Learning practitioner with extensive hands-on experience in real-time object detection (YOLOv8), image captioning (BLIP-2), OCR pipelines, and low-latency inference optimization on edge architectures.',
      score: 95,
      keywords: ['Computer Vision', 'YOLOv8', 'BLIP-2', 'EasyOCR', 'Intel OpenVINO', 'Deep Learning']
    },
    {
      name: 'AI Quality & Evaluation Analyst',
      summary: 'AI Quality Assurance Specialist skilled at defining structured criteria, rating frontier LLM responses (Claude, ChatGPT), executing comparative evaluations, and translating enterprise benchmarks into dependable AI outcomes.',
      score: 97,
      keywords: ['Model Evaluation', 'Prompt Optimization', 'Response Scoring', 'Benchmarking', 'Stakeholder Communication']
    }
  ];

  const handleSelectRole = (roleName: string) => {
    setTargetRole(roleName);
    setIsGenerating(true);
    setTimeout(() => {
      const match = roles.find(r => r.name === roleName) || roles[0];
      setOutput({
        summary: match.summary,
        matchScore: match.score,
        keywords: match.keywords
      });
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-5 backdrop-blur-md text-slate-200 mt-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            AI Resume & Cover Letter Tailoring Engine
          </h4>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          Match Engine Active
        </span>
      </div>

      <div className="mb-3">
        <label className="text-xs text-slate-400 block mb-1.5 font-medium">
          Select Target Job Role to Auto-Tailor Arshdeep&apos;s Profile:
        </label>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.name}
              onClick={() => handleSelectRole(r.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                targetRole === r.name
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-cyan-400" />
            Synthesized Profile Pitch:
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ATS Fit: {output.matchScore}%
          </span>
        </div>

        {isGenerating ? (
          <div className="py-4 flex items-center justify-center gap-2 text-xs text-cyan-300">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Analyzing role requirements and generating tailored resume summary...</span>
          </div>
        ) : (
          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            &quot;{output.summary}&quot;
          </p>
        )}

        <div>
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
            Auto-Injected ATS Keywords:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {output.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono"
              >
                +{kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SmartRouteSimulator: React.FC = () => {
  const [modelType, setModelType] = useState<'standard' | 'ml-predictive'>('ml-predictive');

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-5 backdrop-blur-md text-slate-200 mt-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Smart Route AI — Predictive Telemetry Comparison
          </h4>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
          Real-Time & Historical Data
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setModelType('ml-predictive')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            modelType === 'ml-predictive'
              ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          Smart Route AI (Predictive ML Path)
        </button>
        <button
          onClick={() => setModelType('standard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            modelType === 'standard'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Standard Static GPS Routing
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Est. Travel Time</span>
          <span className={`text-base font-bold font-mono ${modelType === 'ml-predictive' ? 'text-emerald-400' : 'text-slate-300'}`}>
            {modelType === 'ml-predictive' ? '21 mins' : '38 mins'}
          </span>
          <span className="text-[10px] text-emerald-500 block">
            {modelType === 'ml-predictive' ? '▼ 44% Faster' : 'Heavy congestion'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Bottlenecks Avoided</span>
          <span className="text-base font-bold font-mono text-cyan-400">
            {modelType === 'ml-predictive' ? '4 Traffic Hubs' : '0 (Stuck in Jam)'}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {modelType === 'ml-predictive' ? 'Dynamic detour' : 'Standard arterial'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">CO2 Footprint</span>
          <span className="text-base font-bold font-mono text-indigo-400">
            {modelType === 'ml-predictive' ? '-32%' : 'Baseline'}
          </span>
          <span className="text-[10px] text-slate-400 block">Eco-optimized</span>
        </div>
      </div>
    </div>
  );
};
