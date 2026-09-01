import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { Copy, Check, Bot, User } from "lucide-react";
import SourceCard from "./SourceCard.jsx";

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "USER";

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Copy failed.");
    }
  }

  const sources = Array.isArray(message.sources) ? message.sources : [];

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Bot size={20} />
        </div>
      )}
      <div className="max-w-[85%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
            isUser
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-800 border border-slate-200"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && sources.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sources
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {sources.map((s, i) => (
                <SourceCard key={i} source={s} />
              ))}
            </div>
          </div>
        )}

        {!isUser && !message.pending && (
          <button
            type="button"
            onClick={onCopy}
            className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy answer"}
          </button>
        )}
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
          <User size={20} />
        </div>
      )}
    </div>
  );
}
