import React, { useEffect, useState } from "react";
import { generateContent, broadcastContent } from "../services/contentService";
import API from "../api";

export default function Content() {
  const adminId = localStorage.getItem("admin_id");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API}/generate-content/history/${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Error loading content history:", e);
    }
  };

  const generate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setBroadcastResult(null);
    setOutput("");

    try {
      const res = await generateContent({ prompt, admin_id: adminId });
      setOutput(res.content);
      loadHistory();
    } catch (e) {
      console.error("Error generating content:", e);
      setOutput("Error: Could not generate content. Please verify backend connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcast = async () => {
    if (!output.trim() || broadcasting) return;
    if (!window.confirm("Send this generated content to all active customers? [Customer Name] and [Company Name] will be replaced automatically.")) {
      return;
    }

    setBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await broadcastContent({ admin_id: adminId, content: output });
      setBroadcastResult(res);
    } catch (e) {
      console.error("Error broadcasting content:", e);
      setBroadcastResult({ success: false, message: "Unable to broadcast content. Please try again." });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white tracking-tight">AI Content Generator</h2>
          <p className="text-gray-400 mt-1">Generate marketing templates, promotional flyers, or welcome letters using AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form & History Browser */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Input Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Prompt AI</h3>
              <form onSubmit={generate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instructions</label>
                  <textarea
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    rows="4"
                    placeholder="e.g. Write a marketing email for a 20% discount on summer shoes..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 text-sm"
                >
                  {loading ? "Generating..." : "Generate Content"}
                </button>
              </form>
            </div>

            {/* Document History Feed */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl max-h-[350px] overflow-y-auto">
              <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase text-gray-400">Past Generations</h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-xs">No documents generated yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((doc) => (
                    <button
                      key={doc._id}
                      onClick={() => setOutput(`${doc.subject}\n\n${doc.body}`)}
                      className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs block group"
                    >
                      <h4 className="font-semibold text-white truncate group-hover:text-purple-400">{doc.subject}</h4>
                      <p className="text-gray-400 truncate mt-0.5">{doc.prompt}</p>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {new Date(doc.sent_at).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Editor/Output Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl min-h-[500px] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Generated Output</h3>
                  <p className="text-gray-400 text-sm">Use [Customer Name] and [Company Name] to broadcast personalized emails.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    onClick={sendBroadcast}
                    disabled={!output.trim() || broadcasting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 text-sm text-white"
                  >
                    {broadcasting ? "Sending to active customers..." : "Send to active customers"}
                  </button>
                </div>
              </div>
              {broadcastResult ? (
                <div className={`mb-4 rounded-2xl px-4 py-3 text-sm ${broadcastResult.success ? "bg-emerald-600/10 border border-emerald-600/20 text-emerald-200" : "bg-rose-600/10 border border-rose-600/20 text-rose-200"}`}>
                  {broadcastResult.success ? (
                    <>
                      Sent to {broadcastResult.sent} active customer{broadcastResult.sent === 1 ? "" : "s"}.
                      {broadcastResult.failed ? ` ${broadcastResult.failed} failed.` : ""}
                    </>
                  ) : (
                    broadcastResult.message || "Broadcast failed."
                  )}
                </div>
              ) : null}
              
              <div className="flex-1 border border-white/10 rounded-xl bg-slate-900/50 p-6 relative">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[2px] rounded-xl z-10">
                    <span className="flex items-center gap-1.5 text-purple-400 font-semibold mb-2">
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span>
                      AI Generating...
                    </span>
                    <p className="text-xs text-gray-400">Crafting your professional marketing email template.</p>
                  </div>
                ) : null}

                <textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  placeholder="Generated content will appear here, and you can edit it before sending."
                  rows={18}
                  className="w-full h-full min-h-[420px] resize-none bg-slate-950 text-gray-100 placeholder:text-slate-500 outline-none p-4 rounded-xl border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}