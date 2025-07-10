import React,{FC,useEffect} from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Reduxのフックをインポート
import { fetchCurrentUser, logoutUser } from './features/auth/authSlice'; // logoutアクションをインポート
import './App.css';
import { Button,Box } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector,useAppDispatch } from './app/hooks';

const App:FC=()=>{
  //型付きのフックを取得する
  const {user,status} = useAppSelector((state)=>state.auth);
  const dispatch=useAppDispatch();

  useEffect(()=>{
    dispatch(fetchCurrentUser());
  },[dispatch]);

  const handleLogout=()=>{
    dispatch(logoutUser());
  };
  if(status==="loading"){
    return <div>アプリケーションを読み込んでいます...</div>
  }




  return (
    <div>
      <h1>Todo App</h1>
      <Box 
        component="nav" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}
      >
        {user ? (
          <>
            <span>こんにちは、{user.name}さん</span>
            <Button 
              variant="outlined" 
              size="small" 
              color="inherit" 
              onClick={handleLogout}
            >
              ログアウト
            </Button>
          </>
        ) : (
          null
        )}
      </Box>
      <hr />

      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}


export default App;