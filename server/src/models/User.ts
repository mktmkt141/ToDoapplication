const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");//パスワードのハッシュ化に利用
const {Schema}= mongoose;

const UserSchema=new Schema({
  name:{
  type:String,
  required:[true,"名前は必須です"],
  trim:true,
  },
  email:{
    type:String,
    required:[true,"メールアドレスは必須です"],
    unique:true,
    trim:true,
  },
  password:{
    type:String,
    required:[true,"パスワードは必須です"],
    minlength:6,
    seclet:false,//find()などでユーザー情報を取得したときにデフォルトでパスワードは含まない
  },

},{
  timestamps:true//createdAtとupdatedAtを自動で記録
});

//ドキュメントが保存される前に処理（ミドルウェア）
UserSchema.pre("save",async function(next){
  //パスワードが変更されていない時は何もしない
  if(!this.isModified("password")){//this.isModifiedはthis.passwordが変更されたときにtrueを返す
    return next();
  }
  const salt=await bcrypt.genSalt(10);//ソルトの作成、コストファクターを10に設定する、saltはハッシュ化処理に使われるランダムな文字列
  this.password=await bcrypt.hash(this.password,salt);//ハッシュ化して上書きする
  next();
})
//パスワードを比較するためのメソッドをスキーマに追加する
UserSchema.methods.comparePassword=async function(candidatePassword){
  return await bcrypt.compare(candidatePassword,this.password);//candidatePasswordをハッシュ化し、それをtihs.passwordと比較する
};

module.exports=mongoose.model("User",UserSchema);