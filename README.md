# Todo管理アプリケーション

## 概要

これは、ユーザー認証機能とTodoリストのCRUD機能を備えた、フルスタックのWebアプリケーションです。Node.js、React、TypeScript、Dockerを使用して構築されています。



---

## 主な機能

* **ユーザー認証**: 新規登録、ログイン、ログアウト機能。Cookieセッションによる状態管理。
* **Todoリスト管理**:
    * タスクの追加、更新（完了/未完了）、削除 (CRUD)
    * タスクの詳細、優先度、期日の設定
    * 優先度ごとのグループ表示
* **ルート保護**: ログインしていないユーザーはTodoリストにアクセス不可。
* **レスポンシブデザイン**: PC、スマホのどちらでも見やすいレイアウト。

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
    * Docker / Docker Compose (コンテナ仮想化)

---

## セットアップと起動方法

1.  このリポジトリをクローンします。
    ```bash
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
    ```bash
    docker-compose up --build
    ```

4.  アプリケーションにアクセスします。
    ブラウザで `http://localhost:5173` を開いてください。

---

##  今後の展望

