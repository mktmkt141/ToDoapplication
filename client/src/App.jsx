import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Reduxのフックをインポート
import { fetchCurrentUser, logoutUser } from './features/auth/authSlice'; // logoutアクションをインポート
import './App.css';
import { Button,Box } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  // Reduxストアからauthスライスの状態を取得
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate= useNavigate();

  //アプリ起動時に一度だけ実行するuseEffectを追加する
  useEffect(()=>{
    dispatch(fetchCurrentUser());
  },[dispatch]);

  // ログアウトボタンが押されたときの処理
  const handleLogout = () => {
    dispatch(logoutUser());
    // 必要であれば、ログアウト後にログインページへ飛ばすこともできます
    // navigate('/login'); // これを使う場合はuseNavigateもインポート
    // navigate("/login");
  };

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