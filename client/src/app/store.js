//ストアを置く場所
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import todoReducer from '../features/todo/todoSlice';

export const store = configureStore({
  reducer:{
    auth: authReducer,//authという名前で登録
    todos:todoReducer,//todoという名前で登録する
  },
});