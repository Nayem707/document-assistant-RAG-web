import { FileText } from "lucide-react";

export default function SourceCard({ source }) {
  const similarity =
    source.similarity != null ? `${Math.round(source.similarity * 100)}%` : "";
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs">
      <div className="flex items-center gap-1 font-medium text-slate-800">
        <FileText size={12} />
        <span className="truncate" title={source.documentName}>
          {source.documentName}
        </span>
      </div>
      <div className="mt-0.5 flex flex-wrap gap-x-2 text-slate-500">
        {source.page != null && <span>Page {source.page}</span>}
        {similarity && <span>Similarity: {similarity}</span>}
      </div>
      {source.content && (
        <p className="mt-1 line-clamp-3 text-slate-600" title={source.content}>
          {source.content}
        </p>
      )}
    </div>
  );
}
