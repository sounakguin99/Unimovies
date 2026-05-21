"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "Suggest a Sci-Fi movie 🚀",
  "Top Thrillers to watch 🍿",
  "Popular Anime series 🌸",
  "Recommend a feel-good comedy 😂",
];

export default function MovieAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hey! 🎬 I am **UniAI**, your personal movie guide. \n\nLooking for something to watch? Tell me your favorite genres, directors, actors, or just your current mood, and I'll find the perfect match! \n\nTry asking me something or click one of the quick suggestions below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isLoading) return;

    // Add user message
    const updatedMessages: Message[] = [...messages, { role: "user", text: trimmedText }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Map message history to Gemini API format
      const contents = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (error) {
      console.error("Chatbot communication error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Oops! I encountered an error. Please check your internet connection or try again shortly. 🍿",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Simple renderer to support basic markdown bold (**text**) and newlines (\n)
  const renderMessageContent = (text: string) => {
    return text.split("\n").map((paragraph, pIdx) => {
      // Split by bold markdown **
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-sm">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="font-extrabold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open UniAI Chatbot"
          className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8)] hover:scale-110 transform transition-all duration-500 focus:outline-none"
        >
          {/* Pulsing ring effect */}
          <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-30 group-hover:opacity-0 transition-opacity duration-300"></span>
          
          {/* Sparkles / Chat SVG Icon */}
          <svg
            className={`w-7 h-7 md:w-8 md:h-8 fill-none stroke-current relative z-10 transition-transform duration-500 ${
              isOpen ? "rotate-90 scale-90" : "group-hover:rotate-6"
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              // Close Icon
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              // Chat AI / Sparkle Icon
              <>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M12 7v6M9 10h6" />
              </>
            )}
          </svg>
        </button>

        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gray-900 border border-white/10 text-white text-xs md:text-sm font-semibold shadow-2xl backdrop-blur-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
            Ask UniAI 🍿
          </div>
        )}
      </div>

      {/* Chat Window Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-[96px] right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-140px)] rounded-2xl bg-neutral-950/85 backdrop-blur-2xl border border-white/10 flex flex-col z-50 overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.2)]"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-violet-950/30 to-indigo-950/30 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Robot Avatar */}
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h.01M15 9h.01M12 12h.01M10 15h4"
                    />
                  </svg>
                  {/* Status dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-neutral-950 animate-pulse"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                    UniAI
                  </h3>
                  <p className="text-xs text-purple-400/80 font-medium">
                    Cinema Assistant
                  </p>
                </div>
              </div>

              {/* Close Window Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-500 text-white rounded-br-none shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {renderMessageContent(msg.text)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.35s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips Row */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap bg-neutral-950/20 border-t border-white/5">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-xs font-semibold rounded-full text-purple-300 transition-all duration-300 active:scale-95 disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-neutral-950/50 border-t border-white/10 flex items-center gap-3">
              <div className="relative flex-1 flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask UniAI about movies..."
                  rows={1}
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-2xl py-3 pl-4 pr-12 text-sm outline-none focus:border-purple-500/40 focus:bg-white/10 transition-all resize-none max-h-24 min-h-[44px] leading-relaxed scrollbar-none"
                />
                
                {/* Send Button */}
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 cursor-pointer"
                  aria-label="Send Message"
                >
                  <svg
                    className="w-4 h-4 transform rotate-45 -translate-x-[1px] translate-y-[1px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
