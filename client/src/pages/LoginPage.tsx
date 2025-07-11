import React,{FC,useState,useEffect,FormEvent} from "react";
import { useNavigate,Link as RouterLink } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authSlice";
import { Button,TextField,Container,Typography,Box,Link} from "@mui/material";

const LoginPage:FC=()=>{
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  });
  const dispatch=useAppDispatch();
  //ページ遷移のためのフック
  const navigate=useNavigate();

  //Reduxストアから認証関連のstateを取得
  const { user,status}=useAppSelector((state)=>state.auth);

  //userが存在するなら、ホームページにリダイレクト
  useEffect(()=>{
    //リダイレクト
    if(user){
      navigate("/");
    }
  },[user,navigate]);

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    //e.target.nameはname属性のこと例えば、メールの欄ならemail。e.target.valueは今入力されている最新の値。...はスプレッド構文で、オブジェクトの中身を展開する。[]で囲むと、キー名を変数や式の値で動的に設定できる。例えば、ユーザーがメールアドレスの欄に、「a」と入力したとすると、e.target.nameはemailになり、e.target.valueはaになる。結果、[e.target.name]: e.target.valueの部分は、{ email: 'a' }と解釈される。
  };

  //入力欄が変わった時にstateの更新を行う
  const handleSubmit=async(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    //loginUserアクションをdispatchする
    dispatch(loginUser(formData)).unwrap().catch((err)=>{
      alert(`ログインに失敗しました:${err.message||"エラーが発生しました"}`);
    });
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
       sx={{
        marginTop:8,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
       }}>

        <Typography component="h1" variant="h5">
          ログイン
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt:1}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
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
              autoComplete="email"
              value={formData.password}
              onChange={handleChange}
           />
           <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt:3,mb:2}}
              disabled={status==="loading"}
            >
              {status==="loading"?"ログイン中...":"ログイン"}
            </Button>

            <Link component={RouterLink} to="/register" variant="body2">
              アカウントをお持ちではない方はこちら 新規登録
            </Link>
        </Box>
       </Box>
       </Container>
  );
};

export default LoginPage;