# クイックスタートガイド - E4 Integration

## 🚀 5分でセットアップ

### Step 1: 設定ファイルの作成

```bash
# config.example.js をコピー
cp config.example.js config.js
```

### Step 2: LINE公式アカウントURLの設定

`config.js` を編集:

```javascript
const CONFIG = {
  // ここに実際のLINE公式アカウントURLを設定
  lineUrl: 'https://line.me/R/ti/p/@YOUR_LINE_ID',
  
  // その他の設定はデフォルトのままでOK
};
```

### Step 3: ブラウザで確認

```bash
# ローカルサーバー起動（例：VSCode Live Server）
# または
open index.html
```

### Step 4: 動作確認

1. ✅ 「LINEで注文する」ボタンが表示される
2. ✅ 「QRコードを表示」ボタンが表示される
3. ✅ 500pxスクロール後、追従CTAが表示される

### Step 5: デバッグモード確認

ブラウザ開発者ツールを開き、コンソールで実行:

```javascript
// トラッキングログを表示
showTrackingLogs()

// テスト用LINE URLを確認
testLineUrl('test')
```

## 📱 実機テスト

1. **iOS/Android端末でアクセス**
2. **TESTING_GUIDE.md** を参照してテスト実施
3. トラッキングログをコンソールで確認

## 🔧 トラブルシューティング

### QRコードが表示されない
→ ネットワーク接続を確認（Google Chart API使用）

### LINE遷移しない
→ `config.js` のLINE URLが正しいか確認

### 計測されない
→ ブラウザのプライベートモードを無効化

## 📚 詳細ドキュメント

- **TESTING_GUIDE.md**: 実機テスト手順
- **WEBHOOK_DESIGN.md**: Webhook設計（将来実装）
- **E4_INTEGRATION_SUMMARY.md**: 実装完了サマリー

---

**準備完了！** 実機テストを開始してください 🎉

