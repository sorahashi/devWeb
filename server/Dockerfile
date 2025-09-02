FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# Prismaスキーマをコピー
COPY prisma ./prisma/

# Prismaクライアントを生成
RUN npx prisma generate

# ソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]
