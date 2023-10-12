import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, role: "" }, // Include the 'role' field
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.role = action.payload.role; // Set the user role when logging in
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = ""; // Clear the user role when logging out
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: authSlice.reducer,
});
