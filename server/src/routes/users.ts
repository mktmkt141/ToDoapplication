import express,{Request,Response,NextFunction} from "express";
import User,{IUser} from "../models/User";
import { isAuthenticated } from "../middleware/authmiddleware";

const router=express.Router();

//新規ユーザーの登録を行う
router.post("/register",async (req:Request,res:Response)=>{
  try{
    const {name,email,password}=req.body;
    //バリデーション：必須項目が入力されているか
    if(!name|| !email || !password){
      res.status(400).json({message:"すべての項目を入力してください"});
      return ;
    }
    //ユーザーが既に存在するかを確認
    const userExists=await User.findOne({email});
    if(userExists){
      res.status(400).json({message:"このメールアドレスは既に使用されています"});
      return;
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
  }catch(err:any){
    if (err.name === 'ValidationError') {
      // エラーメッセージの中から、最初のエラーメッセージを抽出して返す
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ message: messages[0] });
      return;
    }

    console.error(err);
    res.status(500).json({message:"サーバエラーが発生しました"});
  }
});

//ユーザーログイン
router.post("/login",async (req:Request,res:Response)=>{
  try{
    const {email,password}=req.body;

    if(!email|| !password){
      res.status(400).json({message:"メールアドレスとパスワードを入力してください"});
      return;
    }
    //ユーザーをメールアドレスで検索(パスワードも取得する)
    const user=await User.findOne({email}).select("+password");
    if(!user|| !(await user.comparePassword(password))){
      res.status(401).json({message:"メールアドレスまたはパスワードが無効です"});
      return;
    }

    //セッションにユーザーidを保存
    req.session.userId=String(user._id);

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

router.post("/logout",(req:Request,res:Response)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).json({message:"ログアウトに失敗しました"});
    }
    //セッションクッキーをクリアするようにブラウザに指示する
    res.clearCookie("connect.sid");
    res.status(200).json({message:"ログアウトに成功しました"});
  });
});

// const isAuthenticated=(req,res,next)=>{
//   if(req.session.userId){
//     next();
//   }else{
//     res.status(401).json({message:"認証されていません"});
//   }
// };
//現在のログインユーザー情報を取得する
router.get("/me",isAuthenticated,async(req:Request,res:Response)=>{
  try{
    const user=await User.findById(req.session.userId).select("-password");
    if(!user){
       res.status(404).json({message:"ユーザーが見つかりません"});
       return;
    }
    res.json(user);
  }catch(err){
    console.error(err);
    res.status(500).json({message:"サーバーエラー"});
  }
});

export default router;