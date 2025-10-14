# E4 実機テスト実施ガイド - iOS/Android

## 🎯 テスト目的
LINE導線の可用性100%を担保し、計測パラメータの正確な付与・記録を確認する。

## 📋 事前準備

### 必要なもの
- [ ] iOS端末（iPhone、iOS 15.0以上）
- [ ] Android端末（Pixel/Galaxyなど、Android 10以上）
- [ ] LINEアプリ（両端末にインストール済み）
- [ ] 安定したインターネット接続（Wi-Fi推奨）

### テスト環境URL
- **ローカル**: `http://localhost:5500/index.html` (Live Server)
- **ステージング**: `https://azvelia-staging.vercel.app`
- **本番**: `https://azvelia.vercel.app`

## 🧪 テストシナリオ

### シナリオ1: ヒーローCTA（メインCTA）

#### iOS実機
```
ステップ1: Safariでページを開く
ステップ2: 「LINEで注文する」ボタンを確認
ステップ3: ボタンをタップ
期待結果: 
  ✅ LINEアプリが自動起動
  ✅ AZVELIA公式アカウント画面に遷移
  ✅ 遷移がスムーズ（3秒以内）
```

#### Android実機
```
ステップ1: Chromeでページを開く
ステップ2: 「LINEで注文する」ボタンを確認
ステップ3: ボタンをタップ
期待結果:
  ✅ LINEアプリが自動起動
  ✅ AZVELIA公式アカウント画面に遷移
  ✅ 遷移がスムーズ（3秒以内）
```

#### 計測パラメータ確認
```javascript
// ブラウザのコンソールで実行
showTrackingLogs()

// 確認項目
{
  event: "line_cta_click",
  params: {
    location: "hero",
    url: "https://line.me/R/ti/p/@azvelia?utm_source=azvelia_lp&utm_medium=web&utm_campaign=order_2025_q4&utm_content=hero&timestamp=...",
    device_type: "mobile" // または "desktop"
  }
}
```

### シナリオ2: QRコード表示・読み取り

#### QRコード表示（iOS/Android共通）
```
ステップ1: 「QRコードを表示」ボタンをタップ
期待結果:
  ✅ モーダルがアニメーション表示
  ✅ QRコード画像が読み込まれる
  ✅ 背景スクロールが無効化
  ✅ 「LINEで開く」ボタンが表示
```

#### QRコード読み取り（別端末使用）
```
ステップ1: 別のスマホでQRコードをスキャン
期待結果:
  ✅ QRコードが正しく読み取れる
  ✅ LINEアプリが起動
  ✅ AZVELIA公式アカウント画面に遷移
```

#### モーダル内CTA
```
ステップ1: QRモーダル内の「LINEで開く」ボタンをタップ
期待結果:
  ✅ LINEアプリが起動
  ✅ 公式アカウント画面に遷移
```

#### 計測パラメータ確認
```javascript
showTrackingLogs()

// QRモーダル表示時
{
  event: "qr_modal_open",
  params: {
    qr_url: "https://line.me/R/ti/p/@azvelia?..."
  }
}

// QRモーダル内CTA
{
  event: "line_cta_click",
  params: {
    location: "qr-modal",
    ...
  }
}
```

### シナリオ3: 追従CTA（スティッキーCTA）

#### iOS/Android共通
```
ステップ1: ページを500px以上スクロール
期待結果:
  ✅ 画面下部に追従CTAがスライドイン表示
  ✅ 固定配置で追従
  ✅ CTA表示がスムーズ

ステップ2: 追従CTAをタップ
期待結果:
  ✅ LINEアプリが起動
  ✅ 公式アカウント画面に遷移
```

#### 計測パラメータ確認
```javascript
showTrackingLogs()

// 追従CTA表示時
{
  event: "sticky_cta_show",
  params: {
    scroll_position: 567 // 実際のスクロール位置
  }
}

// 追従CTAクリック時
{
  event: "line_cta_click",
  params: {
    location: "sticky",
    ...
  }
}
```

### シナリオ4: エラーハンドリング

#### LINEアプリ未インストール（シミュレーション）
```
テスト方法: LINEアプリを一時的にアンインストールまたは無効化

ステップ1: CTAをタップ
期待結果:
  ✅ 3秒待機
  ✅ エラーアラートが表示
  ✅ 代替導線の案内が表示
  ✅ エラーイベントが記録される

アラートメッセージ:
「LINEアプリを開けませんでした。

LINEアプリがインストールされているか確認してください。
または、ブラウザで「AZVELIA」を検索してLINE公式アカウントを追加してください。」
```

#### 計測パラメータ確認
```javascript
showTrackingLogs()

{
  event: "line_cta_error",
  params: {
    location: "hero", // または "qr-modal" / "sticky"
    error_type: "navigation_failed"
  }
}
```

## 📊 計測パラメータ検証

### 完全なURLフォーマット確認
```
https://line.me/R/ti/p/@azvelia
  ?utm_source=azvelia_lp
  &utm_medium=web
  &utm_campaign=order_2025_q4
  &utm_content=[hero|qr-modal|sticky]
  &timestamp=[UNIX_TIMESTAMP]
  &ref=[hero|qr-modal|sticky]
```

### localStorage確認
```javascript
// トラッキングログ取得
const logs = JSON.parse(localStorage.getItem('azvelia_tracking_logs') || '[]');
console.table(logs);

// 最新50件が保存されているか確認
console.log(`Total logs: ${logs.length}`);
```

### デバッグコマンド一覧
```javascript
// 1. トラッキングログ表示
showTrackingLogs()

// 2. トラッキングログクリア
clearTrackingLogs()

// 3. テスト用LINE URL生成
testLineUrl('test')

// 4. 現在の設定確認
console.log(CONFIG)
```

## ✅ テストチェックリスト

### iOS実機テスト（Safari）
```
デバイス情報:
  機種: ________________
  OS: iOS ______________
  ブラウザ: Safari ______

[ ] TC-01: ヒーローCTA → LINE遷移
[ ] TC-02: QRコード表示
[ ] TC-03: QRモーダル内CTA → LINE遷移
[ ] TC-04: QRコード読み取り（別端末）
[ ] TC-05: 追従CTA表示（500pxスクロール）
[ ] TC-06: 追従CTA → LINE遷移
[ ] TC-07: モーダル閉じる（×ボタン）
[ ] TC-08: モーダル閉じる（背景タップ）
[ ] TC-09: モーダル閉じる（ESCキー）
[ ] TC-10: エラーハンドリング確認
[ ] TC-11: 計測パラメータ記録確認

スクリーンショット:
[ ] 初期表示
[ ] QRモーダル
[ ] 追従CTA
[ ] LINE遷移成功
[ ] トラッキングログ
```

### Android実機テスト（Chrome）
```
デバイス情報:
  機種: ________________
  OS: Android __________
  ブラウザ: Chrome ______

[ ] TC-01: ヒーローCTA → LINE遷移
[ ] TC-02: QRコード表示
[ ] TC-03: QRモーダル内CTA → LINE遷移
[ ] TC-04: QRコード読み取り（別端末）
[ ] TC-05: 追従CTA表示（500pxスクロール）
[ ] TC-06: 追従CTA → LINE遷移
[ ] TC-07: モーダル閉じる（×ボタン）
[ ] TC-08: モーダル閉じる（背景タップ）
[ ] TC-09: モーダル閉じる（ESCキー）
[ ] TC-10: エラーハンドリング確認
[ ] TC-11: 計測パラメータ記録確認

スクリーンショット:
[ ] 初期表示
[ ] QRモーダル
[ ] 追従CTA
[ ] LINE遷移成功
[ ] トラッキングログ
```

## 📸 証跡保存

### スクリーンショット
各OSで以下のスクリーンショットを保存:
1. `01_hero_cta.png` - ヒーローCTA表示
2. `02_qr_modal.png` - QRモーダル表示
3. `03_sticky_cta.png` - 追従CTA表示
4. `04_line_success.png` - LINE遷移成功
5. `05_tracking_logs.png` - トラッキングログ

### ログCSVエクスポート
```javascript
// トラッキングログをCSVでエクスポート
function exportTrackingLogsCSV() {
  const logs = JSON.parse(localStorage.getItem('azvelia_tracking_logs') || '[]');
  const csv = [
    ['Timestamp', 'Event', 'Location', 'Device Type', 'URL'],
    ...logs.map(log => [
      log.timestamp,
      log.event,
      log.params?.location || '-',
      log.params?.device_type || '-',
      log.params?.url || '-'
    ])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `azvelia_tracking_${Date.now()}.csv`;
  a.click();
}

// 実行
exportTrackingLogsCSV();
```

## 🎓 トラブルシューティング

### 問題: LINEアプリが起動しない
**原因候補**:
- LINEアプリ未インストール
- LINE URLが間違っている
- ブラウザのポップアップブロック

**解決方法**:
1. LINEアプリのインストール確認
2. `main.js`の`CONFIG.lineUrl`確認
3. ブラウザ設定でポップアップ許可

### 問題: QRコードが表示されない
**原因候補**:
- ネットワーク接続エラー
- Google Chart API障害

**解決方法**:
1. ネットワーク接続確認
2. コンソールでエラー確認
3. フォールバック画像表示を確認

### 問題: 計測されない
**原因候補**:
- ブラウザのプライベートモード
- localStorage無効化

**解決方法**:
1. 通常モードでテスト
2. ブラウザ設定でlocalStorage有効化確認

### 問題: 追従CTAが表示されない
**原因候補**:
- スクロール量不足（<500px）
- CSS/JS読み込みエラー

**解決方法**:
1. 500px以上スクロール
2. コンソールでエラー確認

## 📝 テスト結果レポート

### テスト実施情報
```
テスト日時: 2025-10-14 __:__
テスター: _______________
環境: [ ] ローカル [ ] ステージング [ ] 本番
```

### iOS実機テスト結果
```
総合評価: [ ] Pass [ ] Fail
遷移成功率: ____ / 11 ケース (___%)
不具合件数: ____ 件

詳細:
________________________________________________
________________________________________________
________________________________________________
```

### Android実機テスト結果
```
総合評価: [ ] Pass [ ] Fail
遷移成功率: ____ / 11 ケース (___%)
不具合件数: ____ 件

詳細:
________________________________________________
________________________________________________
________________________________________________
```

### DoD達成確認
```
[ ] 実機2OS（iOS/Android）で遷移100%成功
[ ] 計測パラメータが正しく付与・記録される
[ ] エラー時の代替導線が機能する
[ ] 証跡（スクリーンショット・ログ）保存完了
```

### 次のアクション
```
[ ] E1（Architect）にレビュー依頼
[ ] 不具合があればIssue作成
[ ] 本番デプロイ承認申請
[ ] GA4計測との連携確認（E3と協力）
```

---

**作成日**: 2025-10-14  
**担当**: E4 (Integrations Engineer)  
**バージョン**: 1.0

