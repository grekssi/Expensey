// src/redux/imagesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const imagesSlice = createSlice({
    name: 'images',
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
export const selectImages = state => state.images.imagesByMonth;

export const selectUserEmails = state => {
    const imagesByMonth = state.images.imagesByMonth;
    const userEmails = [];
  
    Object.values(imagesByMonth).forEach((images) => {
      images.forEach((image) => {
        if (!userEmails.includes(image.email)) {
          userEmails.push(image.email);
        }
      });
    });

    console.log(userEmails);
    return userEmails;
  };

export default imagesSlice.reducer;