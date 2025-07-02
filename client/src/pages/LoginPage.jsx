import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

const LoginPage=()=>{
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  });

  const dispatch=useDispatch();
  //ページ遷移のためのフック
  const navigate=useNavigate();

  //Reduxストアから認証関連のstateを取得
  const { status}=useSelector((state)=>state.auth);

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    //e.target.nameはname属性のこと例えば、メールの欄ならemail。e.target.valueは今入力されている最新の値。...はスプレッド構文で、オブジェクトの中身を展開する。[]で囲むと、キー名を変数や式の値で動的に設定できる。例えば、ユーザーがメールアドレスの欄に、「a」と入力したとすると、e.target.nameはemailになり、e.target.valueはaになる。結果、[e.target.name]: e.target.valueの部分は、{ email: 'a' }と解釈される。
  };

  //入力欄が変わった時にstateの更新を行う
  const handleSubmit=async(e)=>{
    e.preventDefault();
    //loginUserアクションをdispatchする
    try{
      //dispatchした結果をunwrapで受けとる
      await dispatch(loginUser(formData)).unwrap();
      navigate("/");
    }catch(err){
      alert(`ログインに失敗しました:${err.message}`);
      console.error("ログインに失敗:",err);
    }
  };
  
  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required
          />
        </div>
        <button type="submit" disabled={status==="loading"}>{status==="loading"?"ログイン中...":"ログイン"}</button>
      </form>
    </div>
  );
};

export default LoginPage;