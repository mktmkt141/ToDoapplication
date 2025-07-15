import mongoose,{Document,Schema,model} from "mongoose";
import bcrypt from "bcryptjs";//パスワードのハッシュ化に利用

//Userドキュメントの型を定義するためのインターフェース
//IUserという名前のインターフェースを他のファイルから使えるようにするためにexport
//password?stringで、?がついているのはこのプロパティが任意であることを示す
export interface IUser extends Document{
  name:string;
  email:string;
  password?:string;//select:falseなので、任意プロパティとして定義する
  comparePassword:(candidatePassword:string)=>Promise<boolean>;//カスタムメソッドの型定義、Promise<boolean>で最終的にtrueかfalseになる非同期処理を返す関数であることを定義する
}

const UserSchema=new Schema<IUser>({
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
    lowercase:true,
  },
  password:{
    type:String,
    required:[true,"パスワードは必須です"],
    minlength:6,
    seclet:false,//find()などでユーザー情報を取得したときにデフォルトでパスワードは含まない
    validate: {
        validator: function(v: string) {
          // パスワードが「英字」と「数字」の両方を含むことをチェックする正規表現
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
        },
        message: 'パスワードは、6文字以上で、英字と数字の両方を含める必要があります。'
      }
  },

},{
  timestamps:true//createdAtとupdatedAtを自動で記録
});

//ドキュメントが保存される前に処理（ミドルウェア）
//pre-saveフックでパスワードのハッシュ化
UserSchema.pre("save",async function(next){
  //thisの型をIUserとして扱う
  const user = this as IUser;

  //パスワードが変更されていない時は何もしない
  if(!user.isModified("password")||!user.password){
    return next();
  }
  try{
    const salt = await bcrypt.genSalt(10);//ソルトの作成、コストファクターを10に設定する、saltはハッシュ化処理に使われるランダムな文字列
    user.password=await bcrypt.hash(user.password,salt);
    next();
  }catch(error){
    //nextにエラーを返す
    if(error instanceof Error){
      return next(error);
    }
    return next(new Error("Password hashing failed"));
  }
});
//パスワードを比較するためのメソッドをスキーマに追加する
UserSchema.methods.comparePassword=async function (candidatePassword:string):Promise<boolean>{
  //this.paasword はselect falseなので、明示的に取得したときにしか使えない
  //ログインのロジックで.select("+password")を使っているから、ここではthis.passwordが利用可能
  return bcrypt.compare(candidatePassword,this.password);
};
export default model <IUser> ("User",UserSchema);