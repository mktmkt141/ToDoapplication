import "express-session";

declare module "express-session"{
  interface SessionData{
    userId:string;
  }
}

//このファイルの作成によってTypeScriptに対してexpress-sessionのSessionDataにuserIdというプロパティが存在することを教える
//express-sessionライブラリを導入すると、Expressの核リクエスト(req)にsessionという名前のオブジェクトが追加される
//このreq.sessionオブジェクトは自由に入れ物として使うことが出来る
//ユーザーのログインが成功した際に、データベースから取得したuser._idをuserIdという自分で決めた名前でreq.sessionオブジェクトに保存している
//この後にexpress-sessionがこのreq.sessionオブジェクト全体をデータベースに保存し、そのセッションIDをcookieとしてブラウザに送り返す