# ✨ 超かわいいWebApp ✨

Node.js(Fastify) + Svelte + SvelteKit + MySQL + TailwindCSSで構築されたモダンなWebアプリケーションです！

## 🚀 技術スタック

- **サーバーサイド**: Node.js + Fastify
- **クライアントサイド**: Svelte + SvelteKit + TailwindCSS
- **データベース**: MySQL 8.0
- **コンテナ化**: Docker + Docker Compose
- **スタイリング**: TailwindCSS + カスタムCSS

## 📁 プロジェクト構造

```
.
├── docker-compose.yml          # Docker環境の設定
├── mysql/                      # MySQL関連ファイル
│   └── init/                   # 初期化スクリプト
│       └── 01-init.sql        # データベース初期化
├── server/                     # サーバーサイド (Fastify)
│   ├── Dockerfile             # サーバー用Dockerfile
│   ├── package.json           # サーバー依存関係
│   └── src/                   # サーバーソースコード
│       └── index.js           # メインサーバーファイル
├── client/                     # クライアントサイド (Svelte)
│   ├── Dockerfile             # クライアント用Dockerfile
│   ├── package.json           # クライアント依存関係
│   ├── svelte.config.js       # SvelteKit設定
│   ├── vite.config.js         # Vite設定
│   ├── tsconfig.json          # TypeScript設定
│   ├── tailwind.config.js     # TailwindCSS設定
│   ├── postcss.config.js      # PostCSS設定
│   ├── src/                   # クライアントソースコード
│   │   ├── app.css            # TailwindCSS + カスタムスタイル
│   │   ├── routes/            # SvelteKitルート
│   │   │   ├── +layout.svelte # レイアウトファイル
│   │   │   └── +page.svelte   # メインページ
│   │   └── app.html           # HTMLテンプレート
│   └── README.md               # このファイル
```

## 🛠️ セットアップ手順

### 1. 前提条件
- Docker と Docker Compose がインストールされていること
- ポート 3000, 3306, 5173 が利用可能であること

### 2. 環境の起動
```bash
# Docker環境を起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

### 3. アクセス
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:3000
- **MySQL**: localhost:3306

## 🔧 開発コマンド

### サーバーサイド
```bash
# サーバーコンテナに入る
docker exec -it webapp_server sh

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### クライアントサイド
```bash
# クライアントコンテナに入る
docker exec -it webapp_client sh

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## 🎨 TailwindCSS の特徴

- **ユーティリティファースト**: 高速なスタイリング
- **レスポンシブデザイン**: モバイルファーストのアプローチ
- **カスタムカラーパレット**: ピンク系の可愛いカラーテーマ
- **アニメーション**: ホバーエフェクトとトランジション
- **カスタムコンポーネント**: 再利用可能なスタイルクラス

### カスタムコンポーネント例
```css
.btn-primary    /* プライマリボタンスタイル */
.card          /* カードコンポーネント */
.input-field   /* 入力フィールドスタイル */
.form-section  /* フォームセクション */
.user-card     /* ユーザーカード */
```

## 📊 API エンドポイント

### ヘルスチェック
- `GET /health` - サーバーとデータベースの状態確認

### ユーザー管理
- `GET /api/users` - ユーザー一覧取得
- `POST /api/users` - 新規ユーザー作成

## 🎨 機能

- ✨ 超かわいいピンク系のデザイン（TailwindCSS使用）
- 👥 ユーザー管理（作成・一覧表示）
- 📱 完全レスポンシブデザイン
- 🔄 リアルタイムデータ更新
- 💾 MySQLデータベース連携
- 🎭 スムーズなアニメーションとトランジション
- 🎨 カスタムカラーパレットとグラデーション

## 🐛 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**
   ```bash
   # 使用中のポートを確認
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5173
   netstat -tulpn | grep :3306
   ```

2. **データベース接続エラー**
   ```bash
   # MySQLコンテナの状態確認
   docker-compose ps mysql
   docker-compose logs mysql
   ```

3. **TailwindCSSが適用されない**
   ```bash
   # クライアントコンテナで依存関係を再インストール
   docker exec -it webapp_client sh
   npm install
   npm run dev
   ```

4. **依存関係のインストールエラー**
   ```bash
   # コンテナを再ビルド
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 🚀 本番環境への展開

本番環境では以下の点を考慮してください：

- 環境変数の適切な設定
- データベースのバックアップ設定
- HTTPSの有効化
- ログローテーションの設定
- セキュリティヘッダーの強化
- TailwindCSSの本番ビルド最適化

## 📝 ライセンス

MIT License

## 💕 貢献

プルリクエストやイシューの報告を歓迎します！

---

**Happy Coding with TailwindCSS! 💖✨**
