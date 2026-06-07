import React, { useEffect, useState, useRef } from "react";
import { sendMessage } from "../services/chatService";
import API from "../api";
import { renderMarkdown } from "../utils/markdown";

export default function Chatbot() {
  const adminId = localStorage.getItem("admin_id");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const loadChatHistory = async () => {
    try {
        const res = await fetch(`${API}/chat/${adminId}`);
      if (res.ok) {
        const history = await res.json();
        setChat(history);
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    // Optimistically insert user's prompt with typing indicator for bot
    setChat((prev) => [...prev, { user: userMessage, bot: "Thinking..." }]);

    try {
      const res = await sendMessage({
        message: userMessage,
        admin_id: adminId,
      });

      setChat((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = { user: userMessage, bot: res.reply };
        }
        return updated;
      });
    } catch (e) {
      console.error("Error sending message:", e);
      setChat((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            user: userMessage,
            bot: "Sorry, I'm having trouble connecting to the AI server. Please make sure the backend server is running and database is active."
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col min-h-0">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white tracking-tight">AI Chatbot Assistant</h2>
          <p className="text-gray-400 mt-1">Brainstorm marketing copy, campaigns, or ask questions about customer rules.</p>
        </div>

        {/* Chat window container */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl overflow-y-auto mb-6 space-y-6 min-h-0">
          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 text-xl font-bold mb-4">
                🤖
              </div>
              <h3 className="font-semibold text-white text-lg">Start a chat</h3>
              <p className="text-gray-400 text-sm max-w-sm mt-1">Ask the AI questions about marketing campaigns, welcome email structures, or customer lists.</p>
            </div>
          ) : (
            chat.map((c, i) => (
              <div key={i} className="space-y-4">
                
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 px-4 py-3 rounded-2xl rounded-tr-none max-w-md shadow-lg text-sm text-white">
                    <span className="block text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">You</span>
                    {c.user}
                  </div>
                </div>

                {/* Bot Response */}
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none max-w-lg shadow-lg text-sm text-gray-200">
                    <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Marketo AI</span>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {c.bot === "Thinking..." ? (
                        <span className="flex items-center gap-1.5 text-gray-400 italic">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                          Thinking...
                        </span>
                      ) : (
                        renderMarkdown(c.bot)
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={send} className="flex gap-3 mb-2 items-end">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Auto-grow: reset height then set to scrollHeight, capped at 150px
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e);
                // Reset height after sending
                e.target.style.height = 'auto';
              }
            }}
            disabled={loading}
            rows={1}
            placeholder={loading ? "Waiting for AI reply..." : "Type your message... (Shift+Enter for new line)"}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-50 resize-none overflow-y-auto leading-relaxed"
            style={{ minHeight: '46px', maxHeight: '200px' }}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm text-white flex-shrink-0"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}