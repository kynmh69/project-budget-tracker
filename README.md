# Project Budget Tracker

プロジェクト予算管理アプリケーション - Go + Echo + Prisma (バックエンド) と Next.js + shadcn/ui (フロントエンド) で構築された包括的な予算管理システム

## 🎯 主要機能

### 1. プロジェクト管理
- 複数プロジェクトの作成・切り替え
- 予算設定と進捗追跡
- プロジェクト期間管理

### 2. エンジニア管理
- チームメンバーの登録（名前、役職、時給）
- エンジニア情報の編集・削除
- 役職別時給管理

### 3. 工数管理
- 予定・実績の工数入力
- 月別での工数管理
- エンジニア別・カテゴリ別の集計
- 予定実績比較と差異分析
- 工数から自動的に人件費を計算

### 4. 収支管理
- その他収入・支出の記録
- カテゴリ別取引管理
- 自動収支計算

### 5. ダッシュボード
- 予算使用率の視覚化
- リアルタイムメトリクス表示
- 予算、収入、人件費、その他支出、収支の統合ビュー

## 🏗️ 技術スタック

### バックエンド
- **Go 1.21+** - メインプログラミング言語
- **Echo v4** - Web フレームワーク
- **Prisma** - ORM およびデータベース管理
- **SQLite** - 開発用データベース（本番環境では PostgreSQL 推奨）

### フロントエンド
- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UI コンポーネントライブラリ
- **Lucide React** - アイコン
- **React Hook Form** - フォーム管理

## 🚀 クイックスタート

### 前提条件
- Go 1.21 以上
- Node.js 18 以上
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone https://github.com/kynmh69/project-budget-tracker.git
cd project-budget-tracker
```

### 2. セットアップ
```bash
# 依存関係のインストールと環境設定
./setup.sh
```

### 3. 開発サーバーの起動
```bash
# バックエンドとフロントエンドを同時に起動
./start-dev.sh
```

### 4. アプリケーションにアクセス
- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8080
- ヘルスチェック: http://localhost:8080/health

### 5. 開発サーバーの停止
```bash
./stop-dev.sh
```

## 📁 プロジェクト構造

```
project-budget-tracker/
├── backend/                 # Go + Echo + Prisma API サーバー
│   ├── handlers/           # API エンドポイントハンドラー
│   ├── models/             # リクエスト/レスポンスモデル
│   ├── db/                 # データベース接続
│   ├── schema.prisma       # Prisma データベーススキーマ
│   ├── go.mod              # Go モジュール定義
│   └── main.go             # エントリーポイント
├── frontend/               # Next.js React アプリケーション
│   ├── src/
│   │   ├── components/     # UI コンポーネント
│   │   │   ├── ui/         # shadcn/ui 基本コンポーネント
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectManager.tsx
│   │   │   ├── EngineerManager.tsx
│   │   │   ├── WorkLogManager.tsx
│   │   │   └── TransactionManager.tsx
│   │   ├── pages/          # Next.js ページ
│   │   ├── types/          # TypeScript 型定義
│   │   ├── lib/            # ユーティリティ関数
│   │   └── styles/         # CSS スタイル
│   ├── package.json        # Node.js 依存関係
│   └── next.config.js      # Next.js 設定
├── setup.sh                # セットアップスクリプト
├── start-dev.sh            # 開発サーバー起動スクリプト
├── stop-dev.sh             # 開発サーバー停止スクリプト
└── README.md               # このファイル
```

## 🔧 手動セットアップ

### バックエンドセットアップ
```bash
cd backend

# 環境ファイルをコピー
cp .env.example .env

# Go 依存関係のインストール
go mod tidy

# Prisma クライアント生成
go run github.com/steebchen/prisma-client-go generate

# データベーススキーマの適用
go run github.com/steebchen/prisma-client-go db push

# サーバー起動
go run main.go
```

### フロントエンドセットアップ
```bash
cd frontend

# 環境ファイルをコピー
cp .env.local.example .env.local

# Node.js 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 📊 データベーススキーマ

### 主要エンティティ
- **Project** - プロジェクト情報（ID、名前、予算、期間）
- **Engineer** - エンジニア情報（ID、名前、役職、時給）
- **WorkLog** - 工数ログ（ID、エンジニアID、プロジェクトID、時間数、日付、作業内容、カテゴリ、種別）
- **Transaction** - 取引記録（ID、プロジェクトID、種別、金額、カテゴリ、日付、説明）

### 関係性
- Project → WorkLog (1:多)
- Project → Transaction (1:多)
- Engineer → WorkLog (1:多)

## 🛡️ API エンドポイント

### プロジェクト管理
- `GET /api/projects` - プロジェクト一覧取得
- `POST /api/projects` - プロジェクト作成
- `GET /api/projects/:id` - プロジェクト詳細取得
- `PUT /api/projects/:id` - プロジェクト更新
- `DELETE /api/projects/:id` - プロジェクト削除

### エンジニア管理
- `GET /api/engineers` - エンジニア一覧取得
- `POST /api/engineers` - エンジニア作成
- `GET /api/engineers/:id` - エンジニア詳細取得
- `PUT /api/engineers/:id` - エンジニア更新
- `DELETE /api/engineers/:id` - エンジニア削除

### 工数管理
- `GET /api/worklogs` - 工数ログ一覧取得
- `POST /api/worklogs` - 工数ログ作成
- `GET /api/worklogs/:id` - 工数ログ詳細取得
- `PUT /api/worklogs/:id` - 工数ログ更新
- `DELETE /api/worklogs/:id` - 工数ログ削除

### 取引管理
- `GET /api/transactions` - 取引一覧取得
- `POST /api/transactions` - 取引作成
- `GET /api/transactions/:id` - 取引詳細取得
- `PUT /api/transactions/:id` - 取引更新
- `DELETE /api/transactions/:id` - 取引削除

### ダッシュボード
- `GET /api/dashboard/:projectId` - プロジェクトメトリクス取得

## 🎨 UI 特徴

- **モダンなデザイン** - shadcn/ui による統一されたデザインシステム
- **レスポンシブ** - モバイルおよびデスクトップ対応
- **リアルタイム更新** - データ変更時の自動更新
- **直感的な操作** - タブナビゲーションと明確なフォーム
- **視覚的フィードバック** - プログレスバーと色分けされたメトリクス

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で配布されています。詳細については [LICENSE](LICENSE) ファイルを参照してください。

## 🔮 今後の機能拡張予定

- [ ] ユーザー認証・認可システム
- [ ] プロジェクトテンプレート機能
- [ ] データエクスポート機能 (Excel, CSV)
- [ ] レポート生成機能
- [ ] チーム管理機能
- [ ] 通知システム
- [ ] モバイルアプリ対応

## 🐛 バグレポート・機能要望

バグを発見した場合や新機能のご要望がある場合は、[Issues](https://github.com/kynmh69/project-budget-tracker/issues) ページから報告してください。
