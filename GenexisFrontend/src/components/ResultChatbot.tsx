import React, { useState, useEffect, useRef } from 'react';

// --- Types & Interfaces ---
export interface GOResult {
  goid: string;
  term: string;
  category: string;
  pvalue?: number;
}

export interface PredictionData {
  input: string;
  detected_type: string;
  genexis_go_predictions: GOResult[];
  string: any[];
  kegg: string[];
  clinvar: Record<string, any>;
  pubmed: string[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ResultChatbotProps {
  data: PredictionData;
}

export default function ResultChatbot({ data }: ResultChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (data && data.input) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: `Hello! I'm your GENEXIS AI assistant powered by Groq. I have analyzed the results for sequence **${data.input}** (${data.detected_type || 'Unknown Type'}). Ask me anything about its pathways, confidence scores, or clinical significance!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [data]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- SECURE BACKEND ENGINE ---
  const generateGroqResponse = async (userQuery: string, contextData: PredictionData, chatHistory: Message[]): Promise<string> => {
    
    // 1. Build the System Context
    const systemPrompt = `You are the GENEXIS AI Assistant, an expert bioinformatics chatbot. 
    You are helping a user analyze a specific gene/protein sequence. 
    
    Here is the strict dataset for the current query:
    ${JSON.stringify(contextData, null, 2)}
    
    Rules for your response:
    1. Base your answers primarily on the dataset provided above.
    2. If the user asks about a specific protein, pathway, or disease from the dataset, explain it clearly and provide context using your general biological knowledge.
    3. Format your responses with Markdown (use **bolding**, bullet points, and clean spacing).
    4. Do not mention that you are reading from a JSON object. Act natural.
    5. Keep responses concise but highly informative.`;

    // 2. Format Chat History
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-6).map(msg => ({
        role: msg.sender === 'bot' ? "assistant" : "user",
        content: msg.text
      })),
      { role: "user", content: userQuery }
    ];

    try {
      // 3. 🛑 SEND TO YOUR SECURE PYTHON BACKEND 🛑
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // We only need to send the messages array to the backend
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData.reply;

    } catch (error) {
      console.error("Backend Call Failed:", error);
      return "I'm sorry, I encountered a network error while trying to reach the local server. Make sure your Python backend is running on port 8000.";
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    const currentHistory = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await generateGroqResponse(userMsg.text, data, currentHistory);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "System error: Unable to generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block min-h-[1.2em]">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            if (part.includes('http')) {
              const words = part.split(' ');
              return words.map((word, k) => {
                if (word.startsWith('http')) {
                   return <a key={k} href={word} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline break-all mr-1 transition-colors">{word}</a>;
                }
                return <span key={k}>{word} </span>;
              });
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div className="glass-card flex flex-col h-[500px] relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
      
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-cyan-400">GENEXIS Assistant</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Secure Groq Engine</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-700'
              }`}
            >
              {formatMessageText(msg.text)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 mx-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex mr-auto items-start max-w-[85%]">
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Groq about your sequence data..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:text-white transition-all placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}