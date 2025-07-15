import React,{FC,ReactNode,useEffect} from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { Box,CircularProgress} from "@mui/material";

interface ProtectedRouteProps{
  children:ReactNode;
}

const ProtectedRoute :FC<ProtectedRouteProps>=({ children})=>{
  const { user,status}=useAppSelector((state)=>state.auth);
  const navigate=useNavigate();

  useEffect(()=>{
    //最初の認証チェックが終わっていて、かつユーザーがいない場合
    if(status!=="loading"&&!user){
      navigate("/login");
    }
  },[user,status,navigate]);//userかstatusが変わるたびにチェック
  //ユーザーが存在する場合のみ、子コンポーネントを表示する
  //存在しない場合は何も表示しない
  if(status==="succeeded"&&user){
    return <>{children}</>;
  }


  //それ以外の場合(ローディング中、またはリダイレクト中)は、
  //ローディングスピナーを表示してユーザーに大気中であることを示す
  return (
    <Box sx={{display:"flex", justifyContent:"center",alignItems:"center",height:"80vh"}}>
      <CircularProgress/>
    </Box>
  );
};

export default ProtectedRoute;
//このファイルは、reduxストアのuserの状態を管理する。もしuserが存在しない場合、/loginページへ飛ばす