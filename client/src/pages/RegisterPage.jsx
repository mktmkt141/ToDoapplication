import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate,Link as RouterLink } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          新規登録
        </Typography>
        <Box component="form" onSubmit={handlesubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="名前"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '登録中...' : '登録'}
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            すでにアカウントをお持ちですか？ ログイン
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;