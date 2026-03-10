
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2, 
  MessageSquare, 
  BookOpen, 
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const StudyBuddy: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello there! I'm your FCS AI Study Buddy. I can help you with campus survival tips, explain complex topics, or even provide a word of encouragement. What's on your mind today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!chatInstance.current) {
        chatInstance.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: "You are 'FCS Study Buddy', an AI assistant for students at Futminna University, specifically for the FCS (Fellowship of Christian Students) community. You are friendly, encouraging, knowledgeable about academic life, and provide guidance that aligns with Christian values. You help with study techniques, time management, and spiritual encouragement. Keep responses concise and supportive.",
          },
        });
      }

      const result = await chatInstance.current.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting right now. Please try again in a moment!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    "How do I balance fellowship and study?",
    "Tips for 100 level engineering math?",
    "Give me a word of encouragement.",
    "Best spots to study at Gidan Kwano?"
  ];

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-[calc(100vh-64px)] flex flex-col transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 p-4 sticky top-16 z-10 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 dark:text-slate-500 hover:text-indigo-900 dark:hover:text-white transition p-1">
              <ArrowLeft size={20} />
            </Link>
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-indigo-900 dark:text-white">AI Study Buddy</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active & Ready</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-primary text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-900/50">
            <Zap size={12} /> Powered by Gemini AI
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-900 dark:bg-primary text-white' : 'bg-primary dark:bg-slate-700 text-white'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm border ${
                  m.role === 'user' 
                  ? 'bg-indigo-900 dark:bg-primary text-white border-indigo-900 dark:border-primary rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-lg bg-primary dark:bg-slate-700 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-sm text-gray-400 dark:text-slate-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer / Input area */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 p-4 md:p-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {starterPrompts.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(p); }}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative flex items-center gap-3">
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about campus life or studies..."
                className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner dark:text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300 dark:text-slate-600">
                <MessageSquare size={18} />
              </div>
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send size={24} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 mt-4 uppercase tracking-widest font-medium">
            Your Study Buddy is powered by AI and specifically trained for Futminna FCS
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddy;
