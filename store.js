import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import imagesReducer from './features/imagesSlice';

export const store = configureStore({
    reducer: {
        images: imagesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});