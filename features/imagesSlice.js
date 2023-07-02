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
  const filteredImagesByMonth = {};

  Object.keys(imagesByMonth).forEach((month) => {
    const filteredImages = imagesByMonth[month].filter(
      (image) => image.email === email && image.IsDeleted === false
    );

    if (filteredImages.length > 0) {
      filteredImagesByMonth[month] = filteredImages;
    }
  });


  return filteredImagesByMonth;
};

export default imagesSlice.reducer;
