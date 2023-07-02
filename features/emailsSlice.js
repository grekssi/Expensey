// src/redux/imagesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const emailsSlice = createSlice({
  name: "emails",
  initialState: {
    emails: [],
  },
  reducers: {
    setEmails: (state, action) => {
      state.emails = action.payload;
    },
    removeEmail: (state, action) => {
      const emailToRemove = action.payload;
      state.emails = state.emails.filter(email => email !== emailToRemove);
    },
  },
});

export const { setEmails, removeEmail } = emailsSlice.actions;

export const getEmails = (state) => {
  const allEmails = state.emails;
  return allEmails;
};

export default emailsSlice.reducer;
