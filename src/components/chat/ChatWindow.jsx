import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import MessageList from "./MessageList.jsx";
import ChatInput from "./ChatInput.jsx";
import {
  fetchConversations,
  openConversation,
  startNewConversation,
} from "../../store/chatSlice.js";
import { formatDate } from "../../utils/format.js";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { conversations, activeConversationId } = useSelector((s) => s.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <select
            value={activeConversationId ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              if (id) dispatch(openConversation(id));
              else dispatch(startNewConversation());
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">New conversation</option>
            {conversations.map((c) => (
              <option key={c.id} value={c.id}>
                {formatDate(c.updatedAt)} - {c.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => dispatch(startNewConversation())}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Plus size={14} /> New
        </button>
      </div>

      <MessageList />
      <ChatInput />
    </div>
  );
}
