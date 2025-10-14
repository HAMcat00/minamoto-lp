# 源 -MINAMOTO- LP（完全無欠スターター）

- 本番：Vercel（main）／Preview：PRごとに自動発行
- GA4測定IDは `index.html` の `html[data-ga-id]` を置換（例：Vercel環境変数でビルド時注入）
- 画像は `/public/images/` に配置（WebP推奨／寸法明記でCLS回避）

## 開発
1. `index.html / style.css / main.js` を編集
2. 画像は WebP + `loading="lazy"` を徹底（LCP対象は preload）
3. セクションID：`#s01`〜`#s13` + `#faq`

## 計測イベント
- `view_section`（IntersectionObserver）
- `click_CTA`（CTA4箇所）
- `submit_order`（将来のフォーム連携時）

## SEO/構造化
- LocalBusiness の JSON-LDを内包（住所/電話/URLは要更新）

## 受入基準
- Lighthouse 4項目≧90／CLS<0.1／LCP<2.5s
- iOS/AndroidのLINE遷移100%成功
