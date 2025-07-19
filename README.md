# タスク管理アプリケーション

## 概要

これは、ユーザー認証機能とTodoリストのCRUD機能を備えた、フルスタックのWebアプリケーションです。Node.js、React、TypeScript、Dockerを使用して作っています。



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

* vite・・・以前にcreate react appのビルドツールを採用した開発の経験があったため違うビルドツールを採用しました。<br>
* cookieによる認証・・・本アプリケーションでは、ユーザー認証にhttpOnly属性を持つCookieを利用したセッション管理方式を採用しました。以前の開発ではJWTをlocalStorageに保存する方式を採用しましたが、今回はセキュリティとシンプルさを重視し、以下の理由からCookieセッション方式を選択しました。
  


1. セキュリティの向上 (XSS対策):
httpOnly属性を付けたCookieは、ブラウザのJavaScriptからアクセスすることができません。これにより、もしアプリケーションにXSS（クロスサイトスクリプティング）の脆弱性が存在した場合でも、攻撃者がセッション情報を盗み出してユーザーになりすますことを防ぎます。
JWTをlocalStorageに保存する場合、JavaScriptから完全にアクセス可能であるため、XSS攻撃によってトークンが盗まれるリスクが常に伴います。今回は、このリスクを根本的に排除することを優先しました。<br>

* **httpOnly属性**
サーバがブラウザにcookie送信する際に設定できる重要なセキュリティオプションのこと。この設定によって、ブラウザのjavascriptからアクセスできなくなる。
* **XSS攻撃**
    * 目的:ユーザーのブラウザ上で悪意のあるスクリプトを実行させて、ユーザーの個人情報やCookieを盗むこと。
    * 手口:脆弱性のあるサイトの掲示板などに罠となるスクリプトを書き込む。
    * 攻撃の主体：サイトに埋め込まれたスクリプト
* **CSRF攻撃**
    * 目的:ログイン済みのユーザーを騙して、そのユーザーの意図しない操作をサイトに実行させること。
    * 手口:ユーザーを罠サイトや偽メールに誘導し、そこから本物のサイトへのリクエストを強制的に送信させること。
    * 攻撃の主体:ログイン済みのユーザーのブラウザ



2. 実装のシンプルさと自動化:
一度サーバー側でSet-Cookieヘッダーを発行すれば、以降のAPIリクエストにはブラウザが自動でCookieを添付してくれます。フロントエンド側で、リクエストのたびに手動でAuthorizationヘッダーを追加するような処理が不要になり、クライアントサイドのコードをシンプルに保つことができます。<br>


---
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

このプログラムはJavaScriptからTypeScriptへ移す形で実現しました。このサイトを参考にしました。[こちらのサイトを参考にしました](https://typescriptbook.jp/)<br>
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
このように
