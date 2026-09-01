import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import { Spinner } from "../common/Spinner.jsx";

export default function MessageList() {
  const { messages, sending } = useSelector((s) => s.chat);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  return (
    <div ref={scrollerRef} className="flex-1 overflow-y-auto scroll-fade">
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center text-center text-slate-500">
            <div className="mb-3 rounded-full bg-brand-50 p-4 text-brand-600">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              Ask a question
            </h3>
            <p className="mt-1 max-w-sm text-sm">
              Upload a PDF, then ask anything about it. Answers stay grounded in
              your documents.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Spinner /> Thinking…
          </div>
        )}
      </div>
    </div>
  );
}
