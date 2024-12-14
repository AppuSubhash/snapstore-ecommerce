import { configureStore } from '@reduxjs/toolkit';
import { userApiSlice } from './slices/userApiSlice';
import cartReducer from './slices/cartSlice';
import authenticationReducer from './slices/authSlice';

const appStore = configureStore({
  reducer: {
    // Injecting the user API service reducer to handle API slice
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    // Adding the cart and authentication reducers
    cart: cartReducer,
    auth: authenticationReducer,
  },
  // Adding the user API middleware to handle caching and error handling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
  devTools: true, // Enabling dev tools for easy debugging
});

export default appStore;
