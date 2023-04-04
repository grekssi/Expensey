import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    image:{
        id: null,
        imgUrl: null,
        title: null,
        rating: null,
        genre: null,
        address: null,
        short_description: null,
        dishes: null,
    }
}

export const imageSlice = createSlice({
    name: "image",
    initialState: initialState,
    reducers: {
        setimage: (state, action) => {
            state.image = action.payload
        }
    },
});

export const { setImages } =
imageSlice.actions;

export const selectimage = state => state.image.image;

export default imageSlice.reducer;