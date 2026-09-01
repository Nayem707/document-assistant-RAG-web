import { configureStore } from "@reduxjs/toolkit";
import documentsReducer from "./documentsSlice.js";
import chatReducer from "./chatSlice.js";

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    chat: chatReducer,
  },
});
