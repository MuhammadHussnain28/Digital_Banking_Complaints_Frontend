import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated : false ,
    reduxUser : {
        name : null ,
        email : null ,
        role : null ,
        bank_id : null ,
        _id : null
    }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("state: ", state);
      console.log("action: ", action);
      console.log("Data Recieved For Global State: ", action.payload);
      state.isAuthenticated = true;
      state.reduxUser = action.payload;
    },

    logOut: (state) => {
      state.isAuthenticated = false;
      state.reduxUser = {
        name: null,
        email: null,
        role: null,
        bank_id: null,
        _id: null,
      };
    },

  },
});


export const {loginSuccess , logOut} = authSlice.actions;
export default authSlice.reducer ;