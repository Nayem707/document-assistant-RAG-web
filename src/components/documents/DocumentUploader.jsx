import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import {
  uploadDocument,
  setUploadProgress,
} from "../../store/documentsSlice.js";
import { Spinner } from "../common/Spinner.jsx";

export default function DocumentUploader() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { uploading, uploadProgress } = useSelector((s) => s.documents);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF files are supported.");
      return;
    }
    try {
      await dispatch(
        uploadDocument({
          file,
          onProgress: (p) => dispatch(setUploadProgress(p)),
        }),
      ).unwrap();
      toast.success("Upload started. Processing…");
    } catch (err) {
      toast.error(err.message ?? "Upload failed.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? <Spinner size={16} /> : <UploadCloud size={16} />}
        {uploading ? `Uploading… ${uploadProgress}%` : "Upload PDF"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onFileChange}
      />
      {uploading && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-brand-600 transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
