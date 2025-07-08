import mongoose,{Document,Schema,model} from "mongoose";


//Todoドキュメントの型を定義するインターフェース
//interfaceは同じ名前で複数回定義すると、その内容が自動でマージされる
//typeだと、同じ名前で定義しようとすると、エラーになる
//extends DocumentでMongooseドキュメントが持つ_idなどのプロパティをItodoに含める
export interface ITodo extends Document {
  user:mongoose.Schema.Types.ObjectId;
  title:string;
  description?:string;//?はこのプロパティが任意であることを表す
  dueDate?:Date;
  priority:"高"|"低";
  completed:boolean;
}

//<>というTypeScriptのジェネリクスを用いて、Itodoというインターフェースで定義された形をスキーマに課している
//ジェネリクスとは、クラス、メソッド、インターフェースの中で利用される値の型を後から設定できる仕組み
const todoSchema=new Schema<ITodo>({
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
  dueDate:{
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

export default model<ITodo>("Todo",todoSchema);