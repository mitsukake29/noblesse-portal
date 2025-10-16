# 🏆 Noblesse Member Portal

高級感あふれるノブレス会員向けポータルサイト（PoC）

## 📋 概要

このプロジェクトは、以下の2つの画面を持つWebアプリケーションです：

### 🔒 管理画面（事業者向け）
- 女性会員の登録・編集・削除
- 写真アップロード時の自動顔検出＆ぼかし処理
- 元画像とぼかし画像の両方を管理

### 🌐 会員サイト（ノブレス会員向け）
- ログイン認証
- 会員マイページ（プロフィール、保有特典表示）
- 女性会員一覧・詳細ページ（ぼかし画像のみ表示）
- ラグジュアリーなUI/UX（黒×ゴールド）

## 🚀 技術スタック

- **フロントエンド**: React 18 + Vite + Material-UI
- **バックエンド**: Node.js + Express
- **画像処理**: Sharp + face-api.js
- **認証**: JWT（簡易実装）
- **デザイン**: Material-UI カスタムテーマ（Luxury Black × Gold）

## ⚙️ セットアップ

### 1. 依存関係のインストール

```bash
# すべての依存関係を一括インストール
npm run install-all
```

### 2. 環境変数の設定

`backend/.env` ファイルは既に作成済みです。必要に応じて編集してください。

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. アプリケーションの起動

```bash
# フロントエンドとバックエンドを同時起動
npm run dev
```

- **バックエンド**: http://localhost:5000
- **フロントエンド**: http://localhost:3000

## 🔑 ログイン情報

### 会員ログイン
- **URL**: http://localhost:3000/login
- **Email**: member@noblesse.com
- **Password**: noblesse123

### 管理者ログイン
- **URL**: http://localhost:3000/admin/login
- **Username**: admin
- **Password**: admin123

## 📂 フォルダ構成

```
claude-poc/
├── backend/              # Express バックエンド
│   ├── server.js
│   ├── routes/          # API ルート
│   ├── utils/           # 顔検出ロジック
│   └── uploads/         # 画像保存先
│       ├── original/    # 元画像
│       └── blurred/     # ぼかし済画像
├── frontend/            # React フロントエンド
│   ├── src/
│   │   ├── components/  # 再利用可能コンポーネント
│   │   ├── pages/       # ページコンポーネント
│   │   └── context/     # React Context
│   └── index.html
└── package.json
```

## 🎨 デザインテーマ

### カラーパレット
- **プライマリゴールド**: #d4af37
- **ライトゴールド**: #f0c861
- **ダークバックグラウンド**: #0a0a0a
- **ペーパーバックグラウンド**: #1a1a1a
- **テキスト（明）**: #f5f5f5

### フォント
- **見出し**: Playfair Display
- **本文**: Noto Serif JP

## 🖼️ 画像処理の仕組み

1. 管理者が写真をアップロード
2. バックエンドが `face-api.js` で顔検出
3. 検出された顔部分にぼかし処理を適用
4. 元画像: `uploads/original/` に保存
5. ぼかし画像: `uploads/blurred/` に保存
6. 会員サイトでは `blurred/` の画像のみ表示

## 📝 主な機能

### 管理画面
- ✅ 管理者認証
- ✅ 女性会員の一覧表示
- ✅ 新規登録フォーム
- ✅ 編集・削除機能
- ✅ 写真アップロード＆自動顔ぼかし
- ✅ 元画像とぼかし画像の両方を確認可能

### 会員ポータル
- ✅ 会員認証
- ✅ マイページ（プロフィール、特典表示）
- ✅ 女性会員一覧（カード型表示）
- ✅ 女性会員詳細ページ
- ✅ 高級感のあるUI/UX

## 🔧 開発コマンド

```bash
# 開発サーバー起動（フロント＋バック同時）
npm run dev

# バックエンドのみ起動
npm run dev:backend

# フロントエンドのみ起動
npm run dev:frontend

# プロダクションビルド
npm run build
```

## ⚠️ 注意事項

- これはPoC（概念実証）版です
- データは **メモリ内** に保存されます（再起動で消失）
- 本番環境では適切なデータベースと認証システムを使用してください
- 顔検出モデルが必要な場合は別途ダウンロードが必要です

## 📦 顔検出モデルのセットアップ（オプション）

完全な顔検出機能を利用する場合、以下のモデルファイルを `backend/models/` に配置してください：
- `@vladmandic/face-api` の ssdMobilenetv1 モデル

モデルがない場合は、フォールバック処理として元画像がそのまま使用されます。

## 📄 ライセンス

このプロジェクトはPoCのためのものです。

---

## 🎯 今後の拡張案

- データベース連携（MongoDB, PostgreSQL等）
- より強力な認証システム（OAuth, 2FA等）
- リアルタイム通知機能
- メッセージング機能
- 決済システム連携
- モバイルアプリ対応

---

**Noblesse Oblige - 高貴なる者の義務**
