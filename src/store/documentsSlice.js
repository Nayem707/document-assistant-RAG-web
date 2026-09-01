import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api.js";

export const fetchDocuments = createAsyncThunk(
  "documents/fetchAll",
  async () => {
    return api.listDocuments();
  },
);

export const uploadDocument = createAsyncThunk(
  "documents/upload",
  async ({ file, onProgress }, { dispatch }) => {
    const doc = await api.uploadDocument(file, (evt) => {
      if (evt.total && onProgress)
        onProgress(Math.round((evt.loaded * 100) / evt.total));
    });
    dispatch(refreshDocument(doc.id));
    return doc;
  },
);

export const refreshDocument = createAsyncThunk(
  "documents/refreshOne",
  async (id) => {
    return api.getDocument(id);
  },
);

export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id) => {
    await api.deleteDocument(id);
    return id;
  },
);

const slice = createSlice({
  name: "documents",
  initialState: {
    items: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
  },
  reducers: {
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
    resetUpload(state) {
      state.uploading = false;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload ?? [];
      })
      .addCase(fetchDocuments.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })

      .addCase(uploadDocument.pending, (s) => {
        s.uploading = true;
        s.uploadProgress = 0;
        s.error = null;
      })
      .addCase(uploadDocument.fulfilled, (s, a) => {
        s.uploading = false;
        s.uploadProgress = 100;
        if (a.payload) s.items.unshift(a.payload);
      })
      .addCase(uploadDocument.rejected, (s, a) => {
        s.uploading = false;
        s.uploadProgress = 0;
        s.error = a.error.message;
      })

      .addCase(refreshDocument.fulfilled, (s, a) => {
        const idx = s.items.findIndex((d) => d.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
        else s.items.unshift(a.payload);
      })

      .addCase(deleteDocument.fulfilled, (s, a) => {
        s.items = s.items.filter((d) => d.id !== a.payload);
      });
  },
});

export const { setUploadProgress, resetUpload } = slice.actions;
export default slice.reducer;
