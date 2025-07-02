const express = require("express");
const router = express.Router();
const Todo=require("../models/Todo.js");


//ミドルウェアの作成
const isAuthenticated=(req,res,next)=>{
  if(req.session.userId){
    //セッションにuserIDがあれば、ログインしていると判断し、次の処理に進む
    next();
  }else{
    //ログインしていなければ401エラー
    res.status(401).json({message:"認証されていません、ログインしてください"});
  }
};

//APIエンドポイントの設定//
router.get("/",isAuthenticated,async(req,res)=>{
  try{
    const todos=await Todo.find({user:req.session.userId}).sort({createdAt:-1});
    res.json(todos);
  }catch(err){
    res.status(500).json({message:"サーバーエラー"});
  }
});

router.post("/",isAuthenticated,async(req,res)=>{
  try{
    const{title,description,dueData,priority}=req.body;
    const newTodo=new Todo({
      title,
      description,
      dueData,
      priority,
      user:req.session.userId//ログイン中のユーザーのIDを紐づける
    });
    const savedTodo=await newTodo.save();
    res.status(201).json(savedTodo);
  }catch(err){
    res.status(500).json({message:"サーバーエラー"});
  }
});

//指定したIDのTodoを更新する
router.put("/:id",async(req,res)=>{
  try{
    const todo = await Todo.findById(req.params.id);
    if(!todo)return res.status(403).json({message:"この操作を行う権限がありません"});
    //タスクの所有者とログイン中のユーザーが一致するかを確認
    if(todo.user.toString()!==req.session.userId){
      return res.status(403).json({message:"この操作を行う権限がありません"});
    }
    const updatedTodo= await Todo.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(updatedTodo);
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
});

//指定したIDのTodoを削除する
router.delete("/:id",async(req,res)=>{
  try{
    const todo=await Todo.findById(req.params.id);
    if(!todo)return res.status(404).json({message:"タスクが見つかりません"});

    //タスクの所有者とログイン中のユーザーが位置するかを確認
    if(todo.user.toString()!==req.session.userId){
      return res.status(403).json({message:"この操作を行う権限がありません"});
    }
    await Todo.findByIdAndDelete(req.params.id);
    res.json({message:"タスクを削除しました"});
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
});

module.exports=router;

