const express= require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");//expressでセッション管理を行うためのライブラリ、ログイン状態の維持をする
const MongoStore= require("connect-mongo");//express-sessionが作成したセッション情報をmongodbデータベースに保存するためのライブラリ、ログイン状態が維持される
const cookieParser = require('cookie-parser');



console.log("mongouriの値",process.env.MONGO_URI);
console.log('セッションシークレット:', process.env.SESSION_SECRET);

const app = express();
app.use(cookieParser());
//ミドルウェア
app.use(cors({
  origin:"http://localhost:5173",//フロントエンドのURLを許可
  credentials:true//Cookieの送受信を許可
}));
app.use(express.json());

//セッション設定
app.use(session({
  secret:process.env.SESSION_SECRET,//セッションIDを署名するための秘密鍵、cookieに保存されるセッションIDが改ざんされていないかを確認するための署名に使われる
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



// app.use((req, res, next) => {
//   console.log('--- 新しいリクエスト ---');
//   console.log('URL:', req.originalUrl);
//   console.log('Cookies:', req.cookies);
//   console.log('Session:', req.session);
//   console.log('----------------------');
//   next();
// });

//もし/api/todosから始まるリクエストが来たら、その処理は全部todoRoute(routes/todos.js)に任せる
const todoRoutes= require("./routes/todos");
const userRoutes= require("./routes/users");
app.use("/api/todos",todoRoutes);
app.use("/api/users",userRoutes);

//DBへの接続
const startserver=async()=>{
  try{
    const mongoURI=process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
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
