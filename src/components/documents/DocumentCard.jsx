import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FileText, Trash2 } from "lucide-react";
import DocumentStatus from "./DocumentStatus.jsx";
import { deleteDocument } from "../../store/documentsSlice.js";
import { toggleDocumentFilter } from "../../store/chatSlice.js";
import { formatBytes, formatDate } from "../../utils/format.js";

export default function DocumentCard({ doc }) {
  const dispatch = useDispatch();
  const selected = useSelector((s) =>
    s.chat.selectedDocumentIds.includes(doc.id),
  );

  async function onDelete(e) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${doc.originalName}"? This cannot be undone.`))
      return;
    try {
      await dispatch(deleteDocument(doc.id)).unwrap();
      toast.success("Document deleted.");
    } catch (err) {
      toast.error(err.message ?? "Failed to delete document.");
    }
  }

  function onToggleFilter() {
    if (doc.status !== "READY") return;
    dispatch(toggleDocumentFilter(doc.id));
  }

  return (
    <div
      onClick={onToggleFilter}
      className={`group cursor-pointer rounded-lg border bg-white p-3 transition hover:border-brand-300 hover:shadow-sm ${
        selected ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200"
      } ${doc.status !== "READY" ? "cursor-default" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-brand-50 p-2 text-brand-600">
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className="truncate text-sm font-medium text-slate-900"
              title={doc.originalName}
            >
              {doc.originalName}
            </p>
            <button
              type="button"
              onClick={onDelete}
              className="rounded p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
              aria-label="Delete document"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <DocumentStatus status={doc.status} />
            <span>{formatBytes(doc.size)}</span>
            {doc.pageCount != null && <span>· {doc.pageCount} pages</span>}
            <span>· {formatDate(doc.createdAt)}</span>
          </div>
          {doc.status === "FAILED" && doc.errorMessage && (
            <p
              className="mt-1 truncate text-xs text-rose-600"
              title={doc.errorMessage}
            >
              {doc.errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
