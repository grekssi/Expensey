// src/redux/imagesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const emailsSlice = createSlice({
  name: "images",
  initialState: {
    emails: [],
  },
  reducers: {
    setEmails: (state, action) => {
      state.emails = action.payload;
    },
  },
});

export const { setEmails } = emailsSlice.actions;
export const selectImages = (state) => state.images.emails;

export const getEmails = (state) => {
  const allEmails = state.emails;

  return allEmails;
};

export default emailsSlice.reducer;
