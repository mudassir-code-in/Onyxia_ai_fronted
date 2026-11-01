import { useState, useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import { Send, LogOut, ChevronDown, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AILoader from './AILoader';

interface HomePageComponentProps {
  name?: string;
  email?: string;
  avatar?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  result?: string;
  reply?: string;
  response?: string;
  message?: string;
}

const HomePageComponent = ({ name, email, avatar }: HomePageComponentProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to Onyxia! I am your intelligent AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Character limit for safety against high token usage (2000 chars)
  const MAX_INPUT_LENGTH = 2000;

  // Smart Scroll Logic
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.role === 'user';

    if (isNearBottom || isUserMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea logic as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`;
    }
  }, [input]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    if (userMessage.length > MAX_INPUT_LENGTH) return;

    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/ai-response`,
        { message: userMessage },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const aiReply =
        response.data.result ||
        response.data.reply ||
        response.data.response ||
        response.data.message ||
        JSON.stringify(response.data);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiReply }
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong, please try again!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0b0f19] text-gray-200 font-sans overflow-hidden">

      {/* Custom inline style to hide scrollbars cleanly across browsers */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3.5 bg-[#111827]/85 backdrop-blur-md border-b border-gray-800/80 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <AILoader size="md" showText={false} isSpinning={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-wide">
                Onyxia<span className="text-cyan-400">.ai</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Next-Gen Intelligence Engine</p>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 bg-[#1e293b]/60 px-3 py-1.5 rounded-full border border-gray-700/50 shadow-inner cursor-pointer hover:border-cyan-500/50 transition select-none"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="text-xs font-semibold text-gray-100 pr-0.5 max-w-[80px] sm:max-w-none truncate">
              {name || 'User'}
            </span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#161e2e] border border-gray-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-gray-800">
                <p className="text-[11px] text-gray-400">Signed in as</p>
                <p className="text-xs font-semibold text-gray-200 truncate mt-0.5">
                  {email}
                </p>
              </div>
              <div className="p-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition text-left"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ---------------- CHAT MESSAGES AREA (Scrollbar Hidden) ---------------- */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-5 max-w-4xl w-full mx-auto min-h-0"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mt-1">
                <AILoader size="sm" showText={false} isSpinning={false} />
              </div>
            )}

            <div
              className={`relative group max-w-[85%] md:max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-x-auto ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20 whitespace-pre-wrap pr-10'
                  : 'bg-[#161e2e] text-gray-200 border border-gray-800 rounded-tl-none shadow-sm prose prose-invert max-w-none pr-10'
                }`}
            >
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(msg.content, index)}
                title="Copy message"
                className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-indigo-700/80 hover:bg-indigo-800/80 border-indigo-500/40 text-indigo-200 hover:text-white'
                    : 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-700/60 text-gray-400 hover:text-cyan-400'
                }`}
              >
                {copiedIndex === index ? (
                  <Check size={14} className={msg.role === 'user' ? 'text-white' : 'text-emerald-400'} />
                ) : (
                  <Copy size={14} />
                )}
              </button>

              {msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <AILoader size="sm" message="is generating a response" isSpinning={true} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ---------------- INPUT AREA ---------------- */}
      <div className="p-3 md:p-4 max-w-4xl w-full mx-auto shrink-0">
        <form onSubmit={handleSend} className="relative bg-[#161e2e] rounded-2xl border border-gray-700/60 focus-within:border-cyan-500/80 transition shadow-xl shadow-cyan-950/20 flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            maxLength={MAX_INPUT_LENGTH}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Onyxia anything..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 pl-4 pr-[100px] py-3.5 focus:outline-none resize-none text-sm min-h-[52px] max-h-36 no-scrollbar"
          />
          
          {/* Character counter (Visible on both mobile & desktop) */}
          <div className="absolute right-12 bottom-3 text-[10px] text-gray-500 select-none pointer-events-none font-mono">
            {input.length}/{MAX_INPUT_LENGTH}
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-2.5 bottom-2.5 p-2 rounded-xl transition ${input.trim() && !loading
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-cyan-500/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-center text-[11px] text-gray-500 mt-2">
          Onyxia <span className="text-cyan-400 font-semibold">Is AI</span> Can Make Mistakes.
        </p>
      </div>

    </div>
  );
};

export default HomePageComponent;