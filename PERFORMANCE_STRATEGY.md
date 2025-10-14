# パフォーマンス最適化戦略（E3 × E5連携）

## 目標
- **LCP (Largest Contentful Paint) < 2.5秒**
- **CLS (Cumulative Layout Shift) < 0.1**
- **FID (First Input Delay) < 100ms**
- **Lighthouse Performance Score ≥ 90**

---

## 1. LCP（Largest Contentful Paint）最適化

### 1.1 画像最適化（E5担当）

#### 必須対応
- [ ] **WebP形式への変換**
  - すべての画像をWebP形式で提供
  - フォールバック用にJPG/PNGも保持
  - 変換ツール: `cwebp`（libwebp）

- [ ] **レスポンシブ画像**
  - 3サイズ展開: 375px（モバイル）、768px（タブレット）、1920px（デスクトップ）
  - `<picture>`タグと`srcset`を使用
  - 例: `hero-375.webp`, `hero-768.webp`, `hero-1920.webp`

- [ ] **画像圧縮**
  - WebP品質: 80-85
  - JPG品質: 75-80
  - ツール: ImageOptim, Squoosh, Sharp

#### ファイル命名規則
```
/images/
  hero-375.webp     # モバイル用（375px幅）
  hero-768.webp     # タブレット用（768px幅）
  hero-1920.webp    # デスクトップ用（1920px幅）
  hero-768.jpg      # フォールバック用
  og-image.jpg      # OGP画像（1200x630）
```

### 1.2 画像読み込み戦略（E3 × E5）

#### ヒーロー画像（Above the Fold）
```html
<picture>
  <source srcset="/images/hero-1920.webp" media="(min-width: 1200px)" type="image/webp">
  <source srcset="/images/hero-1200.webp" media="(min-width: 768px)" type="image/webp">
  <source srcset="/images/hero-768.webp" media="(min-width: 375px)" type="image/webp">
  <img 
    src="/images/hero-768.jpg" 
    alt="源の料理" 
    class="hero-image"
    width="1920"
    height="1080"
    fetchpriority="high"
    decoding="async"
  >
</picture>
```

**重要属性:**
- `fetchpriority="high"`: LCP要素に高優先度を付与
- `width`と`height`: CLSを防ぐためのサイズ指定
- `decoding="async"`: 非同期デコード

#### Below the Fold画像
```html
<img 
  src="/images/placeholder.jpg" 
  alt="説明" 
  loading="lazy"
  width="600"
  height="400"
>
```

**重要属性:**
- `loading="lazy"`: ネイティブ遅延読み込み
- `width`と`height`: CLS防止

### 1.3 CDN戦略（E1担当依頼）

- [ ] Vercel Image Optimization利用
- [ ] Next.js `<Image>`コンポーネント（将来的な移行）
- [ ] または: Cloudflare Images / Cloudinary

---

## 2. CLS（Cumulative Layout Shift）対策

### 2.1 画像のサイズ指定（E5 × E2）
```html
<!-- ❌ NG: サイズ未指定 -->
<img src="/images/hero.jpg" alt="...">

<!-- ✅ OK: width/height指定 -->
<img src="/images/hero.jpg" alt="..." width="1920" height="1080">

<!-- ✅ OK: aspect-ratioで指定 -->
<img src="/images/hero.jpg" alt="..." style="aspect-ratio: 16/9;">
```

### 2.2 フォント読み込み（E2担当）
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" media="print" onload="this.media='all'">
```

### 2.3 レイアウト予約
- CSSで最小高さを指定
- スケルトンスクリーンの使用
- プレースホルダー画像

---

## 3. FID（First Input Delay）対策

### 3.1 JavaScriptの最適化（E2 × E3）

#### スクリプトの非同期読み込み
```html
<!-- 非同期読み込み -->
<script src="/js/tracking.js" async></script>
<script src="/js/main.js" defer></script>
```

- `async`: 独立したスクリプト（GA4など）
- `defer`: DOM依存のスクリプト

#### コード分割
```javascript
// 重い処理は遅延実行
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // 優先度の低い処理
    initHeatmapTracking();
  });
}
```

### 3.2 サードパーティスクリプト最適化

#### GA4の最適化
```html
<!-- preconnectで接続を事前確立 -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://www.google-analytics.com">

<!-- asyncで非同期読み込み -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 4. リソース読み込み優先順位

### 4.1 Critical Rendering Path
```html
<head>
  <!-- 1. DNS接続の事前確立 -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- 2. クリティカルCSS（インライン化） -->
  <style>
    /* Above the Fold CSS */
    body { margin: 0; font-family: sans-serif; }
    .hero { min-height: 100vh; }
  </style>
  
  <!-- 3. 非クリティカルCSSは遅延 -->
  <link rel="preload" as="style" href="/css/styles.css" onload="this.onload=null;this.rel='stylesheet'">
  
  <!-- 4. LCP画像の事前読み込み -->
  <link rel="preload" as="image" href="/images/hero-1920.webp" imagesrcset="/images/hero-375.webp 375w, /images/hero-768.webp 768w, /images/hero-1920.webp 1920w">
  
  <!-- 5. JavaScript（非同期） -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=..."></script>
</head>
```

### 4.2 優先順位まとめ

| 優先度 | リソース | 手法 |
|--------|----------|------|
| 最高 | LCP画像（ヒーロー） | `fetchpriority="high"` + preload |
| 高 | クリティカルCSS | インライン化 |
| 高 | フォント | preconnect + preload |
| 中 | GA4スクリプト | async |
| 中 | メインJS | defer |
| 低 | Below the Fold画像 | `loading="lazy"` |
| 低 | アイコンフォント | 遅延読み込み |

---

## 5. 画像配信フロー（E5作業手順）

### ステップ1: 画像収集
```bash
# オリジナル画像を配置
/source-images/
  hero-original.jpg         # ヒーロー画像
  about-original.jpg        # About画像
  menu-1-original.jpg       # メニュー画像1
  menu-2-original.jpg       # メニュー画像2
  menu-3-original.jpg       # メニュー画像3
```

### ステップ2: 画像変換スクリプト（E5提供）
```bash
# 変換スクリプトの実行
npm run optimize-images
# または
./scripts/optimize-images.sh
```

### ステップ3: 出力確認
```bash
/images/
  hero-375.webp       # 10-30KB目標
  hero-768.webp       # 30-80KB目標
  hero-1920.webp      # 80-200KB目標
  hero-768.jpg        # フォールバック
  ...
```

---

## 6. 計測・モニタリング（E3担当）

### 6.1 開発環境での計測

#### Lighthouse CI
```bash
# ローカルでLighthouse実行
npm run lighthouse

# 目標スコア
# Performance: ≥90
# SEO: ≥90
# Accessibility: ≥90
# Best Practices: ≥90
```

#### WebPageTest
- URL: https://www.webpagetest.org/
- テスト条件: Mobile (3G)
- 目標: LCP < 2.5s

### 6.2 本番環境でのモニタリング

#### GA4 Web Vitals
```javascript
// tracking.jsで実装済み
gtag('event', 'web_vitals', {
  'metric_name': 'LCP',
  'metric_value': lcp,
  'metric_rating': 'good' | 'needs_improvement' | 'poor'
});
```

#### PageSpeed Insights API
- 定期的な自動計測（CI/CD）
- Slackへの通知

---

## 7. チェックリスト（DoD）

### E3（Data & Tracking）担当
- [x] GA4イベント実装（view_section, click_CTA, submit_order）
- [x] Web Vitalsトラッキング実装
- [x] Performance Observer実装
- [ ] Lighthouse CI設定
- [ ] GA4 DebugViewで動作確認
- [ ] パフォーマンスレポート作成

### E5（Assets & Content）担当
- [ ] すべての画像をWebP変換
- [ ] 3サイズ（375/768/1920）作成
- [ ] 画像圧縮（品質80-85）
- [ ] OGP画像作成（1200x630）
- [ ] Favicon作成（PNG形式）
- [ ] 画像最適化スクリプト作成

### E2（Frontend UI）担当
- [ ] Critical CSS抽出・インライン化
- [ ] フォント最適化（preload）
- [ ] CSSスプライト（必要に応じて）
- [ ] アニメーションの最適化
- [ ] レスポンシブ対応確認

### E1（Infra）担当
- [ ] Vercel設定最適化
- [ ] CDN設定
- [ ] キャッシュ戦略設定
- [ ] 画像最適化API設定

---

## 8. トラブルシューティング

### LCPが遅い場合
1. ヒーロー画像のファイルサイズ確認（目標: <200KB）
2. `fetchpriority="high"`が設定されているか確認
3. preconnectが設定されているか確認
4. サーバーレスポンス時間確認（TTFB < 600ms）

### CLSが高い場合
1. すべての画像にwidth/height指定があるか確認
2. フォント読み込みでレイアウトシフトが起きていないか確認
3. 動的コンテンツの挿入をチェック
4. 広告枠のサイズ予約を確認

### FIDが遅い場合
1. メインスレッドのロング タスクを確認
2. JavaScriptの実行タイミングを見直し
3. サードパーティスクリプトの影響を調査
4. コード分割を検討

---

## 9. 参考資料

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Critical Rendering Path](https://web.dev/critical-rendering-path/)
- [WebP Image Format](https://developers.google.com/speed/webp)

---

**最終更新:** 2025-10-14  
**担当:** E3 (Data & Tracking)  
**連携:** E5 (Assets & Content), E2 (Frontend UI), E1 (Infra)

