import express , {Router,RequestHandler} from "express";
import Todo from "../models/Todo";
import { isAuthenticated } from "../middleware/authmiddleware";

const router =express.Router();
router.use(isAuthenticated);

//自分のTodoを全て取得する
const getAllTodos:RequestHandler=async (req,res)=>{
  try{
    const todos=await Todo.find({user:req.session.userId}).sort({createdAt:-1});
    res.json(todos);
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
};

//自分のTodoとして新規作成
const createTodo:RequestHandler=async(req,res)=>{
  try{
    const { title,description,dueDate,priority}=req.body;
    const newTodo=new Todo({
      title,
      description,
      dueDate,
      priority,
      user:req.session.userId
    });
    const savedTodo=await newTodo.save();
    res.status(201).json(savedTodo);
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
};

//自分のTodoを更新
const updateTodo:RequestHandler=async (req,res)=>{
  try{
    const todo=await Todo.findById(req.params.id);
    if(!todo){
      res.status(404).json({message:"タスクが見つかりません"});
      return ;
    }
    if(String(todo.user)!==req.session.userId){
      res.status(403).json({message:"この権限を行う権利がありません"});
      return ;
    }

    const updatedTodo=await Todo.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(updatedTodo);
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
};

//自分のTodoを削除する
const deleteTodo:RequestHandler=async (req,res)=>{
  try{
    const todo=await Todo.findById(req.params.id);
    if(!todo){
      res.status(404).json({message:"タスクが見つかりません"});
      return;
    }
    if(String(todo.user)!==req.session.userId){
      res.status(403).json({message:"この操作を行う権限がありません"});
      return ;
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({message:"タスクを削除しました"});
  }catch(err){
    res.status(500).json({message:"サーバエラー"});
  }
};

router.get("/",getAllTodos);
router.post("/",createTodo);
router.put("/:id",updateTodo);
router.delete("/:id",deleteTodo);

export default router;

