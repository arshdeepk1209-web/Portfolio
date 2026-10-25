import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
  Search,
  Check,
  Code2,
  Cpu
} from 'lucide-react';
import { askPortfolioAI, RAGResponse, RetrievalResult } from '../utils/ragEngine';
import {
  predictNextWords,
  getInlineGhostAutocomplete,
  getLSTMTelemetry,
  NextWordPrediction,
  LSTMStateTelemetry
} from '../utils/lstmNextWord';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  retrievedChunks?: RetrievalResult[];
  confidence?: number;
  isGrounded?: boolean;
  sourceType?: 'gemini-llm' | 'local-rag-synthesizer';
}

const SAMPLE_QUESTIONS = [
  'tell me about your ', // Interactive LSTM Next-Word autocomplete demo
  'What projects has she done in machine learning?',
  'Does she know React?',
  'Tell me about her experience at Intel.',
  'What is her educational background?',
  'What certifications does she hold?',
  'What is her favorite food?' // For testing grounding refusal
];

export function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRAGInfo, setShowRAGInfo] = useState(false);
  const [showLSTMInspector, setShowLSTMInspector] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  // Compute LSTM next-word predictions and inline ghost completion dynamically
  const nextWordPredictions = useMemo(() => predictNextWords(inputQuery, 3), [inputQuery]);
  const ghostAutocomplete = useMemo(() => getInlineGhostAutocomplete(inputQuery), [inputQuery]);
  const lstmTelemetry = useMemo(() => getLSTMTelemetry(inputQuery), [inputQuery]);

  const handleAcceptNextWord = (word: string) => {
    let newText = inputQuery;
    const endsWithSpace = inputQuery.endsWith(' ');
    if (endsWithSpace || !inputQuery.trim()) {
      newText = inputQuery + word + ' ';
    } else {
      const tokens = inputQuery.split(/\s+/);
      tokens[tokens.length - 1] = word;
      newText = tokens.join(' ') + ' ';
    }
    setInputQuery(newText);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleAcceptGhost = () => {
    if (!ghostAutocomplete) return;
    const newText = inputQuery + ghostAutocomplete + ' ';
    setInputQuery(newText);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && ghostAutocomplete) {
      e.preventDefault();
      handleAcceptGhost();
    } else if (
      e.key === 'ArrowRight' &&
      inputRef.current &&
      inputRef.current.selectionStart === inputQuery.length &&
      ghostAutocomplete
    ) {
      e.preventDefault();
      handleAcceptGhost();
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 Hi! I'm Arshdeep Kaur's **Portfolio AI Assistant**.\n\nAsk me anything about her **machine learning projects**, technical skills (like React, Python, or YOLOv8), **Intel Summer Training**, certifications, or education!\n\n*Note: I am strictly grounded in Arshdeep's verified credentials and will decline out-of-domain questions to prevent hallucinated claims.*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGrounded: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    const userMsgId = `user-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: q,
        timestamp: userTimestamp
      }
    ]);

    setIsLoading(true);

    try {
      const response: RAGResponse = await askPortfolioAI(q);
      const botMsgId = `bot-${Date.now()}`;
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'assistant',
          text: response.answer,
          timestamp: botTimestamp,
          retrievedChunks: response.retrievedChunks,
          confidence: response.confidence,
          isGrounded: response.isGrounded,
          sourceType: response.sourceType
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a temporary connection issue while searching Arshdeep's portfolio. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isGrounded: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation cleared. How can I assist you with Arshdeep's verified portfolio?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGrounded: true
      }
    ]);
  };

  // Simple Markdown text renderer for bold, bullets, and links
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check for markdown headers or bullet items
      let content = line;
      let isBullet = false;
      let isNumbered = false;

      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        isBullet = true;
        content = line.substring(2);
      } else if (/^\d+\.\s/.test(line)) {
        isNumbered = true;
      }

      // Format bold text **text**
      const parts = content.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-stone-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a
                key={pIdx}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500 inline-flex items-center gap-0.5"
              >
                {match[1]} <ExternalLink className="w-2.5 h-2.5 inline" />
              </a>
            );
          }
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 text-sm pl-1">
            <span className="text-emerald-500 font-bold">•</span>
            <div>{renderedParts}</div>
          </div>
        );
      }

      if (isNumbered) {
        return (
          <div key={idx} className="my-1.5 text-sm font-medium">
            {renderedParts}
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 text-sm leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-900/90 dark:bg-zinc-800/90 text-stone-200 dark:text-zinc-200 text-xs rounded-full backdrop-blur-md shadow-lg border border-stone-700/50 dark:border-zinc-700/50 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Ask Me Anything (RAG Bot)</span>
          </motion.div>
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isOpen
              ? 'bg-stone-800 text-stone-200 ring-2 ring-emerald-500/50'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 ring-4 ring-emerald-500/20'
          }`}
          aria-label="Toggle Ask Me Anything Portfolio Chatbot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <div className="relative">
                <Brain className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
                </span>
              </div>
            </>
          )}
        </motion.button>
      </div>

      {/* CHAT DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[82vh] h-[640px] bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* CHAT HEADER */}
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    AK
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      Ask Arshdeep AI
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                      RAG Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                    Semantic Search & Grounded Answering
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowRAGInfo(!showRAGInfo)}
                  title="View NLP & RAG Architecture"
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showRAGInfo
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetChat}
                  title="Clear conversation"
                  className="p-1.5 text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RAG NLP ARCHITECTURE BANNER (EXPANDABLE) */}
            <AnimatePresence>
              {showRAGInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-50/90 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/50 p-3 text-xs text-stone-700 dark:text-zinc-300 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> NLP Pipeline Architecture
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      RAG (Retrieval-Augmented Generation)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded border border-emerald-200/60 dark:border-emerald-900/40">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">1. Text Chunking & RAG</strong>
                      Modular verified knowledge chunks indexed with TF-IDF vectors & Cosine Similarity search.
                    </div>
                    <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded border border-emerald-200/60 dark:border-emerald-900/40">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">2. LSTM Next-Word Model</strong>
                      Recurrent LSTM sequence model predicting candidate next words & inline ghost autocomplete.
                    </div>
                    <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded border border-emerald-200/60 dark:border-emerald-900/40">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">3. Grounded Synthesis</strong>
                      Context chunks injected with strict system constraints. Out-of-scope queries refused.
                    </div>
                    <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded border border-emerald-200/60 dark:border-emerald-900/40">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">4. Dual Execution</strong>
                      Gemini LLM on server + instant deterministic local RAG for static GitHub Pages.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MESSAGES CONTAINER */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-stone-800 dark:text-zinc-200">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md shadow-emerald-600/10'
                        : 'bg-stone-100 dark:bg-zinc-800/80 text-stone-800 dark:text-zinc-200 rounded-bl-none border border-stone-200/80 dark:border-zinc-700/50'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div>
                        {renderFormattedText(msg.text)}

                        {/* SOURCE CITATIONS TRAY */}
                        {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-zinc-700/60 text-[11px]">
                            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-1">
                              <span className="flex items-center gap-1 font-medium">
                                <Search className="w-3 h-3 text-emerald-500" />
                                <span>Retrieved Chunks ({msg.retrievedChunks.length}):</span>
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200/70 dark:bg-zinc-700/70 text-stone-600 dark:text-zinc-300">
                                {msg.sourceType === 'gemini-llm' ? 'Gemini 2.5 Flash' : 'Local RAG Engine'}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {msg.retrievedChunks.map((ret, rIdx) => {
                                const isExpanded = expandedCitationId === `${msg.id}-${ret.chunk.id}`;
                                return (
                                  <div key={rIdx} className="w-full">
                                    <button
                                      onClick={() =>
                                        setExpandedCitationId(
                                          isExpanded ? null : `${msg.id}-${ret.chunk.id}`
                                        )
                                      }
                                      className="w-full text-left flex items-center justify-between p-1 px-1.5 rounded bg-white/60 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-stone-700 dark:text-zinc-300 transition-colors border border-stone-200/50 dark:border-zinc-700/40 text-[10.5px] cursor-pointer"
                                    >
                                      <span className="truncate pr-2 font-medium flex items-center gap-1">
                                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                                        {ret.chunk.title}
                                      </span>
                                      <span className="flex items-center gap-1 shrink-0 text-stone-400">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                          {Math.round(ret.score * 100)}% match
                                        </span>
                                        {isExpanded ? (
                                          <ChevronUp className="w-3 h-3" />
                                        ) : (
                                          <ChevronDown className="w-3 h-3" />
                                        )}
                                      </span>
                                    </button>

                                    {/* EXPANDED CHUNK CONTENT */}
                                    {isExpanded && (
                                      <div className="mt-1 p-2 rounded bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-[11px] text-stone-600 dark:text-zinc-300 leading-normal">
                                        <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                                          Tags: {ret.chunk.tags.slice(0, 6).join(', ')}
                                        </div>
                                        <p>{ret.chunk.content}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>

                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-zinc-800/80 rounded-bl-none border border-stone-200/80 dark:border-zinc-700/50 flex items-center gap-2 text-stone-600 dark:text-zinc-300 text-xs">
                    <Brain className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>Retrieving relevant portfolio chunks & synthesizing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* LSTM NEXT-WORD SUGGESTIONS & AUTOCOMPLETE BAR */}
            <div className="px-3 py-1.5 bg-stone-100/90 dark:bg-zinc-950/90 border-t border-stone-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                  <Cpu className="w-3 h-3" /> LSTM Next-Word:
                </span>
                {nextWordPredictions.map((pred, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAcceptNextWord(pred.word)}
                    className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-zinc-200 border border-stone-200 dark:border-zinc-700 hover:border-emerald-500 text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <span className="font-semibold">{pred.word}</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {Math.round(pred.probability * 100)}%
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowLSTMInspector(!showLSTMInspector)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 transition-colors cursor-pointer border ${
                  showLSTMInspector
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300 border-transparent hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
                title="Inspect recurrent gate activations and hidden state"
              >
                LSTM Telemetry
              </button>
            </div>

            {/* LSTM TELEMETRY DRAWER */}
            <AnimatePresence>
              {showLSTMInspector && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-950/20 dark:bg-zinc-950/90 border-t border-emerald-200/50 dark:border-emerald-900/40 p-3 text-[11px] font-mono text-stone-700 dark:text-zinc-300 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> LSTM Recurrent Cell Telemetry
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Sequence Length: {lstmTelemetry.tokens.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="p-2 rounded bg-white/80 dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800">
                      <div className="text-[9px] uppercase tracking-wider text-stone-400">Forget Gate (f_t)</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {lstmTelemetry.activeGateSummary.forget}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white/80 dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800">
                      <div className="text-[9px] uppercase tracking-wider text-stone-400">Input Gate (i_t)</div>
                      <div className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        {lstmTelemetry.activeGateSummary.input}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white/80 dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800">
                      <div className="text-[9px] uppercase tracking-wider text-stone-400">Output Gate (o_t)</div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {lstmTelemetry.activeGateSummary.output}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/50 dark:border-zinc-800">
                    <span>||c_t||: {lstmTelemetry.cellStateNorm} · ||h_t||: {lstmTelemetry.hiddenStateNorm}</span>
                    <span>Softmax over portfolio inquiry vocab</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* QUICK SUGGESTIONS CHIPS */}
            <div className="px-3 py-2 bg-stone-50/80 dark:bg-zinc-950/60 border-t border-stone-200/60 dark:border-zinc-800/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" /> Suggested:
              </span>
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(q);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  disabled={isLoading}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-xs cursor-pointer font-mono"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* INPUT BOX */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type 'tell me about your...' or ask anything"
                  disabled={isLoading}
                  className="w-full bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all pr-20"
                />
                {ghostAutocomplete && (
                  <button
                    type="button"
                    onClick={handleAcceptGhost}
                    className="absolute right-2 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 text-[10px] font-mono flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    title="Click or press Tab / → to autocomplete"
                  >
                    <span>+{ghostAutocomplete}</span>
                    <span className="text-[8.5px] uppercase font-bold bg-white/80 dark:bg-zinc-800/80 px-1 rounded">Tab ⇥</span>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
