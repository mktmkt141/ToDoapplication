import express,{Express} from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import todoRoutes from "./routes/todos";
import userRoutes from "./routes/users";
dotenv.config();


const app: Express=express();

//ミドルウェア
app.use(cors({
  origin:"http://localhost:5173",//フロントエンドのURLを許可
  credentials:true//Cookieの送受信を許可
}));
app.use(express.json());
app.use(cookieParser());

//セッション設定
app.use(session({
  secret:process.env.SESSION_SECRET as string,//セッションIDを署名するための秘密鍵、cookieに保存されるセッションIDが改ざんされていないかを確認するための署名に使われる
  resave:false,//セッションに変更がない場合も再保存しない、
  saveUninitialized:false,//未初期化のセッションを保存しない
  store:MongoStore.create({//セッションをMongoDBに保存する際のコレクション名、セッション情報をMongoDBのsessionsというコレクションに保存する、サーバの再起動してもログイン状態が維持される
    mongoUrl:process.env.MONGO_URI,
    collectionName:"sessions"//MongoDBに保存する際のコレクション名
  }),
  cookie:{
    maxAge:1000*60*60*24,//cookieの有効期限
    httpOnly:true,//jsからcookieにアクセスできないようにする、xss攻撃を防ぐ
    sameSite: 'lax'
  }
}));

app.use("/api/todos",todoRoutes);
app.use("/api/users",userRoutes);

//DBへの接続
const startserver=async()=>{
  if(!process.env.MONGO_URI){
    throw new Error ("MONGO_URI must be defined in .env file");
  }
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodbに正常に接続しました");

    const PORT = process.env.PORT;
    app.listen(PORT,()=>{
      console.log("サーバが起動しました。");
      console.log(`${PORT}`);
    });
  }catch(err){
    console.error("サーバの起動に失敗しました",err);
  }
};
startserver();
