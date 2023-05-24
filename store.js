import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import imagesReducer from './features/imagesSlice';
import emailReducer from './features/emailsSlice';

export const store = configureStore({
    reducer: {
        images: imagesReducer,
        emails: emailReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});