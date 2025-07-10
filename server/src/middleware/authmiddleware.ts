import { Request,Response,NextFunction } from "express";

//認証済みかをチェックするためのミドルウェア
export const isAuthenticated=(req:Request,res:Response,next:NextFunction)=>{
  if(req.session.userId){
    next();
  }else{
    res.status(401).json({message:"認証されていません"});
  }
};