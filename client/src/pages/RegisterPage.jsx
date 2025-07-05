import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

const RegisterPage=()=>{
  //フォームの値をまとめて管理するためのstate
  const [formData,setFormData]=useState({name:"",email:"",password:"",});

  //ページ遷移のためのフックス
  const dispatch = useDispatch();
  const navigate=useNavigate();

  //Reduxのストアから認証関連のstateを取得する
  const {user,status}=useSelector((state)=>state.auth);

  useEffect(()=>{
    if(user){
      navigate("/");
    }
  },[user,navigate]);
  
  //入力値が変わった時にstateを更新するための関数
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]: e.target.value,});
  };

  //フォームが送信されたときの処理
  const handlesubmit=async(e)=>{
    e.preventDefault();
    try{
      //dispatchした結果をunwrap()で受け取る
      //成功したらfullfilledアクションのpayloadが返ってくる
      await dispatch(registerUser(formData)).unwrap();
      alert("ユーザー登録が成功しました。ログインページに遷移します。");
      navigate("/login");

    }catch(err){
      //unwrap()はrejectedアクションの場合にエラーをthrowする。
      //errオブジェクトにはrejectWithValueで渡したpayloadが入っている
      alert(`登録に失敗しました:${err.message}`);
      console.error("登録失敗:",err);
    }
  };

  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handlesubmit}>
        <div>
          <label htmlFor="name">名前:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/>
        </div>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/>
        </div>
        <button type="submit" disabled={status==="loading"}>{status==="loading"? "登録中...":"登録"}</button>
      </form>
    </div>
  );
};

export default RegisterPage;