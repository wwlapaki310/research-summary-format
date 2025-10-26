# 論文まとめフォーマット / Research Summary Format

落合陽一式の6つの質問フォーマットで論文をまとめ、画像として出力・共有できるWebアプリケーション

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://wwlapaki310.github.io/research-summary-format/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 概要

このプロジェクトは、論文を**落合陽一式の6つの質問フォーマット**でまとめ、SNS投稿やダウンロードに適した画像として出力できるツールです。

### 落合陽一式フォーマットとは？

1. どんなもの？
2. 先行研究と比べてどこがすごいの？
3. 技術や手法の"キモ"はどこにある？
4. どうやって有効だと検証した？
5. 議論はあるか？
6. 次に読むべき論文はあるか？

この6つの質問に答えることで、論文の要点を効率的に整理できます。

---

## ✨ 主な機能

- 📝 **入力フォーム** - 6つの質問形式で論文を要約
- 🖼️ **画像生成** - SNS投稿用の画像を自動生成
- 📥 **ダウンロード** - 3種類の解像度で画像をダウンロード
- 🎨 **カスタマイズ** - 項目名を自由に編集可能
- 📱 **レスポンシブ** - PC・タブレット対応
- 🔍 **検索機能** - タイトル・カテゴリで論文を検索
- 🎭 **ギャラリー** - みんなの投稿を閲覧・共有

---

## 🚀 使い方

### 1. 論文をまとめる
1. タイトル、著者、年度を入力
2. カテゴリ（分野）を追加
3. 6つの質問に回答
4. 図表があればアップロード

### 2. プレビューを確認
- リアルタイムで画像プレビューが表示されます
- 文字数制限を守りながら調整

### 3. 画像を生成・共有
- 解像度を選択（Instagram、Twitter対応）
- ダウンロードまたはクリップボードにコピー
- Firebase に投稿してみんなと共有

---

## 🛠️ 技術スタック

### フロントエンド
- **HTML5/CSS3/JavaScript** - シンプルなVanilla JS構成
- **html2canvas** - HTML要素を画像に変換

### バックエンド
- **Firebase Firestore** - NoSQLデータベース
- **Firebase Storage** - 画像ストレージ

### デプロイ
- **GitHub Pages** - 静的サイトホスティング

---

## 📂 プロジェクト構造

```
research-summary-format/
├── index.html          # 作成ページ
├── gallery.html        # ギャラリーページ
├── css/
│   └── style.css       # スタイル
├── js/
│   ├── app.js          # メインロジック
│   ├── firebase.js     # Firebase設定
│   └── gallery.js      # ギャラリー機能
├── assets/
│   └── images/         # 画像ファイル
├── REQUIREMENTS.md     # 要件定義・設計書
└── README.md           # このファイル
```

---

## 🎯 開発ロードマップ

開発は5つのフェーズに分けて進行します。

### ✅ Phase 1: フロントエンド基盤構築（優先）
- 入力フォーム実装
- リアルタイムプレビュー
- localStorageでデータ保存

### Phase 2: 画像生成・ダウンロード
- html2canvas統合
- 3種類の解像度対応
- ダウンロード機能

### Phase 3: Firebase統合
- Firestore Database設定
- Firebase Storage設定
- 投稿機能実装

### Phase 4: ギャラリー機能
- 投稿一覧表示
- ページネーション
- 詳細表示モーダル

### Phase 5: 検索・フィルタリング
- タイトル検索
- カテゴリフィルタ
- 年度フィルタ

詳細は [Issues](https://github.com/wwlapaki310/research-summary-format/issues) を参照してください。

---

## 🏃 ローカル開発

### 必要なもの
- Webブラウザ（Chrome、Firefox、Safari、Edge）
- テキストエディタ（VS Code推奨）

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/wwlapaki310/research-summary-format.git
cd research-summary-format

# ローカルサーバーを起動（任意）
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx serve

# ブラウザで開く
open http://localhost:8000
```

### Firebase設定（Phase 3以降）

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. Firestore Database と Storage を有効化
3. `js/firebase.js` に設定情報を追加

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

---

## 🤝 コントリビューション

プルリクエスト・Issue報告を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📮 お問い合わせ

質問や提案があれば [Issues](https://github.com/wwlapaki310/research-summary-format/issues) でお知らせください。

---

## 🙏 謝辞

- **落合陽一さん** - 6つの質問フォーマットの考案者
- **Anthropic** - このプロジェクトの開発支援

---

## 📊 開発状況

![Phase 1](https://img.shields.io/badge/Phase%201-In%20Progress-yellow)
![Phase 2](https://img.shields.io/badge/Phase%202-Planned-lightgrey)
![Phase 3](https://img.shields.io/badge/Phase%203-Planned-lightgrey)
![Phase 4](https://img.shields.io/badge/Phase%204-Planned-lightgrey)
![Phase 5](https://img.shields.io/badge/Phase%205-Planned-lightgrey)

最新の進捗は [Projects](https://github.com/wwlapaki310/research-summary-format/projects) をご確認ください。