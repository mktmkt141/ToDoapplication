export interface User{
  _id:string;
  name:string;
  email:string;
}
export interface Todo{
  _id:string;
  user:string;
  title:string;
  description?:string;
  dueDate?:string;
  priority:"高"|"低";
  completed:boolean;
  createdAt:string;
  updatedAt:string;
}