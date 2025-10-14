# Lighthouse Best Practices チェックリスト

## ✅ 実装済み項目

### 画像最適化
- [x] WebP形式の使用（全画像）
- [x] picture タグでフォールバック
- [x] loading="lazy"（ファーストビュー外）
- [x] fetchpriority="high"（ヒーロー画像）
- [x] width/height属性（CLS防止）
- [x] decoding="async"
- [x] 記述的なalt属性（30-100文字）

### OGP・メタデータ
- [x] OGP画像（1200×630px）
- [x] og:image:width/height指定
- [x] og:image:alt指定
- [x] Twitter Card設定
- [x] meta description最適化

### セキュリティ
- [x] HTTPS前提の設計
- [x] preconnect設定（Google Analytics等）
- [x] Cookie設定（SameSite=None;Secure）

### パフォーマンス
- [x] レスポンシブ画像（srcset）
- [x] 外部リソースのpreconnect
- [x] async/defer スクリプト読み込み

## 🔧 追加推奨項目

### セキュリティヘッダー（Vercel設定で対応）

`vercel.json` に以下を追加:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### Content Security Policy（CSP）

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' https://fonts.gstatic.com; 
  connect-src 'self' https://www.google-analytics.com;">
```

### Faviconの改善

現在: PNG形式
推奨: SVG（軽量・スケーラブル）

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon.png">
```

### 画像サイズ最適化目標

| 画像種別 | 推奨サイズ | フォーマット |
|---------|----------|------------|
| OGP | 1200×630px, <300KB | JPEG 85% / WebP 80% |
| ヒーロー | 1920×1080px, <500KB | WebP 80% |
| メニュー | 400×300px, <100KB | WebP 80% |
| LINE画面 | 400×800px, <150KB | WebP 80% |
| 地図 | 800×600px, <200KB | WebP 80% |

## 📊 Lighthouse スコア目標

### ターゲット（全カテゴリ≥90）

- **Performance**: ≥90
  - LCP (Largest Contentful Paint): ≤2.5s
  - FID (First Input Delay): ≤100ms
  - CLS (Cumulative Layout Shift): <0.1
  - FCP (First Contentful Paint): ≤1.8s
  - TTI (Time to Interactive): ≤3.8s

- **Accessibility**: ≥90
  - 適切なalt属性
  - 十分なカラーコントラスト
  - セマンティックHTML
  - キーボードナビゲーション対応

- **Best Practices**: ≥90
  - HTTPS使用
  - セキュリティヘッダー
  - コンソールエラーなし
  - 非推奨APIの不使用
  - 最適化された画像

- **SEO**: ≥90
  - meta description
  - タイトルタグ最適化
  - レスポンシブデザイン
  - 構造化データ（JSON-LD）
  - robots.txt/sitemap.xml

## 🔍 検証コマンド

### Lighthouse CLI（ローカル）
```bash
npm install -g lighthouse
lighthouse https://localhost:3000 --view
```

### Lighthouse CI（CI/CD統合）
```bash
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.json
```

### PageSpeed Insights（本番）
```bash
# URLを入力
https://pagespeed.web.dev/
```

## 🚀 パフォーマンス改善Tips

### 1. 画像の遅延読み込み
```html
<!-- ファーストビュー -->
<img src="hero.webp" fetchpriority="high" decoding="async">

<!-- ファーストビュー外 -->
<img src="about.webp" loading="lazy" decoding="async">
```

### 2. フォントの最適化
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 3. CSSの最適化
- クリティカルCSSのインライン化
- 未使用CSSの削除
- CSS minify

### 4. JavaScriptの最適化
- モジュールバンドル・tree shaking
- コード分割（dynamic import）
- defer/async属性の適切な使用

## 📝 週次チェック項目

- [ ] Lighthouse スコア測定（全ページ）
- [ ] OGP画像の表示確認（FB/Twitter）
- [ ] Core Web Vitals（Search Console）
- [ ] 画像最適化状況（WebP化率）
- [ ] モバイル表示確認（実機テスト）
- [ ] エラーログ確認（コンソール）

## 🎯 E5（Assets & Content）DoD達成基準

✅ **画像最適化**: WebP/Lazyload/alt徹底
✅ **OGP設定**: 1200×630サイズ、正しく表示される
✅ **コピー**: LP指令書（DoD.txt）に準拠
✅ **Lighthouse Best Practices**: ≥90

---

## 実施済み改善内容

1. **必要画像の配置**
   - ①唐揚げ接写（karaage-closeup）→ ヒーロー・メニュー画像
   - ②配達シーン（delivery）→ LINEセクション
   - ③地図（map）→ アクセスセクション
   - ④LINE画面（line-order）→ LINE予約セクション

2. **WebP対応**
   - 全画像にpictureタグ実装
   - フォールバックJPEG/PNG用意
   - loading="lazy"をファーストビュー外に適用
   - fetchpriority="high"をヒーロー画像に適用

3. **記述的alt属性**
   - 各画像に30-100文字の具体的な説明
   - アクセシビリティとSEO向上

4. **OGP設定**
   - 1200×630pxの画像指定
   - width/height/alt属性追加
   - SNSシェア文作成（FB/Twitter/Instagram/LINE）

5. **HTML最適化**
   - width/height属性でCLS防止
   - decoding="async"で描画最適化
   - セマンティックHTML構造

