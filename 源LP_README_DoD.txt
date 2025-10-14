
# 源LP プロジェクト：役割・Definition of Done

## 5人のエンジニア体制（DRI）
E1: Lead Architect／Infra（Repo・CI・Vercel）
- DoD: main保護・CI通過・Vercel本番/プレビュー自動デプロイ、Lighthouse Perf≧90。

E2: Frontend UI（HTML/CSS/JS/Anim）
- DoD: CLS<0.1、モバイル≥375pxで崩れなし、コンポーネント再利用化、追従CTAの視認率>95%。

E3: Data & Tracking（GA4・Heatmap・A/B・SEO）
- DoD: GA4全イベント発火、計測仕様書と一致、A/Bテスト運用手順書、構造化データのリッチ結果確認。

E4: Integrations（LINE・フォーム・Webhook）
- DoD: CTA→LINE遷移100%成功（iOS/Android実機）、計測パラメータ付与、Webhook要否判断・設計。

E5: Assets & Content（画像最適化・OGP・Schema）
- DoD: 画像はWebP/Lazyload、OGP正しく表示、週次口コミ更新の運用手順書。

## ボードの使い方（Trello/Asana共通）
- セクションは M1〜M4 の里程標。各カードは「依存」記載順で着手。
- PRは必ずレビュー2名（E1＋関連担当）。
- ランチ前デプロイ禁止・ロールバック手順必須。

## KPI
- CVR≥10%、離脱率≤20%、LCP≤2.5s、Lighthouse(Perf/SEO/A11y/Best)≥90。
