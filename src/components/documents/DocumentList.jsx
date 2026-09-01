import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileSearch } from "lucide-react";
import DocumentCard from "./DocumentCard.jsx";
import DocumentUploader from "./DocumentUploader.jsx";
import { fetchDocuments } from "../../store/documentsSlice.js";
import { clearDocumentFilter } from "../../store/chatSlice.js";
import { useDocumentStatusPolling } from "../../hooks/useDocumentStatusPolling.js";
import { Spinner } from "../common/Spinner.jsx";

export default function DocumentList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.documents);
  const selected = useSelector((s) => s.chat.selectedDocumentIds);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useDocumentStatusPolling();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Documents
        </h2>
        <DocumentUploader />
        {selected.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-brand-50 px-2 py-1.5 text-xs text-brand-700">
            <span>Filtering by {selected.length} document(s)</span>
            <button
              type="button"
              onClick={() => dispatch(clearDocumentFilter())}
              className="font-medium hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scroll-fade p-3">
        {loading && items.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
            <Spinner /> Loading documents…
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
            <FileSearch size={28} className="mb-2 text-slate-400" />
            No documents yet.
            <span className="text-xs">Upload a PDF to begin.</span>
          </div>
        )}
        <div className="space-y-2">
          {items.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}
