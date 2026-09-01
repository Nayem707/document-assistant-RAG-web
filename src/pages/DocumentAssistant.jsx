import { Sparkles } from "lucide-react";
import DocumentList from "../components/documents/DocumentList.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";

export default function DocumentAssistant() {
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="rounded-md bg-brand-600 p-1.5 text-white">
          <Sparkles size={16} />
        </div>
        <h1 className="text-base font-semibold text-slate-900">
          AI Document Assistant
        </h1>
        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          RAG · pgvector · LangChain
        </span>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        <aside className="border-b border-slate-200 bg-white md:border-b-0 md:border-r overflow-hidden">
          <DocumentList />
        </aside>
        <main className="overflow-hidden bg-slate-50">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
