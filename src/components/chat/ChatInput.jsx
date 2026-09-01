import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { pushLocalUserMessage, sendQuestion } from "../../store/chatSlice.js";

export default function ChatInput() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { sending, activeConversationId } = useSelector((s) => s.chat);
  const hasReadyDocs = useSelector((s) =>
    s.documents.items.some((d) => d.status === "READY"),
  );

  async function submit() {
    const question = value.trim();
    if (!question || sending) return;
    if (!hasReadyDocs) {
      toast.error("Upload and process a document first.");
      return;
    }
    setValue("");
    dispatch(pushLocalUserMessage(question));
    try {
      await dispatch(
        sendQuestion({ question, conversationId: activeConversationId }),
      ).unwrap();
    } catch (err) {
      toast.error(err.message ?? "Failed to get an answer.");
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-2">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask a question about your documents…"
          className="max-h-40 flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          disabled={sending}
        />
        <button
          type="button"
          onClick={submit}
          disabled={sending || !value.trim()}
          className="flex h-10 items-center gap-1 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          Send
        </button>
      </div>
      <p className="mx-auto mt-1.5 max-w-3xl text-[11px] text-slate-400">
        Press Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}
