# Voice Chat App

シンプルで使いやすい音声チャットアプリケーション。見ず知らずの人と偶然つながって会話ができます。

## 特徴

- **匿名音声チャット**: 顔出しなしで気軽に参加できる
- **ランダムマッチング**: 見ず知らずの人と偶然つながる
- **趣味ベースのマッチング**: 共通の話題を持つ人と出会える
- **シンプルなUI/UX**: 直感的で使いやすいインターフェース
- **カスタマイズ可能なテーマ**: 好みに合わせて見た目を変更できる
- **テキストチャット**: 音声と併用できるテキストコミュニケーション

## デモ

アプリのデモは[こちら](https://あなたのユーザー名.github.io/voice-chat-app/)でご覧いただけます。

## 使い方

1. ウェブサイトにアクセスします
2. 「ランダムでつながる」または「趣味でつながる」を選択します
3. マッチングを待ちます
4. 接続が確立されたら、会話を楽しみましょう！

## インストール方法

### ローカル環境での実行

```bash
# リポジトリをクローン
git clone https://github.com/あなたのユーザー名/voice-chat-app.git
cd voice-chat-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

### GitHub Pagesへのデプロイ

```bash
# GitHub Pagesへのデプロイ
npm run deploy
```

## カスタマイズ方法

### テーマの変更

アプリ内の「テーマ変更」ボタンをクリックすることで、以下のテーマを切り替えることができます：
- デフォルト
- ダーク
- キュート
- ポップ

### 新しいテーマの追加

`js/themes.js`ファイルを編集して、新しいテーマを追加できます：

```javascript
// 新しいテーマの追加例
this.themes['new-theme'] = {
    '--primary-color': '#your-color',
    '--secondary-color': '#your-color',
    // その他のカラー設定
};
```

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **リアルタイム通信**: WebRTC, Socket.IO
- **ホスティング**: GitHub Pages
- **バックエンド**: Netlify Functions / Vercel Serverless Functions

## ライセンス

MIT License

## 貢献方法

1. このリポジトリをフォークします
2. 新しいブランチを作成します (`git checkout -b feature/amazing-feature`)
3. 変更をコミットします (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュします (`git push origin feature/amazing-feature`)
5. Pull Requestを作成します
