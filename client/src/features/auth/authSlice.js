//機能ごとのロジックを置く場所
//ここは認証機能関連のロジックを置く場所（認証機能に関するstateとそれを変更するSliceを作成する。Sliceは機能ごとの小さなReduxモジュール）
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
//createAsyncThunkはAPI通信などの非同期処理を行う。通信中はtrue,通信が成功したらfalseにし成功データをstateに保存。失敗したらfalseに、エラー情報をstateに保存する(ローディング中、成功、失敗)の管理を自動化する。待機中(pending),成功(fullfilled),失敗(rejected)の三つの状態を生む。extraReducersでは、それぞれの状態になった時にstatusやuser,errorのstateをどう変更するかを定義する
import apiClient from "../../api/axios";

//非同期処理(API通信)の定義
//ユーザー新規登録
export const registerUser=createAsyncThunk(
  "auth/register",//アクションの名前
  async(userData,{rejectWithValue})=>{//コンポーネントからdispatchされるときに渡されるデータが入る
    try{
      const response=await apiClient.post("/users/register",userData);
      return response.data;//成功したらユーザーデータを返す
    }catch(error){
      return rejectWithValue(error.response.data);//(rejectedアクションのpayloadにバックエンドから送られてきたエラー情報が付く)
    }
  }
);

//ユーザーログイン
export const loginUser=createAsyncThunk(
  "auth/login",
    async(userData,{rejectWithValue})=>{
      try{
        const response=await apiClient.post("/users/login",userData);
        return response.data;
      }catch(error){
        return rejectWithValue(error.response.data);
      }
    }
);

//ログアウト用の非同期処理を追加
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async(_,{rejectWithValue})=>{
    try{
      await apiClient.post("/users/logout");
      return ;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
};


export const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{},

  //非同期処理の結果をここで記述
  extraReducers:(builder)=>{
    builder
    //registerUserの状態別処理
    .addCase(registerUser.pending,(state)=>{
      state.status="loading";
    })
    .addCase(registerUser.fulfilled,(state,action)=>{
      state.status="succeeded";
    })
    .addCase(registerUser.rejected,(state,action)=>{
      state.status="failed";
      state.error=action.payload.message;
    })
    //loginuserの状態別処理
    .addCase(loginUser.pending,(state)=>{
      state.status="loading";
    })
    .addCase(loginUser.fulfilled,(state,action)=>{
      state.status="succeeded";
      state.user=action.payload;
    })
    .addCase(loginUser.rejected,(state,action)=>{
      state.status="failed";
      state.error=action.payload.message;
    })
    .addCase(logoutUser.fulfilled,(state,action)=>{
      state.user=null;
      state.status="idle";
      state.error=null;
    });
  },
});

export default authSlice.reducer;