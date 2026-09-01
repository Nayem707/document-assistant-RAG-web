import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshDocument } from "../store/documentsSlice.js";

/**
 * Polls documents that are still UPLOADING or PROCESSING every 2s until
 * they reach a terminal state (READY / FAILED).
 */
export function useDocumentStatusPolling() {
  const items = useSelector((s) => s.documents.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const inFlight = items.filter(
      (d) => d.status === "UPLOADING" || d.status === "PROCESSING",
    );
    if (inFlight.length === 0) return undefined;

    const interval = setInterval(() => {
      inFlight.forEach((doc) => dispatch(refreshDocument(doc.id)));
    }, 2000);
    return () => clearInterval(interval);
  }, [items, dispatch]);
}
