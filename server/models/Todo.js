const mongoose = require("mongoose");
const {Schema}=mongoose;

const todoSchema=new Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,//データ型はMongoDBのID,userフィールドにはユーザーのID(MongoDBの自動生成ID)が入る
    ref:"User",//Userモデルを参照する
    required:true
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:false,
  },
  dueData:{
    type:Date,
    required:false,
  },
  priority:{
    type:String,
    enum:["高","低"],
    default:"低",
  },
  completed:{
    type:Boolean,
    default:false,
  },
},{
  timestamps:true,
});

module.exports=mongoose.model("Todo",todoSchema);