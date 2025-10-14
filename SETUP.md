# 源LP - セットアップガイド

## 目次
1. [必須要件](#必須要件)
2. [環境変数設定](#環境変数設定)
3. [GA4設定](#ga4設定)
4. [ビルド・デプロイ](#ビルドデプロイ)
5. [検証方法](#検証方法)

---

## 1. 必須要件

### システム要件
- Node.js 18.x以上
- npm 9.x以上

### 推奨ツール
- VS Code（エディタ）
- Google Chrome（開発・検証用）
- Google Chrome DevTools
- Lighthouse CI

---

## 2. 環境変数設定

### 2.1 環境変数ファイルの作成

1. `.env.example`をコピーして`.env`を作成

```bash
cp .env.example .env
```

2. `.env`ファイルを編集

```bash
# エディタで開く
code .env
# または
nano .env
```

### 2.2 必須項目

#### GA4測定ID
```env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**取得方法:**
1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 管理 > データストリーム > ウェブストリームを作成
3. 測定IDをコピー（例: G-ABC123XYZ）

#### ビジネス情報
```env
BUSINESS_NAME=源（MINAMOTO）
BUSINESS_ADDRESS=京都市下京区四条通烏丸東入ル
BUSINESS_POSTAL_CODE=600-8005
BUSINESS_PHONE=075-123-4567
BUSINESS_EMAIL=info@minamoto-kyoto.jp
```

#### サイトURL
```env
SITE_URL=https://minamoto-kyoto.jp
OG_IMAGE_URL=https://minamoto-kyoto.jp/images/og-image.jpg
```

#### LINE連携（E4が設定）
```env
LINE_OFFICIAL_URL=https://lin.ee/XXXXXXX
```

### 2.3 環境変数の反映

#### 静的HTML版（現在の実装）
`index.html`内のプレースホルダーを置換する必要があります。

```javascript
// ビルドスクリプトで置換
// __GA4_MEASUREMENT_ID__ → 実際のGA4測定ID
```

**手動置換（開発時）:**
```bash
# macOS/Linux
sed -i '' 's/__GA4_MEASUREMENT_ID__/G-ABC123XYZ/g' index.html

# Windowsの場合は手動でエディタで置換
```

#### Next.js版（将来的な移行）
```javascript
// next.config.js
module.exports = {
  env: {
    GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID,
  },
}
```

---

## 3. GA4設定

### 3.1 GA4プロパティの作成

1. **Google Analytics 4アカウント作成**
   - URL: https://analytics.google.com/
   - 「測定を開始」をクリック
   - アカウント名: 源（MINAMOTO）
   - プロパティ名: 源LP本番環境

2. **データストリーム設定**
   - プラットフォーム: ウェブ
   - ウェブサイトURL: https://minamoto-kyoto.jp
   - ストリーム名: 源LP

3. **拡張計測を有効化**
   - ページビュー: ✓
   - スクロール数: ✓
   - 離脱クリック: ✓
   - サイト内検索: ✗（該当なし）
   - 動画エンゲージメント: ✗（該当なし）
   - ファイルのダウンロード: ✗（該当なし）

### 3.2 カスタムイベント設定

#### 実装済みイベント一覧

| イベント名 | トリガー条件 | パラメータ |
|-----------|-------------|-----------|
| `view_section` | セクションが50%以上表示 | section_name, section_id |
| `click_CTA` | CTAボタンクリック | cta_location, cta_text |
| `submit_order` | 予約フォーム送信 | order_type, reservation_date, guest_count |
| `scroll_depth` | スクロール深度（25/50/75/100%） | depth_percent |
| `web_vitals` | Web Vitals計測 | metric_name, metric_value, metric_rating |

#### GA4でのイベント確認方法
1. GA4管理画面 > レポート > リアルタイム
2. イベント名で`view_section`等を確認
3. DebugView を使用した詳細確認（次項）

### 3.3 DebugView設定

#### Chrome拡張機能インストール
1. [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)をインストール
2. 拡張機能を有効化

#### URLパラメータで有効化
```
https://minamoto-kyoto.jp/?debug_mode=true
```

#### DebugViewで確認
1. GA4管理画面 > 設定 > DebugView
2. リアルタイムでイベント発火を確認
3. パラメータの内容を検証

**DoD確認項目:**
- [ ] `view_section`イベントが各セクション表示時に発火
- [ ] `click_CTA`イベントがCTAクリック時に発火
- [ ] `submit_order`イベントがフォーム送信時に発火
- [ ] パラメータが正しく送信されている

---

## 4. ビルド・デプロイ

### 4.1 ローカル開発

#### シンプルHTTPサーバー起動
```bash
# Python 3
python3 -m http.server 8000

# Node.js http-server（推奨）
npx http-server -p 8000 -c-1
```

ブラウザで http://localhost:8000 にアクセス

### 4.2 Vercelデプロイ（E1担当）

#### vercel.json設定例
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "framework": null,
  "installCommand": "npm install",
  "env": {
    "GA4_MEASUREMENT_ID": "@ga4_measurement_id"
  }
}
```

#### 環境変数の設定
1. Vercelダッシュボード > Settings > Environment Variables
2. `GA4_MEASUREMENT_ID`を追加
   - Name: `GA4_MEASUREMENT_ID`
   - Value: `G-XXXXXXXXXX`
   - Environment: Production, Preview, Development

#### ビルドスクリプト（package.json）
```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "dev": "npx http-server -p 8000 -c-1",
    "lighthouse": "lighthouse http://localhost:8000 --view"
  }
}
```

#### ビルドスクリプト（scripts/build.js）
```javascript
const fs = require('fs');
const path = require('path');

// 環境変数読み込み
require('dotenv').config();

// index.htmlを読み込み
let html = fs.readFileSync('index.html', 'utf8');

// プレースホルダーを置換
html = html.replace(/__GA4_MEASUREMENT_ID__/g, process.env.GA4_MEASUREMENT_ID || '');

// dist/に出力
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}
fs.writeFileSync('dist/index.html', html);

console.log('Build complete! GA4 ID:', process.env.GA4_MEASUREMENT_ID);
```

---

## 5. 検証方法

### 5.1 SEO検証

#### Google Rich Results Test
1. URL: https://search.google.com/test/rich-results
2. ページURLを入力: `https://minamoto-kyoto.jp`
3. テスト実行

**DoD確認項目:**
- [ ] LocalBusiness/Restaurant構造化データが有効
- [ ] エラーなし
- [ ] 警告の確認と対応

#### Lighthouse SEO
```bash
# Lighthouse実行
npx lighthouse https://minamoto-kyoto.jp --only-categories=seo --view
```

**目標スコア: ≥90**

**主な項目:**
- [ ] `<title>`タグが適切
- [ ] `<meta name="description">`が適切
- [ ] `<h1>`タグが1つだけ存在
- [ ] 画像に`alt`属性がある
- [ ] リンクに説明的なテキストがある
- [ ] モバイルフレンドリー
- [ ] robots.txtが適切

### 5.2 パフォーマンス検証

#### Lighthouse Performance
```bash
npx lighthouse https://minamoto-kyoto.jp --only-categories=performance --view
```

**目標:**
- Performance Score: ≥90
- LCP: <2.5s
- CLS: <0.1
- FID: <100ms

#### PageSpeed Insights
- URL: https://pagespeed.web.dev/
- テストURL: `https://minamoto-kyoto.jp`
- モバイル/デスクトップ両方確認

#### WebPageTest
- URL: https://www.webpagetest.org/
- Test Location: Tokyo, Japan
- Browser: Chrome (Mobile)
- Connection: 3G

### 5.3 GA4イベント検証

#### DebugViewでの確認手順

1. **Chrome DevToolsでの確認**
```javascript
// コンソールで実行
console.log('GA4 Loaded:', window.GA4Tracking.isLoaded());
console.log('GA4 ID:', window.GA4_MEASUREMENT_ID);
```

2. **ネットワークタブでの確認**
   - DevTools > Network
   - Filter: `google-analytics.com`
   - イベント送信時のリクエストを確認

3. **各イベントの動作確認**

| イベント | テスト方法 | 期待結果 |
|---------|-----------|---------|
| view_section | ページをスクロール | セクションが表示された時に発火 |
| click_CTA | CTAボタンをクリック | クリック時に発火、パラメータ付き |
| submit_order | フォームを送信 | 送信時に発火、予約情報パラメータ付き |

4. **GA4 DebugViewで確認**
   - GA4管理画面 > 設定 > DebugView
   - 「過去30分」のイベントを確認
   - 各イベントのパラメータを確認

**スクリーンショット/動画撮影（DoD用）:**
```bash
# Chrome DevToolsでの録画
# 1. DevTools > Console > Start recording
# 2. ページ操作（スクロール、CTA クリック、フォーム送信）
# 3. DebugViewでイベント発火を確認
# 4. 録画停止してエクスポート
```

### 5.4 統合テスト

#### チェックリスト

**SEO:**
- [ ] title/meta descriptionが適切（60-160文字）
- [ ] h1タグが各ページに1つだけ存在
- [ ] JSON-LD構造化データが有効
- [ ] Rich Results Testでエラーなし
- [ ] Lighthouse SEO ≥90

**パフォーマンス:**
- [ ] Lighthouse Performance ≥90
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] FID <100ms
- [ ] 画像がWebP形式
- [ ] 画像にwidth/height指定

**GA4トラッキング:**
- [ ] GA4スクリプトが読み込まれている
- [ ] view_sectionイベントが発火
- [ ] click_CTAイベントが発火
- [ ] submit_orderイベントが発火
- [ ] DebugViewで動作確認済み
- [ ] パラメータが正しく送信されている

**アクセシビリティ:**
- [ ] Lighthouse Accessibility ≥90
- [ ] キーボードナビゲーション可能
- [ ] スクリーンリーダー対応
- [ ] コントラスト比が適切

**ベストプラクティス:**
- [ ] Lighthouse Best Practices ≥90
- [ ] HTTPS使用
- [ ] コンソールエラーなし
- [ ] セキュリティヘッダー設定

---

## 6. トラブルシューティング

### GA4イベントが発火しない

**症状:** DebugViewでイベントが表示されない

**確認項目:**
1. GA4測定IDが正しいか確認
```javascript
console.log(window.GA4_MEASUREMENT_ID);
```

2. gtagが読み込まれているか確認
```javascript
console.log(typeof gtag);  // 'function'であればOK
```

3. ネットワークエラーがないか確認
   - DevTools > Network > Filter: `google-analytics`
   - Status: 200 OKであることを確認

4. Ad Blockerが有効になっていないか確認
   - Ad Blockerを無効化してテスト

### 構造化データエラー

**症状:** Rich Results Testでエラーが出る

**対応:**
1. JSON-LDの構文エラーを確認
   - [JSON Validator](https://jsonlint.com/)で検証
2. 必須プロパティの確認
   - name, address, telephone等
3. Schema.orgの仕様確認
   - [Schema.org - Restaurant](https://schema.org/Restaurant)

### LCPが遅い

**症状:** Lighthouse でLCP >2.5s

**対応:**
1. ヒーロー画像のファイルサイズ確認
   - 目標: <200KB
2. `fetchpriority="high"`の設定確認
3. preconnectの設定確認
4. 画像の最適化（E5に依頼）

---

## 7. 関連ドキュメント

- [PERFORMANCE_STRATEGY.md](./PERFORMANCE_STRATEGY.md) - パフォーマンス最適化戦略
- [GA4_TRACKING_SPEC.md](./GA4_TRACKING_SPEC.md) - GA4イベント仕様書（次項で作成）
- [源LP_README_DoD.txt](./源LP_README_DoD.txt) - プロジェクト全体のDoD

---

## 8. サポート

### E3（Data & Tracking）担当
- GA4設定
- イベントトラッキング
- SEO最適化
- パフォーマンス計測

### 連絡先
- Slack: `#源lp-project`
- Email: `e3-tracking@example.com`

---

**最終更新:** 2025-10-14  
**バージョン:** 1.0.0  
**担当:** E3 (Data & Tracking)

