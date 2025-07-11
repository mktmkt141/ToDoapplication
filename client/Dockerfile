# --- ステージ1: ビルド環境 ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# --- ステージ2: 本番環境 ---
FROM nginx:stable-alpine

# ビルドステージから完成品（distフォルダの中身）だけをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginxは80番ポートで動く
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]

