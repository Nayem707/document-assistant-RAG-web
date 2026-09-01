import { CheckCircle2, Clock, AlertTriangle, Upload } from "lucide-react";
import { Spinner } from "../common/Spinner.jsx";

const styles = {
  UPLOADING: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const labels = {
  UPLOADING: "Uploading",
  PROCESSING: "Processing",
  READY: "Ready",
  FAILED: "Failed",
};

function Icon({ status }) {
  if (status === "READY") return <CheckCircle2 size={14} />;
  if (status === "FAILED") return <AlertTriangle size={14} />;
  if (status === "UPLOADING") return <Upload size={14} />;
  if (status === "PROCESSING") return <Spinner size={14} />;
  return <Clock size={14} />;
}

export default function DocumentStatus({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.PROCESSING}`}
    >
      <Icon status={status} />
      {labels[status] ?? status}
    </span>
  );
}
