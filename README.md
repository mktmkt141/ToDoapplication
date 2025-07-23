# タスク管理アプリケーション

## 概要

これは、ユーザー認証機能とTodoリストのCRUD機能を備えた、フルスタックのWebアプリケーションです。

## 目次
1.[画面の様子](#画面の様子)<br>
2.[主な機能](#主な機能)<br>
3.[使用技術](#使用技術)<br>
4.[新規登録の流れ](#新規登録の流れ)<br>
5.[ログインの流れ](#ログインの流れ)<br>
6.[タスクの追加・削除・編集](#タスクの追加削除編集)<br>
7.[Cookieによるセッション認証の流れ](#cookieによるセッションの認証の流れ)<br>
8.[リダイレクトまでの流れ]()<br>
9.[セットアップと起動方法](#セットアップと起動方法)<br>
10.[各技術スタック採用の理由](#各技術スタック採用の理由)<br>
11.[各技術スタックの簡単な説明](#各技術スタックの簡単な説明)<br>
12.[Typescriptについて](#typescriptの概要調べもの)<br>
13.[Typescriptをつかってみて](#typescriptを使ってみて)<br>

---

## 画面の様子

* **新規登録画面**
<img width="1912" height="867" alt="Image" src="https://github.com/user-attachments/assets/1c2bfb01-f3e6-4399-a8cd-1f1ac127e8e7" />

* **ログイン画面**
<img width="1892" height="862" alt="Image" src="https://github.com/user-attachments/assets/3c4fe45b-0fa0-4e09-985c-b822b938402c" />

* **初期画面(タスクの追加をしていない状態)**
<img width="1915" height="867" alt="Image" src="https://github.com/user-attachments/assets/9e04c584-e5c7-40f3-b8d2-7f7640733ce8" />

* **タスクの追加において、期限の設定をするための手段**
<img width="1914" height="870" alt="Image" src="https://github.com/user-attachments/assets/5acac256-9c73-4f3e-992d-59e50a44aea5" />

* **優先度の設定の様子**
<img width="1254" height="501" alt="Image" src="https://github.com/user-attachments/assets/a40671a2-3677-45cb-a565-5ed40fc8545d" />

* **タスクの追加の様子(優先度の高いタスクは赤色に)**
<img width="1916" height="870" alt="Image" src="https://github.com/user-attachments/assets/a857118d-4781-48a5-8906-dedf0670cfa5" /><br>
タスクは新しく追加したタスクから上に載っていく<br>

* **タスクの追加の様子(優先度の低いタスクは水色に)**
<img width="1919" height="856" alt="Image" src="https://github.com/user-attachments/assets/cf1f968d-7c87-4a3c-b0be-209853384728" />

* **タスクの編集**
ペンマークボタンを押す<br>
<img width="1888" height="863" alt="Image" src="https://github.com/user-attachments/assets/4804c86f-fb85-479e-83aa-08b0abb4aa4f" />

<img width="507" height="229" alt="Image" src="https://github.com/user-attachments/assets/af1d4c30-a1b7-4724-9459-79e4044499ee" />

* **タスクの削除**

ゴミ箱ボタンを押す。<br>
<img width="1919" height="856" alt="Image" src="https://github.com/user-attachments/assets/7237ceb1-0aa5-4e90-bfb1-fb3e0d588681" />

タスクが消える
<img width="1915" height="875" alt="Image" src="https://github.com/user-attachments/assets/6b22d9a0-f735-4855-82c1-2c84c6d75ab0" />

## 主な機能

* **ユーザー認証**: 新規登録、ログイン、ログアウト機能。Cookieセッションによる状態管理。
* **Todoリスト管理**:
    * タスクの追加、更新（完了/未完了）、削除 (CRUD)
    * タスクの詳細、優先度、期日の設定
    * 優先度ごとのグループ表示
* **ルート保護**: ログインしていないユーザーはTodoリストにアクセス不可。


---

## 使用技術

このプロジェクトで使用している主な技術スタックです。

* **バックエンド**:
    * Node.js
    * Express
    * TypeScript
    * MongoDB (Mongoose)
    * express-session (Cookieセッション認証)
* **フロントエンド**:
    * React
    * TypeScript
    * Vite
    * Redux Toolkit (状態管理)
    * Material-UI (MUI) (UIコンポーネント)
    * axios
* **その他**:
    * Docker / Docker Compose 

---

## 新規登録の流れ
* **目標**
新しいユーザーをデータベースに保存する<br>
RegisterPage.tsxで、handlesubmit関数が呼ばれる。入力されたデータをReduxのregisterUserアクションをdispatch(実行依頼)する。<br>
authSlice.tsで、registerUserというasync thunkが実行される。次に、バックエンドの/api/users/registerのエンドポイントにPOSTリクエストを送る。<br>
バックエンドのExpressサーバがリクエストを受け取り、/registerルートの処理を開始する。<br>新しいUserモデルのインスタンスを作成し、.save()メソッドが呼ばれる前にUser.tsのスキーマを定義するためのファイルで作ったpre-saveフックが作動して、入力されたパスワードを自動でハッシュ化する。ハッシュ化された安全なパスワードを含むユーザー情報がMONGO DBに保存される。<br>

## ログインの流れ
* **目標**
ユーザーを認証し、その証明書(cookie)をブラウザに渡す。<br>
LoginPage.tsxで定義したhandleSubmit関数がloginUserアクションをdispatchする。<br>次に、authSlice.tsファイルでloginUserというasync thunkがapiClientを使ってバックエンドの/api/users/loginにPOSTリクエストを送る。<br>
バックエンドの/loginルートがリクエストを処理する。メールアドレスでユーザーを検索し、この時にハッシュ化されたパスワードも一緒に取得する。User.tsに定義したcomparePasswordメソッドを使い、入力されたパスワードとデータベースのハッシュ化パスワードを安全に比較する。認証に成功したらreq.session.userId=user._idを実行し、セッションの作成を行う。express-sessionライブラリがこのセッションを一意に識別するためのセッションIDを作成し、Set-Cookieヘッダーに含めてフロントエンドに返信する。<br>
ブラウザはSet-Cookieヘッダーを受け取り、セッションIDをCookieとして保存する。ReduxはloginUser.fulfilledの処理を実行し、サーバから返ってきたユーザー情報でuserのStateを更新する。<br>

## タスクの追加・削除・編集
* **目標**
ログインしているユーザーだけが自分自身のタスクを操作できるようにする。<br>
HomePage.tsxで、ユーザーがタスクの追加、削除、編集を行うための設定を行う。handleAddTodo、handleDeleteなどの関数を使って、addTodoやdeleteTodoといったReduxのアクションをdispatchする。<br>
次に、todoSlice.tsで各async thunkがapiClientを使ってバックエンドの/api/todosエンドポイントにリクエストを送る。(POST、delete、PUT)<br>
apiClientはwithCredentials:trueと設定しているため、この時にブラウザに保存されているCookieが自動でリクエストに添付している。<br>
バックエンドでは、expressサーバーがリクエストを受けとる。isAuthenticatedミドルウェアが作動して、リクエストに添付されたCookieからセッションIDを読み取り、有効なセッションが存在するか(ログインしているか)をチェックする。<br>
認証に成功すると、ルート設定に進む。<br>
追加の処理においては、新しいTodoを作成し、user:req.session.userIdで、今ログインしているユーザーと紐づける。<br>
削除、編集の処理においては、まずIDでタスクを検索し、次にそのタスクの所有者IDと今、リクエストを送ってきたユーザーのセッションIDが一致するかを検証する。これによって他人のタスクを操作できないように設定する。<br>
最後に、各aysnc thunkのfullfilled処理が実行される。各Reduxストアのtodos配列が更新される。useSelectorがストアの変更を検知し、Reactが自動的に画面を再描画し、ユーザーに最新のリストを表示する。<br>

## Cookieによるセッションの認証の流れ
* **サーバー側の設定**<br>
サーバー側の仕事は、**セッションの作成、管理、ブラウザにcookieを渡すこと**<br>
これを実現するために、ライブラリをapp.tsで設定した。ミドルウェアとして、以下の四つを用意した。<br>
- express-session・・セッション管理の中心。ユーザーごとにセッションデータを作成し、それを一意のIDと紐づける。
- connect-mongo・・作成したセッションデータを、MONGODBに保存するための道具、これによってサーバーを再起動してもログイン状態を維持できる。
- cookie-parser・・ブラウザから送られてきたCookieを、サーバーが読み取れるように手伝う。
- cors・・フロントエンドとバックエンドの異なるポート番号通しの通信を許可するために使う。
  
次に、app.tsでセッション管理のルールを定義した。以下のオプションを定義した。<br>
```
secret:process.env.SESSION_SECRET as string,
  resave:false,
  saveUninitialized:false,
  store:MongoStore.create({
    mongoUrl:process.env.MONGO_URI,
    collectionName:"sessions"
  }),
  cookie:{
    maxAge:1000*60*60*24,//cookieの有効期限
    httpOnly:true,//jsからcookieにアクセスできないようにする、xss攻撃を防ぐ
    sameSite: 'lax'
  }
```
| | secret | resave | saveUninitialized | store | cookie |
| ---: | ---: | ---: | ---: | ---: | ---: |
|役割| セッションIDを暗号化するための秘密鍵 |　セッションに変更がない場合でもリクエストのたびにセッションを再保存するかを決める | 新しく作成されたが、まだ何も変更されていないセッションを保存するかを決める | セッションデータの保存先を決める | ブラウザに保存されているCookie自体のルールを設定するためのオブジェクト |
|オプション| セッションIDを暗号化するための秘密鍵 | false | false | connect-mongo | httpOnly:true<br>maxAge:24h<br>sameSite:"lax" |

-httpOnly:true・・・JavaScriptからCookieへのアクセスを禁止する。XSS攻撃によるCookieの盗難を防ぐセキュリティ設定<br>
-maxAge ・・・Cookieの有効期限を指定する。<br>
-sameSite:"lax"・・・CSRFという攻撃を防ぐためのセキュリティ設定。"lax"というのはセキュリティと利便性のバランスが取れた標準的な設定で、ユーザーが他のサイトからリンクをクリックして遷移した場合など、安全な状況でのみCookieを創始するようにブラウザに指示するための設定。

---

## リダイレクトまでの流れ
App.tsxの中にあるuseEffectの中でdispatch(fetchCurrentUser())が実行される。fetchCurrentUserはバックエンドの/api/users/meというエンドポイントにGETリクエストを送る。この時にブラウザが保存されているCookieをリクエストに添付する。バックエンドは受け取った、Cookieを検証し、有効なセッションが存在するかをチェックする。<br>
```
// src/features/auth/authSlice.ts

// ... (他のimport文やinterface定義) ...

// 自分の情報を取得するための非同期処理を追加する
export const fetchCurrentUser = createAsyncThunk<User>(
  "auth/fetchCurrentUser", // アクションの名前
  async (_, { rejectWithValue }) => {
    try {
      // ★★★ ここでAPIを呼び出している ★★★
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ... (他のcreateAsyncThunkやcreateSliceの定義) ...
```
認証成功なら、Reduxストアのuserの状態が更新され、アプリケーションはログイン済みの状態になる。認証失敗ならProtectedRouteによってログインページに遷移する。<br>
```
import React, { FC, ReactNode, useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';

// MUIコンポーネントをインポート
import { Box, CircularProgress } from '@mui/material';

// propsの型を定義
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  // Reduxストアからユーザー情報と認証ステータスを取得
  const { user, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // 最初の認証チェックが完了し（'loading'ではなくなり）、
    // かつユーザーが存在しない場合にリダイレクトを実行する
    if (status !== 'loading' && !user) {
      navigate('/login');
    }
  }, [user, status, navigate]); // userかstatusが変わるたびに、このチェックを実行

  // 認証チェックが完了していて、ユーザーが存在する場合のみ、子コンポーネントを表示
  if (status === 'succeeded' && user) {
    return <>{children}</>;
  }

  // それ以外の場合（ローディング中、またはリダイレクト待ち）は、
  // ローディングスピナーを表示してユーザーに待機中であることを示す
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default ProtectedRoute;

```

## セットアップと起動方法

1.  このリポジトリをクローンします。
    ```
    git clone [このリポジトリのURL]
    ```

2.  バックエンド用の環境変数ファイルを作成します。
    サーバー側のディレクトリに`.env`ファイルを作成し、以下の内容を記述してください。
    ```env
    MONGO_URI=mongodb://admin:password@mongo:27017/todo-app?authSource=admin
    MONGO_INITDB_ROOT_USERNAME=admin
    MONGO_INITDB_ROOT_PASSWORD=password
    PORT=5000
    SESSION_SECRET=[非常に長くランダムな文字列をここに設定]
    ```

3.  Dockerコンテナをビルドして起動します。
    プロジェクトのルートディレクトリで、以下のコマンドを実行してください。
    ```
    docker-compose up --build
    ```

4.  アプリケーションにアクセスします。
    ブラウザで `http://localhost:5173` を開いてください。

---

##  各技術スタック採用の理由

* vite・・・以前にcreate react appのビルドツールを採用した開発の経験があったため違うビルドツールを採用しました。モジュールバンドラーの中の一つで、複数のjsファイルを一つのファイルにするためのツール。複数のjsファイルに依存関係がある場合に、それをそのままブラウザに読み込ませようとすると、アプリケーションが壊れる可能性があるため慎重に行う必要がある。<br>
* cookieによる認証・・・本アプリケーションでは、ユーザー認証にhttpOnly属性を持つCookieを利用したセッション管理方式を採用しました。以前の開発ではJWTをlocalStorageに保存する方式を採用しましたが、今回はセキュリティとシンプルさを重視し、以下の二つの理由からCookieセッション方式を選択しました。
  


1. セキュリティの向上 (XSS対策):
httpOnly属性を付けたCookieは、ブラウザのJavaScriptからアクセスすることができません。これにより、もしアプリケーションにXSS（クロスサイトスクリプティング）の脆弱性が存在した場合でも、攻撃者がセッション情報を盗み出してユーザーになりすますことを防ぎます。
JWTをlocalStorageに保存する場合、JavaScriptから完全にアクセス可能であるため、XSS攻撃によってトークンが盗まれるリスクが常に伴います。今回は、このリスクを根本的に排除することを優先しました。<br>
以下に、セキュリティ向上の項目で出てきた単語についてまとめます。<br>

* **httpOnly属性とは**　<br>サーバがブラウザにcookie送信する際に設定できる重要なセキュリティオプションのこと。この設定によって、ブラウザのjavascriptからアクセスできなくなる。
* **XSS攻撃とは**
    * 目的:ユーザーのブラウザ上で悪意のあるスクリプトを実行させて、ユーザーの個人情報やCookieを盗むこと。
    * 手口:脆弱性のあるサイトの掲示板などに罠となるスクリプトを書き込む。
    * 攻撃の主体：サイトに埋め込まれたスクリプト
* **CSRF攻撃とは**
    * 目的:ログイン済みのユーザーを騙して、そのユーザーの意図しない操作をサイトに実行させること。
    * 手口:ユーザーを罠サイトや偽メールに誘導し、そこから本物のサイトへのリクエストを強制的に送信させること。
    * 攻撃の主体:ログイン済みのユーザーのブラウザ



2. 実装のシンプルさと自動化:
一度サーバー側でSet-Cookieヘッダーを発行すれば、以降のAPIリクエストにはブラウザが自動でCookieを添付してくれます。フロントエンド側で、リクエストのたびに手動でAuthorizationヘッダーを追加するような処理が不要になり、クライアントサイドのコードをシンプルに保つことができます。<br>


---
## 各技術スタックの簡単な説明

* **バックエンド**:
    * Node.js・・・JavaScriptをサーバー側で動かすための実行環境
    * Express・・・Node.js上でWebサーバーを構築するためのライブラリ
    * TypeScript・・・JavaScriptに静的型付けを追加するための言語。開発中のエラーを減らせる
    * MongoDB (Mongoose)・・・ドキュメント指向のNoSQLデータベース
    * Mongoose・・・Node.jsからMongoDBを扱うためのライブラリ、データの形を定義するスキーマ機能がある。
    * express-session (Cookieセッション認証)・・・ログイン状態の管理を行うためのセッション管理ライブラリ、Cookieと連携してユーザー認証の仕組みを実装
* **フロントエンド**:
    * React・・・UIを構築するためのJsライブラリ
    * Vite・・・フロントエンドの開発環境兼ビルドツール、高速な開発サーバを提供する
    * Redux Toolkit (状態管理)・・・Reactアプリケーションの状態を一元管理するためのライブラリ、ログイン状態やタスク管理をStoreで管理する
    * Material-UI (MUI) (UIコンポーネント)・・・React用のUIコンポーネント
    * axios・・・フロントとバックで、HTTP通信を行うためのJavascript
* **その他**:
    * Docker / Docker Compose ・・・アプリケーションのフロントエンド、バックエンド、データベースをコンテナで隔離してパッケージ化する。これにより同じ環境でコンテナを管理することが出来る。<br>

---
## Typescriptの概要(調べもの)

このプログラムはJavaScriptからTypeScriptへ移す形で実現しました。[こちらのサイトを参考にしました](https://typescriptbook.jp/)<br>
* typescriptの特徴
  jsの上位互換言語で、jsに静的な型付けが追加されている。tsで書かれたコードはjsにコンパイルされて、ブラウザ、サーバーなどjsを実行できる環境で動作する。
* 静的型付け
　変数や関数の引数に型を指定することでコードの安定性が向上し、コードが安定する。<br>
* 型推論
  変数に型注釈がついていなくてもコード上の文脈に基づいて、型を推論する。<br>
* 構造的部分型システム
  オブジェクトの形状(どのようなプロパティとメソッドを持つか)に基づいて型を判断する。
* ジェネリクスとは
  型だけが異なる関数などがある場合に、型を引数にして(関数名<型名>)のように関数を呼び出す際に、型名を渡してあげる。
* 高度な型表現
  1.ユニオン型：複数の型のどれかを表すことが出来る。初期値がnullの変数を処理する際にユニオン型を利用することが出来る。
  ```
  type NullableString = string | null;
  ```
  2.タプル型：配列の各要素に異なる型を指定できる型のこと。異なる型の組み合わせを実現できる。
  ```
  type Response = [number, string];
  const response: Response = [200, "OK"];
  ```
* クラスとインターフェース
  クラスとインターフェースの両方を実現する。<br>
  ```
  interface Person {
  firstName: string;
  lastName: string;
   }
    
   class Employee implements Person {
     firstName: string;
     lastName: string;
     constructor(firstName: string, lastName: string) {
       this.firstName = firstName;
       this.lastName = lastName;
     }
   }
  ```
* tsもjsと同じくシングルモデルの言語
  1つのスレッドで1つのタスクしか実行できない。実装しているタスクが重い場合、他のタスクを待たせることになる。長時間の処理、外部の処理(サーバーからのデータの処理)を待つ場合に非同期処理を実行する必要がある。<br>
  同期処理・・複数のタスクを実行する際に上から一つずつ順番にタスクが実行される方式。<br>
  非同期処理・・処理を一度バックグラウンドに移すことであるタスクを実行している最中でもその処理を停めることなく別のタスクを実行できる方式

```
export interface IUser extends Document{
  name:string;
  email:string;
  password?:string;//select:falseなので、任意プロパティとして定義する
  comparePassword:(candidatePassword:string)=>Promise<boolean>;//カスタムメソッドの型定義、Promise<boolean>で最終的にtrueかfalseになる非同期処理を返す関数であることを定義する
}
```
* 静的型付け
  pythonのような実行時に型が定まる動的型付け言語とは異なり、コンパイル時にが定まる。<br>
  静的型付け言語では、型注釈を変数ごとに書いていく必要がある。

---

## TypeScriptを使ってみて

  * 変数に型を置くことで、自動補完やエラーの発見が見つけやすくなった。
  * 型アサーションというものを知った。
  typescriptでは、型を自動で推論してくれる機能があるが、ユーザーがコンパイラに詳しく型を使えたい場合に、*as*を用いて型を具体的に伝えることが出来た。
  ```
  const value: string | number = "this is a string";
  const strLength: number = (value as string).length;
  ```
  * .d.tsファイルについて
  express-session.d.tsについて<br>
  ```
  import "express-session";
   declare module "express-session"{
     interface SessionData{
       userId:string;
     }
   }
  ```
  このファイルのように、外部ライブラリの型定義に独自で設定したuserIdというプロパティの存在をtypescriptに伝えるためのファイル。<br>
  express-sessionライブラリにはreq.sessionの型定義にuserIdの情報は含まれていない。そこで、このファイルで新たにuserIdを定義することを宣言した。<br>
  express-sessionモジュールが定義しているSessionDataというインターフェースに新しいプロパティを追加した。<br>
  * 関数の型宣言も行った。
  [このファイル](https://github.com/mktmkt141/ToDoapplication/blob/master/server/src/routes/todos.ts)の中にあるように、
  ```
  const getAllTodos:RequestHandler=async (req,res)=>{
     try{
       const todos=await Todo.find({user:req.session.userId}).sort({createdAt:-1});
       res.json(todos);
     }catch(err){
       res.status(500).json({message:"サーバエラー"});
     }
  };
  ```
  getAllTodos関数にexpressライブラリが提供するルートハンドラ関数専用の型であるRequestHandlerを付ける。<br>
  <br>
  一方、関数の引数に直接型を付けることもした。<br>
  ```
  router.post("/register",async (req:Request,res:Response)=>{
  try{
    const {name,email,password}=req.body;
    //バリデーション：必須項目が入力されているか
    if(!name|| !email || !password){
      res.status(400).json({message:"すべての項目を入力してください"});
      return ;
    }
    .....
  ```
  このファイルではreqという引数にはExpressが提供するRequestという型を付ける。resという引数にはExpressが提供するResponseという型を付ける。<br>
  *RequestHandlerを使う方法と、直接引数に書く方法の二つがある。*
  * any型
    ```
    } catch (err: any) {
     // ...
    }
    ```
    このファイルの文にもあるように、catch文に入った時にエラーオブジェクトerrはどんな型を持っているのか分からないためany型(何でもありな型)として扱うことを宣言する。<br>
    *補足*
    ```
    function hello(name) {
        console.log(`Hello, ${name.toUpperCase()}`);
    }
       
    hello(1);
    ```
    上のコードのようにname はany型として扱われるため実行時エラーをすり抜ける可能性がある。そこで、tsconfig.jsonで* noImplicitAny: true*を設定することでanyの実行時エラーのすり抜けを防止できる。<br>
  * interfaceによる型の定義
    ```
    export interface IUser extends Document{
     name:string;
     email:string;
     password?:string;//select:falseなので、任意プロパティとして定義する
     comparePassword:(candidatePassword:string)=>Promise<boolean>;//カスタムメソッドの型定義、Promise<boolean>で最終的にtrueかfalseになる非同期処理を返す関数であることを定義する
    }
    ```
    上のコードでは、extends DocumentでMongooseの基本的なプロパティ(_idや.save()メソッド)をIUser型が継承することを示す。
  * ジェネリクスによるスキーマ定義
  *const UserSchema = new Schema<IUser>({...})* の文において、<IUser>でジェネリクスという機能を使っている。ちなみに、IUserという型を付けている。
  * this引数
  アロー関数以外の関数とクラスのメソッドの第一引数にはthisを受け取ることが出来る。<br>
  thisとは自分自身を表すオブジェクトのこと。
    
    * 関数の定義の仕方
    
      * functionキーワードで始まる関数の宣言
      ```
      function add(a, b) {
        return a + b;
      }
      
      console.log(add(2, 3)); // 5
      ```
      
      * アロー関数
 
    
      ```
      const add = (a, b) => {
        return a + b;
      };
      ```
   * interfaceでオブジェクトの型の名前を付けた
        ```
        export interface User{
           _id:string;
           name:string;
           email:string;
        }
        ```
        のように、Userのデータの形を設定した。
   * typeof演算子について
        typeo演算子とは、変数から型を抽出するための演算子のこと。
        ```
         //ストア全体のstateの型をエクスポート
         export type RootState = ReturnType<typeof store.getState>;
         //dispatch関数の型をエクスポート
         export type AppDispatch = typeof store.dispatch;
        
        ```
        この行では、Reduxストアに保存されているすべてのStateの形を一つの型として定義している。<br>
        また、AppDispatchを定義することでuseAppDispatchによって安全な型のdispatch関数を使えるようになる。<br>
        つまり、二つの行によって、安全にストアのstateと、redux toolkitのdispatchを安全に使えるようになる。<br>
        ```
        export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
        ```
        この行のように、useAppSelectorフックスにRootStateを付けることでコンポーネントがストアからデータを取りだす際に型安全性を担保することができる。<br>

   * ユーティリティ型(Omit)
        ```
        Omit<User, '_id' | 'name'>
        ```
        omitは既存の型(User)から指定したプロパティ(_id,name)を取り除いた新しい型を作ることが出来る。<br>
   * createAsyncThunkについて
        Redux ToolkitにおいてAPi通信のような非同期処理を簡単に扱うための機能。<br>
        createAsyncThunkは、API通信の際に発生する3つの状態（待機中、成功、失敗）を自動で管理し、それぞれに対応するアクションを発行してくれる。
        これを使うことで、コンポーネント内でローディング状態やエラー状態を自分で管理する手間が省け、コードが非常にクリーンになる。<br>
        ```
        export const loginUser = createAsyncThunk(
           // 第1引数：アクションの「名前」
           'auth/login', 
         
           // 第2引数：実際に行う非同期処理
           async (userData, { rejectWithValue }) => {
             try {
               const response = await apiClient.post('/users/login', userData);
               return response.data; // 成功したら、この値が fulfilled の payload になる
             } catch (error: any) {
               return rejectWithValue(error.response.data); // 失敗したら、この値が rejected の payload になる
             }
           }
         );
        ```
        このように第一引数にアクションの名前を、第二引数に非同期処理の内容を書く。これらの処理によってAPI通信を行い三種類のアクションを発行する。<br>
        
        次に、extraReducersと連携し、三つの状態をどう変更するかを定義する。
        loginUser関数を参考にすると、
        ```
        //loginuserの状態別処理
          .addCase(loginUser.pending,(state)=>{
            state.status="loading";
          })
          .addCase(loginUser.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.user=action.payload;
          })
          .addCase(loginUser.rejected,(state,action)=>{
            state.status="failed";
            state.error=(action.payload as {message:string}).message;
          })
        ```
        * pending: 通信を開始した時。「待機中」
        * fulfilled: 通信が成功した時。returnされたデータがpayloadに含まれます。
        * rejected: 通信が失敗した時。rejectWithValueで返されたエラーがpayloadに含まれます。
        createAsyncThunkによって、上の三つの状態を管理する必要があるが、これを全てコードで管理するとなるとコードが煩雑になる。
        
      
   * FCコンポーネントについて
      ```
      const App : FC
      ```
     のような記述をした。これは、Appという関数はFC(Function Component)という型をもつことを宣言している。FCをつけることで、Appがreact コンポーネントであることを宣言し、コンポーネントがreactが画面に正しく画面に表示できるもの(jsxやnull          など)を返しているかをtypescriptがチェックしている。<br>

   * chiledren、ReactNodeとは
     childrenとはコンポーネントの中身で、ReactNodeはその中身の型のこと。childrenプロパティのために用意した柔軟な型のことでReactが画面に表示できるすべてを表現できる。childrenプロパティの型をReactNodeにすることでタイプスクリプトに対してReactが表現できるものなら何でも入ることを宣言する。
