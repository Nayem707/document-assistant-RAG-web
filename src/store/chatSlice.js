import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { api } from "../services/api.js";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async () => {
    return api.listConversations();
  },
);

export const openConversation = createAsyncThunk("chat/open", async (id) => {
  return api.getConversation(id);
});

export const sendQuestion = createAsyncThunk(
  "chat/send",
  async ({ question, conversationId }, { getState }) => {
    const documentIds = getState().chat.selectedDocumentIds;
    return api.ask({
      question,
      conversationId: conversationId ?? undefined,
      documentIds: documentIds.length > 0 ? documentIds : undefined,
    });
  },
);

const slice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    activeConversationId: null,
    messages: [],
    selectedDocumentIds: [],
    sending: false,
    error: null,
  },
  reducers: {
    startNewConversation(state) {
      state.activeConversationId = null;
      state.messages = [];
    },
    toggleDocumentFilter(state, action) {
      const id = action.payload;
      if (state.selectedDocumentIds.includes(id)) {
        state.selectedDocumentIds = state.selectedDocumentIds.filter(
          (x) => x !== id,
        );
      } else {
        state.selectedDocumentIds.push(id);
      }
    },
    clearDocumentFilter(state) {
      state.selectedDocumentIds = [];
    },
    pushLocalUserMessage(state, action) {
      state.messages.push({
        id: `local-${nanoid()}`,
        role: "USER",
        content: action.payload,
        createdAt: new Date().toISOString(),
        pending: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (s, a) => {
        s.conversations = a.payload ?? [];
      })

      .addCase(openConversation.fulfilled, (s, a) => {
        s.activeConversationId = a.payload.conversation.id;
        s.messages = a.payload.messages;
      })

      .addCase(sendQuestion.pending, (s) => {
        s.sending = true;
        s.error = null;
      })
      .addCase(sendQuestion.fulfilled, (s, a) => {
        s.sending = false;
        s.activeConversationId = a.payload.conversationId;
        // Replace pending local user message flag; append assistant reply.
        s.messages = s.messages.map((m) =>
          m.pending ? { ...m, pending: false } : m,
        );
        s.messages.push(a.payload.message);
      })
      .addCase(sendQuestion.rejected, (s, a) => {
        s.sending = false;
        s.error = a.error.message;
        s.messages = s.messages.filter((m) => !m.pending);
      });
  },
});

export const {
  startNewConversation,
  toggleDocumentFilter,
  clearDocumentFilter,
  pushLocalUserMessage,
} = slice.actions;
export default slice.reducer;
