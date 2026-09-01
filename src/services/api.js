import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const http = axios.create({
  baseURL,
  timeout: 60_000,
});

function extract(response) {
  return response.data?.data ?? null;
}

function extractError(err) {
  const payload = err.response?.data;
  const message = payload?.message ?? err.message ?? "Unknown error";
  const code = payload?.error?.code ?? "UNKNOWN";
  const enriched = new Error(message);
  enriched.code = code;
  enriched.status = err.response?.status;
  return enriched;
}

async function request(fn) {
  try {
    const res = await fn();
    return extract(res);
  } catch (err) {
    throw extractError(err);
  }
}

export const api = {
  health: () => request(() => http.get("/health")),

  listDocuments: () => request(() => http.get("/documents")),
  getDocument: (id) => request(() => http.get(`/documents/${id}`)),
  deleteDocument: (id) => request(() => http.delete(`/documents/${id}`)),
  uploadDocument: (file, onUploadProgress) => {
    const form = new FormData();
    form.append("file", file);
    return request(() =>
      http.post("/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }),
    );
  },

  ask: ({ question, conversationId, documentIds }) =>
    request(() =>
      http.post("/chat", { question, conversationId, documentIds }),
    ),

  listConversations: () => request(() => http.get("/conversations")),
  getConversation: (id) =>
    request(() => http.get(`/conversations/${id}/messages`)),
};
