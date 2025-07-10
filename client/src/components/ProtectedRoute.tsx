import React,{FC,ReactNode,useEffect} from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps{
  children:ReactNode;
}

const ProtectedRoute :FC<ProtectedRouteProps>=({ children})=>{
  const { user,status}=useAppSelector((state)=>state.auth);
  const navigate=useNavigate();

  useEffect(()=>{
    //最初の認証チェックが終わっていて、かつユーザーがいない場合
    if(status!=="loading"&&!user&&status!=="idle"){
      navigate("/login");
    }
  },[user,status,navigate]);//userかstatusが変わるたびにチェック
  //ユーザーが存在する場合のみ、子コンポーネントを表示する
  //存在しない場合は何も表示しない
  return user? <>children</>:null;
};

export default ProtectedRoute;
//このファイルは、reduxストアのuserの状態を管理する。もしuserが存在しない場合、/loginページへ飛ばす