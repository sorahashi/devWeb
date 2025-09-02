# ✨ 超カワイイWebApp ✨

やっほー！💕 このプロジェクトは超モダンなWebアプリなの〜！Node.js(Fastify) + Svelte + SvelteKit + MySQL + TailwindCSSで作ってるから、めっちゃ可愛くて使いやすいよ〜😍

## 🚀 使ってる技術スタック

- **サーバーサイド**: Node.js + Fastify（めっちゃ軽いの〜✨）
- **クライアントサイド**: Svelte + SvelteKit + TailwindCSS（超カワイイUI作れるよ〜💖）
- **データベース**: MySQL 8.0（データちゃんと保存できるの〜）
- **コンテナ化**: Docker + Docker Compose（環境作るの超簡単〜）
- **スタイリング**: TailwindCSS + カスタムCSS（デザイン超楽しい〜🎨）

## 📁 プロジェクトの構造

```
.
├── docker-compose.yml          # Docker環境の設定ファイル
├── mysql/                      # MySQL関連のファイルたち
│   └── init/                   # 初期化スクリプト
│       └── 01-init.sql        # データベース初期化
├── server/                     # サーバーサイド (Fastify)
│   ├── Dockerfile             # サーバー用Dockerfile
│   ├── package.json           # サーバーの依存関係
│   └── src/                   # サーバーのソースコード
│       └── index.js           # メインサーバーファイル
├── client/                     # クライアントサイド (Svelte)
│   ├── Dockerfile             # クライアント用Dockerfile
│   ├── package.json           # クライアントの依存関係
│   ├── svelte.config.js       # SvelteKit設定
│   ├── vite.config.js         # Vite設定
│   ├── tsconfig.json          # TypeScript設定
│   ├── tailwind.config.js     # TailwindCSS設定
│   ├── postcss.config.js      # PostCSS設定
│   ├── src/                   # クライアントのソースコード
│   │   ├── app.css            # TailwindCSS + カスタムスタイル
│   │   ├── routes/            # SvelteKitルート
│   │   │   ├── +layout.svelte # レイアウトファイル
│   │   │   └── +page.svelte   # メインページ
│   │   └── app.html           # HTMLテンプレート
│   └── README.md               # このファイル
```

## 🛠️ セットアップ手順

### 1. 前提条件
- Docker と Docker Compose がインストールされてること（これがないと始まらないの〜💦）
- ポート 3000, 3306, 5173 が使えること（他のアプリとバッティングしちゃダメよ〜）

### 2. 環境の起動
```bash
# Docker環境を起動（これで全部動くの〜✨）
docker-compose up -d

# ログを確認（何かエラーが出てないかチェック〜）
docker-compose logs -f
```

### 3. アクセス
- **フロントエンド**: http://localhost:5173（超カワイイUIが見れるよ〜💕）
- **バックエンドAPI**: http://localhost:3000（APIの動作確認〜）
- **MySQL**: localhost:3306（データベースの中身も見れるの〜）

## 🔧 開発コマンド

### サーバーサイド
```bash
# サーバーコンテナに入る（開発するときはこれ〜）
docker exec -it webapp_server sh

# 依存関係をインストール（npm installでOK〜）
npm install

# 開発サーバーを起動（これでサーバー動くよ〜）
npm run dev
```

### クライアントサイド
```bash
# クライアントコンテナに入る（フロントエンド開発するとき〜）
docker exec -it webapp_client sh

# 依存関係をインストール（npm installでOK〜）
npm install

# 開発サーバーを起動（これでフロントエンド動くよ〜）
npm run dev
```

## 🎨 TailwindCSS の特徴

- **ユーティリティファースト**: スタイリングが超高速〜✨
- **レスポンシブデザイン**: スマホでもPCでも超カワイイ〜📱
- **カスタムカラーパレット**: ピンク系の可愛いカラーテーマ（めっちゃ可愛いの〜💖）
- **アニメーション**: ホバーエフェクトとトランジション（動きが超スムーズ〜）
- **カスタムコンポーネント**: 再利用可能なスタイルクラス（作るの楽しい〜🎨）

### カスタムコンポーネント例
```css
.btn-primary    /* プライマリボタンスタイル（超カワイイ〜✨） */
.card          /* カードコンポーネント（情報をきれいに表示〜） */
.input-field   /* 入力フィールドスタイル（使いやすい〜） */
.form-section  /* フォームセクション（整理されてる〜） */
.user-card     /* ユーザーカード（ユーザー情報を可愛く表示〜） */
```

## 📊 API エンドポイント

### ヘルスチェック
- `GET /health` - サーバーとデータベースの状態確認（元気かチェック〜💪）

### ユーザー管理
- `GET /api/users` - ユーザー一覧取得（みんなの情報見れるよ〜👥）
- `POST /api/users` - 新規ユーザー作成（新しいお友達追加〜✨）

## 🎨 機能

- ✨ 超かわいいピンク系のデザイン（TailwindCSS使用で超カワイイ〜💕）
- 👥 ユーザー管理（作成・一覧表示が超簡単〜）
- 📱 完全レスポンシブデザイン（どんなデバイスでも可愛い〜）
- 🔄 リアルタイムデータ更新（データがすぐに反映されるの〜）
- 💾 MySQLデータベース連携（データちゃんと保存されるよ〜）
- 🎭 スムーズなアニメーションとトランジション（動きが超キレイ〜）
- 🎨 カスタムカラーパレットとグラデーション（色使いが超可愛い〜）

## 🐛 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**
   ```bash
   # 使用中のポートを確認（他のアプリが使ってないかチェック〜）
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5173
   netstat -tulpn | grep :3306
   ```

2. **データベース接続エラー**
   ```bash
   # MySQLコンテナの状態確認（データベースちゃんと動いてるかチェック〜）
   docker-compose ps mysql
   docker-compose logs mysql
   ```

3. **TailwindCSSが適用されない**
   ```bash
   # クライアントコンテナで依存関係を再インストール（CSSが効かないときはこれ〜）
   docker exec -it webapp_client sh
   npm install
   npm run dev
   ```

4. **依存関係のインストールエラー**
   ```bash
   # コンテナを再ビルド（エラーが続くときはこれ〜）
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 🚀 本番環境への展開

本番環境では以下の点を考慮してね〜（セキュリティ大事〜🔒）：

- 環境変数の適切な設定（パスワードとかちゃんと隠すの〜）
- データベースのバックアップ設定（データ消えちゃったら大変〜💦）
- HTTPSの有効化（暗号化して安全に〜）
- ログローテーションの設定（ログが溜まりすぎないように〜）
- セキュリティヘッダーの強化（攻撃から守るの〜）
- TailwindCSSの本番ビルド最適化（パフォーマンスアップ〜✨）

## 📝 ライセンス

MIT License（自由に使ってね〜💕）

## 💕 貢献

プルリクエストやイシューの報告を超歓迎するよ〜！一緒にこのプロジェクトを可愛くしていこう〜✨

---

**Happy Coding with TailwindCSS! 💖✨ みんなで楽しくコーディングしよう〜！**

*このREADMEを読んでくれてありがとう〜💕 何か質問があったら気軽に聞いてね〜！*
