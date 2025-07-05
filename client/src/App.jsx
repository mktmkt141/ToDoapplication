import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Reduxのフックをインポート
import { fetchCurrentUser, logoutUser } from './features/auth/authSlice'; // logoutアクションをインポート
import './App.css';

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
      <nav>
        {/* ★★★ userが存在するかどうかで表示を切り替える ★★★ */}
        {user ? (
          <>
            <span>こんにちは、{user.name}さん</span> | <button onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <>
            <Link to="/login">ログイン</Link> | <Link to="/register">新規登録</Link>
          </>
        )}
      </nav>
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