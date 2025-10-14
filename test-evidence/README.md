# 実機テスト証跡保存ディレクトリ

## 📁 ディレクトリ構造

```
test-evidence/
├── ios/
│   ├── screenshots/          # iOSスクリーンショット
│   │   ├── 01_hero_cta.png
│   │   ├── 02_qr_modal.png
│   │   ├── 03_sticky_cta.png
│   │   ├── 04_line_success.png
│   │   └── 05_tracking_logs.png
│   └── logs/                 # iOSトラッキングログ
│       └── tracking_logs.json
├── android/
│   ├── screenshots/          # Androidスクリーンショット
│   │   ├── 01_hero_cta.png
│   │   ├── 02_qr_modal.png
│   │   ├── 03_sticky_cta.png
│   │   ├── 04_line_success.png
│   │   └── 05_tracking_logs.png
│   └── logs/                 # Androidトラッキングログ
│       └── tracking_logs.json
├── test-report.md            # テスト結果レポート
└── README.md                 # 本ファイル
```

## 📸 スクリーンショット命名規則

### iOS
- `01_hero_cta.png` - ヒーローセクションCTA表示
- `02_qr_modal.png` - QRコードモーダル表示
- `03_sticky_cta.png` - 追従CTA表示（500px以上スクロール後）
- `04_line_success.png` - LINE遷移成功画面
- `05_tracking_logs.png` - トラッキングログ（コンソール）

### Android
- `01_hero_cta.png` - ヒーローセクションCTA表示
- `02_qr_modal.png` - QRコードモーダル表示
- `03_sticky_cta.png` - 追従CTA表示（500px以上スクロール後）
- `04_line_success.png` - LINE遷移成功画面
- `05_tracking_logs.png` - トラッキングログ（コンソール）

## 📊 ログファイル形式

### tracking_logs.json
```json
[
  {
    "timestamp": "2025-10-14T12:34:56.789Z",
    "event": "page_view",
    "params": {
      "page_title": "AZVELIA LP",
      "page_location": "https://azvelia.vercel.app",
      "user_agent": "Mozilla/5.0..."
    }
  },
  {
    "timestamp": "2025-10-14T12:35:12.345Z",
    "event": "line_cta_click",
    "params": {
      "location": "hero",
      "url": "https://line.me/R/ti/p/@azvelia?utm_source=...",
      "device_type": "mobile"
    }
  }
]
```

## 🧪 テスト実施手順

### 1. iOS実機テスト
```bash
# 1. iOS端末でテストページにアクセス
# 2. Safariで開発者ツールを有効化
# 3. チェックリストに沿ってテスト実施
# 4. スクリーンショットを撮影
# 5. このディレクトリに保存: test-evidence/ios/screenshots/
```

### 2. Android実機テスト
```bash
# 1. Android端末でテストページにアクセス
# 2. Chromeで開発者ツールを有効化
# 3. チェックリストに沿ってテスト実施
# 4. スクリーンショットを撮影
# 5. このディレクトリに保存: test-evidence/android/screenshots/
```

### 3. ログ取得
```javascript
// ブラウザコンソールで実行
const logs = JSON.parse(localStorage.getItem('azvelia_tracking_logs') || '[]');
console.log(JSON.stringify(logs, null, 2));

// コピーして以下に保存:
// iOS: test-evidence/ios/logs/tracking_logs.json
// Android: test-evidence/android/logs/tracking_logs.json
```

## 📝 テスト結果レポート作成

テスト完了後、`test-report.md` を作成してください。

テンプレートは `実機テスト_簡易チェックリスト.md` を参照。

## 🚀 提出方法

1. 全ての証跡ファイルを保存
2. `test-report.md` を作成
3. E1（Architect）にレビュー依頼
4. 必要に応じてGitにコミット（スクリーンショットは除外可）

---

**作成日**: 2025-10-14  
**担当**: E4 (Integrations Engineer)

