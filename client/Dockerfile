FROM node:18-alpine

WORKDIR /app

# 依存ファイルコピーとインストール
COPY package*.json ./
RUN npm install

# ソースコードコピーとビルド
COPY . .
RUN npm run build

# ポート番号（Viteのpreviewはデフォルトで4173）
EXPOSE 4173

# Viteのpreviewサーバーで静的ファイル配信
CMD ["npm", "run", "preview", "--", "--host"]





