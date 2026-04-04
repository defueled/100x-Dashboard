'use client';

import { useState } from 'react';
import { Send, X, Bot } from 'lucide-react';

export function AgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      <style>{`
        .agent-glow-pulse { 
          animation: agentPulse 2.5s ease-in-out infinite; 
          image-rendering: pixelated;
        }
        @keyframes agentPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(0, 255, 255, 0)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.8)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(0, 255, 255, 0)); }
        }
      `}</style>

      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start font-sans">


        {/* Chat Window */}
        {isOpen && (
          <div className="mb-4 w-80 md:w-96 h-[400px] bg-[#1a1c23] border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-[#242730] px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-medium text-white">100x Agent</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              <div className="flex self-start max-w-[85%]">
                <div className="bg-[#2a2d36] text-gray-200 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5">
                  Hey DAO member! I am the 100x Agent. How can I assist you today?
                </div>
              </div>
              <div className="flex self-end max-w-[85%]">
                <div className="bg-cyan-500/20 text-cyan-50 border border-cyan-500/30 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5">
                  What can you do for me?
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#1a1c23] border-t border-gray-700/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#242730] border border-gray-700/50 text-white text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
                />
                <button
                  className="absolute right-2 p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-full transition-colors"
                  onClick={() => setMessage('')}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Avatar Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group transition-transform hover:scale-105"
          aria-label="Toggle 100x Agent Chat"
        >
          {/* Status Dot */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a] z-10 animate-pulse"></div>

          <div className="bg-[#242730] rounded-full p-2 border border-gray-700/50 shadow-xl relative overflow-hidden flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src="/agent-avatar.png"
              alt="100x Agent Avatar"
              className="w-16 h-16 md:w-20 md:h-20 object-contain agent-glow-pulse relative z-[5]"
            />
          </div>

          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-sm text-white px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat with Agent
            </div>
          )}
        </button>

      </div>
    </>
  );
}
