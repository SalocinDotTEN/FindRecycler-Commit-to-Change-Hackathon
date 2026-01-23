
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Leaf, ExternalLink } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Hello! I'm your FindRecycler eco-assistant. Ask me anything about recycling!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await chatWithAssistant(input);
    setMessages(prev => [...prev, { role: 'assistant', text: response.text, sources: response.sources }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[3000]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 transition-all hover:scale-110 active:scale-95 group"
        >
          <Bot size={28} className="group-hover:animate-bounce" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      ) : (
        <div className="bg-white w-[350px] max-h-[500px] h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-4 bg-green-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">Eco Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Sources:</p>
                      <ul className="space-y-1">
                        {msg.sources.map((src, sidx) => (
                          <li key={sidx} className="flex items-center gap-1">
                            <ExternalLink size={10} className="text-green-500 shrink-0" />
                            <a href={src.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-600 hover:underline truncate">
                              {src.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How do I recycle batteries?"
              className="flex-1 bg-slate-100 px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button
              disabled={isLoading}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
