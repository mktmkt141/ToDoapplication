import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axios";
import { logoutUser } from "../auth/authSlice";

//非同期処理：サーバーからTodoリストを取得する
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async(_,{rejectWithValue})=>{
    try{
      const response=await apiClient.get("/todos");
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

//新しいタスクを追加する非同期処理
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async(taskData,{rejectWithValue})=>{
    try{
      const response = await apiClient.post("/todos",taskData);
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

//タスクの完了状態を切り替える非同期処理を追加
export const toggleTodo= createAsyncThunk(
  "todos/toggleTodo",
  async(todo,{rejectWithValue})=>{
    try{
      const response = await apiClient.put(`/todos/${todo._id}`,{completed:!todo.completed});
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

//タスクを削除する非同期処理を追加
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async(todoId,{rejectWithValue})=>{
    try{
      await apiClient.delete(`/todos/${todoId}`);
      return todoId;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState={
  todos:[],
  status:"idle",
  error:null,
};

const todoSlice=createSlice({
  name:"todos",
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
      .addCase(fetchTodos.pending,(state)=>{
        state.status="loading";
      })
      .addCase(fetchTodos.fulfilled,(state,action)=>{
        state.status="succeeded";
        state.todos=action.payload;//取得したデータでstateを更新する
      })
      .addCase(fetchTodos.rejected,(state,action)=>{
        state.status="failed";
        state.error=action.payload.message;
      })

      //addTodoの三つの状態に対応する処理を追記
      .addCase(addTodo.pending,(state)=>{
        //新しいタスクを追加中は、一時的にステータスを更新してもよい（今回は何もしなくてよい）
      })
      .addCase(addTodo.fulfilled,(state,action)=>{
        state.todos.unshift(action.payload);
      })
      .addCase(addTodo.rejected,(state,action)=>{
        console.error("タスクの追加に失敗:",action.payload);
        state.error=action.payload.message;
      })

      //toggleTodoの処理
      .addCase(toggleTodo.fulfilled,(state,action)=>{
        const index=state.todos.findIndex(todo=>todo._id===action.payload._id);
        if(index!==-1){
          state.todos[index]=action.payload;//サーバから返ってきた最新データで更新
        }
      })
      //deleteTodoの処理
      .addCase(deleteTodo.fulfilled,(state,action)=>{
        //action.payloadには削除したtodoIdが入っている
        state.todos=state.todos.filter(todo=>todo._id!==action.payload);
      })
      .addCase(logoutUser.fulfilled,(state)=>{
        state.todos=[];
        state.status="idle";
        state.error=null;
      });
  },
});

export default todoSlice.reducer;