# 源（MINAMOTO）LP

京都四条の本格和食料理店「源」のランディングページ

## 📋 プロジェクト概要

このリポジトリは、源（MINAMOTO）様のLP（ランディングページ）のソースコードです。
5人のエンジニア体制（E1〜E5）で開発されており、本実装はE3（Data & Tracking）が担当しています。

### 担当領域（E3: Data & Tracking）
- ✅ GA4イベントトラッキング実装
- ✅ SEO最適化（title/meta/JSON-LD）
- ✅ Web Vitals計測
- ✅ パフォーマンス最適化戦略
- ✅ 計測仕様書作成

## 🎯 Definition of Done (DoD)

### E3の達成基準
- [x] GA4スクリプト実装（測定IDは環境変数管理）
- [x] 3種のイベント実装（view_section, click_CTA, submit_order）
- [x] SEO基本設定（title/meta description/h1）
- [x] JSON-LD構造化データ（LocalBusiness/Restaurant）
- [x] LCP<2.5s を満たす画像読み込み戦略
- [ ] DebugViewでイベント発火動画撮影
- [ ] Rich Results Testでスキーマ有効確認
- [ ] Lighthouse SEO ≥90 達成

## 🚀 クイックスタート

### 1. 前提条件
```bash
# Node.js 18以上
node --version  # v18.0.0以上

# npm 9以上
npm --version   # 9.0.0以上
```

### 2. セットアップ
```bash
# リポジトリをクローン
git clone <repository-url>
cd 源

# 依存関係をインストール
npm install

# 環境変数ファイルを作成
cp env.template .env

# .envファイルを編集してGA4測定IDを設定
# GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. 開発サーバー起動
```bash
npm run dev
```

ブラウザで http://localhost:8000 にアクセス

### 4. ビルド
```bash
npm run build
```

ビルド結果は `dist/` ディレクトリに出力されます。

## 📁 ディレクトリ構成

```
源/
├── index.html                      # メインHTML
├── css/
│   └── styles.css                  # スタイルシート
├── js/
│   ├── tracking.js                 # GA4イベントトラッキング（E3）
│   └── main.js                     # メインJavaScript
├── images/                         # 画像ファイル（E5担当）
├── scripts/
│   ├── build.js                    # ビルドスクリプト
│   └── test-seo.js                 # SEOテストスクリプト
├── docs/
│   ├── SETUP.md                    # セットアップガイド
│   ├── GA4_TRACKING_SPEC.md        # GA4イベント仕様書
│   ├── PERFORMANCE_STRATEGY.md     # パフォーマンス戦略
│   └── 源LP_README_DoD.txt         # プロジェクト全体DoD
├── env.template                    # 環境変数テンプレート
├── package.json                    # npm設定
└── README.md                       # このファイル
```

## 🔧 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:8000） |
| `npm run build` | 本番用ビルド（dist/に出力） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lighthouse` | Lighthouse監査実行 |
| `npm run lighthouse:ci` | Lighthouse CI用（JSON出力） |
| `npm run test:seo` | SEO基本チェック |

## 📊 GA4イベント一覧

| イベント名 | トリガー条件 | 主要パラメータ |
|-----------|-------------|---------------|
| `view_section` | セクションが50%以上表示 | section_name, section_id |
| `click_CTA` | CTAボタンクリック | cta_location, cta_text, cta_href |
| `submit_order` | 予約フォーム送信 | reservation_date, guest_count, course_type |
| `scroll_depth` | スクロール深度（25/50/75/100%） | depth_percent |
| `web_vitals` | Web Vitals計測 | metric_name, metric_value, metric_rating |

詳細は [GA4_TRACKING_SPEC.md](./GA4_TRACKING_SPEC.md) を参照

## 🎨 主要機能

### GA4トラッキング
- ✅ 自動ページビュー計測
- ✅ セクション表示トラッキング（Intersection Observer）
- ✅ CTAクリックトラッキング（全CTAボタン対応）
- ✅ フォーム送信トラッキング（PII除外）
- ✅ スクロール深度計測（25/50/75/100%）
- ✅ Web Vitals計測（LCP/FID/CLS）

### SEO最適化
- ✅ title/meta descriptionの最適化
- ✅ h1タグの適切な使用
- ✅ JSON-LD構造化データ（Restaurant/LocalBusiness）
- ✅ OGP設定（Facebook/Twitter）
- ✅ Viewport設定（モバイル対応）

### パフォーマンス最適化
- ✅ レスポンシブ画像（WebP + フォールバック）
- ✅ 画像の遅延読み込み（loading="lazy"）
- ✅ LCP要素の優先読み込み（fetchpriority="high"）
- ✅ CSS/JSの非同期読み込み
- ✅ Preconnect設定（GA4, Fonts）

## 🧪 テスト方法

### 1. ローカル開発環境でのテスト
```bash
# 開発サーバー起動
npm run dev

# 別のターミナルでLighthouse実行
npm run lighthouse
```

### 2. GA4イベント検証
```bash
# DebugViewを有効にしてアクセス
http://localhost:8000/?debug_mode=true

# Chrome DevToolsのコンソールで確認
console.log(window.GA4_MEASUREMENT_ID);
console.log(typeof gtag);  # 'function'であればOK
```

### 3. SEO検証
```bash
# SEO基本チェック
npm run test:seo

# Rich Results Test（オンライン）
# https://search.google.com/test/rich-results にアクセスしてURLを入力
```

### 4. パフォーマンス検証
- Lighthouse Performance: ≥90
- LCP: <2.5s
- CLS: <0.1
- FID: <100ms

詳細は [SETUP.md](./SETUP.md) を参照

## 📈 KPI・目標値

| 指標 | 目標値 | 現状 |
|-----|--------|------|
| **CVR** | ≥10% | - |
| **Lighthouse Performance** | ≥90 | - |
| **Lighthouse SEO** | ≥90 | - |
| **LCP** | <2.5s | - |
| **CLS** | <0.1 | - |

## 🔗 関連ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [SETUP.md](./SETUP.md) | セットアップ詳細ガイド |
| [GA4_TRACKING_SPEC.md](./GA4_TRACKING_SPEC.md) | GA4イベント仕様書 |
| [PERFORMANCE_STRATEGY.md](./PERFORMANCE_STRATEGY.md) | パフォーマンス最適化戦略 |
| [源LP_README_DoD.txt](./源LP_README_DoD.txt) | プロジェクト全体DoD |

## 👥 チーム構成

| 役割 | 担当領域 | DoD |
|-----|---------|-----|
| **E1** | Lead Architect / Infra | CI/CD、Vercelデプロイ、Lighthouse≥90 |
| **E2** | Frontend UI | HTML/CSS/JS、CLS<0.1、モバイル対応 |
| **E3** | Data & Tracking | GA4、SEO、A/B、構造化データ |
| **E4** | Integrations | LINE連携、フォーム、Webhook |
| **E5** | Assets & Content | 画像最適化、OGP、口コミ更新 |

## 🚢 デプロイ

### Vercelへのデプロイ（E1担当）

1. Vercelプロジェクト作成
2. 環境変数設定
   - `GA4_MEASUREMENT_ID`: G-XXXXXXXXXX
3. ビルドコマンド設定
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. デプロイ

詳細は [SETUP.md](./SETUP.md) の「4. ビルド・デプロイ」を参照

## 📞 サポート

### 問い合わせ先
- Slack: `#源lp-project`
- E3（Data & Tracking）担当: [連絡先]

### よくある質問
**Q: GA4イベントが発火しない**  
A: `.env`ファイルの`GA4_MEASUREMENT_ID`が正しく設定されているか確認してください。

**Q: Lighthouseスコアが低い**  
A: 画像の最適化（E5）とCSS最適化（E2）を確認してください。詳細は [PERFORMANCE_STRATEGY.md](./PERFORMANCE_STRATEGY.md) を参照。

**Q: 構造化データのエラー**  
A: [Rich Results Test](https://search.google.com/test/rich-results) でエラー内容を確認し、`index.html`のJSON-LD部分を修正してください。

## 📝 ライセンス

MIT License

---

**プロジェクト:** 源LP  
**担当:** E3 (Data & Tracking)  
**バージョン:** 1.0.0  
**最終更新:** 2025-10-14
