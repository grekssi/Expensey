// src/redux/imagesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    imagesByMonth: {},
  },
  reducers: {
    setImages: (state, action) => {
      state.imagesByMonth = action.payload;
    },
  },
});

export const { setImages } = imagesSlice.actions;
export const selectImages = (state) => state.images.imagesByMonth;

export const selectImagesByEmail = (state, email) => {
  const imagesByMonth = state.images.imagesByMonth;
  let filteredImagesByMonth = {};

  Object.keys(imagesByMonth).forEach((month) => {
    const filteredImages = imagesByMonth[month].filter(
      (image) => image.email === email && image.IsDeleted === false
    );

    if (filteredImages.length > 0) {
      filteredImagesByMonth[month] = filteredImages;
    }
  });

  // Convert the object to an array, sort it in descending order, and convert it back to an object
  filteredImagesByMonth = Object.fromEntries(
    Object.entries(filteredImagesByMonth)
      .sort((a, b) => b[0].localeCompare(a[0]))
  );

  return filteredImagesByMonth;
};

export default imagesSlice.reducer;
