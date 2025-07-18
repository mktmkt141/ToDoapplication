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
* **タスクの削除**

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
authSlice.ts




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


2. 実装のシンプルさと自動化:
一度サーバー側でSet-Cookieヘッダーを発行すれば、以降のAPIリクエストにはブラウザが自動でCookieを添付してくれます。フロントエンド側で、リクエストのたびに手動でAuthorizationヘッダーを追加するような処理が不要になり、クライアントサイドのコードをシンプルに保つことができます。<br>



