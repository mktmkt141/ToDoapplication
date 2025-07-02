const express = require("express");
const router= express.Router();
const User = require("../models/User");

//新規ユーザーの登録を行う
router.post("/register",async (req,res)=>{
  try{
    const {name,email,password}=req.body;
    //バリデーション：必須項目が入力されているか
    if(!name|| !email || !password){
      return res.status(400).json({message:"すべての項目を入力してください"});
    }
    //ユーザーが既に存在するかを確認
    const userexist=await User.findOne({email});
    if(userexist){
      return res.status(400).json({message:"このメールアドレスは既に使用されています"});
    }
    const user= new User({name,email,password});
    await user.save();

    //登録が成功したことのレスポンス
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      message:"ユーザー登録が成功しました"
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message:"サーバエラーが発生しました"});
  }
});

//ユーザーログイン
router.post("/login",async (req,res)=>{
  try{
    const {email,password}=req.body;

    if(!email|| !password){
      return res.status(400).json({message:"メールアドレスとパスワードを入力してください"});
    }
    //ユーザーをメールアドレスで検索(パスワードも取得する)
    const user=await User.findOne({email}).select("+password");
    if(!user|| !(await user.comparePassword(password))){
      return res.status(401).json({message:"メールアドレスまたはパスワードが無効です"});
    }

    //セッションにユーザーidを保存
    req.session.userId=user._id;

    //ログイン成功のレスポンス
    res.status(200).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      message:"ログインに成功しました"
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message:"サーバエラーが発生しました"});
  }
});

router.post("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).json({message:"ログアウトに失敗しました"});
    }
    //セッションクッキーをクリアするようにブラウザに指示する
    res.clearCookie("connect.sid");
    res.status(200).json({message:"ログアウトに成功しました"});
  });
});

module.exports=router;