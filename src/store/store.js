import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./AuthSlice.js" ;


const store = configureStore({
    reducer : {
        auth : authReducers
    }
})

console.log("store: " , store)
export default store;