# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**論文まとめフォーマット**は、落合陽一式の6つの質問フォーマットで論文をまとめ、SNS投稿用の画像として出力・共有できるWebアプリケーションです。

**現在の状況**: 企画・設計フェーズ - 実装ファイルはまだ存在しません

## 開発コマンド

静的Webアプリケーションのため、シンプルなローカルサーバーを使用します：

```bash
# ローカル開発サーバーの選択肢
python -m http.server 8000    # Python 3
npx serve                     # Node.js（利用可能な場合）

# ブラウザで開く
http://localhost:8000
```

## 予定アーキテクチャ

### 技術スタック
- **フロントエンド**: Vanilla HTML5/CSS3/JavaScript（フレームワークなし）
- **画像生成**: html2canvas ライブラリでHTMLを画像に変換
- **バックエンド**: Firebase Firestore（NoSQLデータベース）+ Firebase Storage（画像保存）
- **ホスティング**: GitHub Pages（静的サイトホスティング）

### ファイル構成（実装予定）
```
research-summary-format/
├── index.html          # メイン作成ページ
├── gallery.html        # ギャラリー閲覧ページ
├── css/
│   └── style.css       # メインスタイルシート
├── js/
│   ├── app.js          # メインアプリケーションロジック
│   ├── firebase.js     # Firebase設定
│   └── gallery.js      # ギャラリー機能
├── assets/
│   └── images/         # 静的画像アセット
```

## 核となる機能（予定）

### 落合陽一式6つの質問フォーマット
1. どんなもの？
2. 先行研究と比べてどこがすごいの？
3. 技術や手法の"キモ"はどこにある？
4. どうやって有効だと検証した？
5. 議論はあるか？
6. 次に読むべき論文はあるか？

### 画像生成要件
- 複数解像度対応: Instagram正方形（1080x1080）、Twitter横長（1920x1080）、Instagram縦長（1080x1920）
- 入力内容のリアルタイムプレビュー
- 図表画像のコピー&ペースト対応
- ダウンロード・クリップボードコピー機能

### データベーススキーマ（Firebase Firestore）
コレクション: `papers`
```javascript
{
  title: string,              // 最大50文字
  author: string,             // 最大100文字
  year: number,
  categories: string[],       // 最大5個、各20文字
  questions: {
    question1: { label: string, content: string }, // 回答は最大300文字
    // ... question2-6も同様の構造
  },
  imageUrl: string,           // Firebase Storage URL
  thumbnailUrl: string,       // Firebase Storage URL
  createdAt: Timestamp,
  views: number,
  resolution: string
}
```

## 開発フェーズ

1. **Phase 1（優先）**: フロントエンド基盤構築 - 入力フォーム、リアルタイムプレビュー、localStorage
2. **Phase 2**: html2canvasによる画像生成・ダウンロード機能
3. **Phase 3**: Firebaseとの統合でデータ永続化
4. **Phase 4**: 共有サマリー閲覧用ギャラリー機能
5. **Phase 5**: 検索・フィルタリング機能

## 重要な制約

### 文字数制限
- タイトル: 50文字
- 著者名: 100文字
- 各質問の回答: 300文字
- カテゴリ: 各20文字、最大5個

### デザイン要件
- 6つの質問用のシンプルなカード型レイアウト
- クリーンな白背景に黒文字
- 青系のアクセントカラー
- PC・タブレット対応レスポンシブデザイン（投稿はPC推奨）
- サマリー上部に画像アップロード領域

### パフォーマンス目標
- ページ読み込み: 3秒以内
- リアルタイムプレビュー: 遅延なし
- 画像生成: 5秒以内

## Firebase設定（Phase 3以降）

Firebase統合実装時は `js/firebase.js` に設定：
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

## セキュリティ考慮事項
- XSS防止のための入力サニタイズ
- Firebase Security Rules設定
- 画像サイズ制限（最大5MB）
- スパム防止（将来的にreCAPTCHA導入）

## リポジトリ情報
- メインブランチ: `main`
- GitHub Pages デプロイ先: https://wwlapaki310.github.io/research-summary-format/
- 課題管理: GitHub Issues を使用
- 言語: ドキュメント・UIともに日本語