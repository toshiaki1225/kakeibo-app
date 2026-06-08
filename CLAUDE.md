# kakeibo-app

レシート読み込み家計簿Webアプリ。React（フロントエンド）+ Node.js/Express（バックエンド）で構成。

## 技術スタック

- **React** — UIフレームワーク（Vite でビルド）
- **Chart.js** — グラフ描画（カテゴリ別円グラフ・月別棒グラフ）
- **Node.js / Express** — バックエンドサーバー
- **Anthropic SDK** — Claude API 呼び出し（レシートOCR）
- **localStorage** — クライアントサイドのデータ永続化

## プロジェクト構成

```
kakeibo-app/
├── .env                  # APIキー（Gitに含めない）
├── .gitignore
├── package.json          # ルートスクリプト（server + client 同時起動）
├── server/
│   ├── package.json
│   └── index.js          # Express + Anthropic SDK
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── ReceiptUpload.jsx   # レシート画像アップロード
        │   ├── ExpenseList.jsx     # 支出一覧
        │   ├── CategoryPieChart.jsx # カテゴリ別円グラフ
        │   └── MonthlyBarChart.jsx  # 月別棒グラフ
        └── utils/
            ├── storage.js    # localStorage操作
            └── categories.js # カテゴリ定義
```

## 開発ガイドライン

### コーディング規約
- JavaScriptはES6+構文を使用する（`const`/`let`、アロー関数、テンプレートリテラル等）
- `var`は使用しない
- コメントは日本語で記載する
- Reactコンポーネントは関数コンポーネント + Hooks を使用する

### 命名規則
- 変数・関数名：キャメルケース（例：`totalExpense`、`addRecord`）
- CSSクラス名：ケバブケース（例：`expense-list`、`upload-btn`）
- 定数：アッパースネークケース（例：`STORAGE_KEY`、`MAX_CATEGORIES`）
- Reactコンポーネント：パスカルケース（例：`ExpenseList`、`CategoryPieChart`）

### スタイル
- レスポンシブデザインを前提とする（モバイルファースト）
- CSSカスタムプロパティ（変数）を活用して色・サイズを管理する

## 動作確認

```bash
# ルートディレクトリで実行（サーバー＋クライアント同時起動）
npm run dev

# フロントエンド: http://localhost:5173
# バックエンド: http://localhost:3001
```

## GitHubリポジトリ

https://github.com/toshiaki1225/kakeibo-app

## Git運用ルール

### 基本方針
- **コードを変更するたびに、必ずGitHubへプッシュする**
- 作業単位が小さくても、変更が完了したら都度コミット＆プッシュを行う
- mainブランチに直接プッシュして構わない（個人プロジェクトのため）

### コミット手順
```bash
git add .
git commit -m "変更内容の説明"
git push origin main
```

### コミットメッセージ規約
- 日本語で簡潔に記述する
- 変更の種類をプレフィックスで示す：
  - `feat:` — 新機能追加
  - `fix:` — バグ修正
  - `style:` — スタイル・見た目の変更
  - `refactor:` — リファクタリング
  - `docs:` — ドキュメント更新

例：
```
feat: レシートOCR機能を追加
fix: 月別集計の計算ミスを修正
style: スマートフォン向けレイアウトを調整
```

## 注意事項

- `.env` は `.gitignore` に追加し、APIキーをGitに含めない
- Claude APIは必ずバックエンド（server/index.js）経由で呼び出す
- フロントエンドから直接APIキーを使用しない
- 使用モデル：`claude-haiku-4-5`
