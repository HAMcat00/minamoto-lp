# 源LP - モバイルファーストランディングページ

## 📋 プロジェクト概要

E2（Frontend UI）の実装完了。モバイルファースト設計による高パフォーマンスなランディングページ。

## 🎯 実装内容

### ✅ 完了項目

#### 1. セクション骨組み（①〜⑬）とSticky CTA
- ✅ ① ヘッダー（Header）
- ✅ ② ヒーローセクション（Hero）
- ✅ ③ 問題提起（Problem）
- ✅ ④ ソリューション（Solution）
- ✅ ⑤ 特徴1（Feature 1）
- ✅ ⑥ 特徴2（Feature 2）
- ✅ ⑦ 特徴3（Feature 3）
- ✅ ⑧ 料金（Pricing）
- ✅ ⑨ フロー（Flow）
- ✅ ⑩ FAQ
- ✅ ⑪ CTA（Call to Action）
- ✅ ⑫ お客様の声（Testimonials）
- ✅ ⑬ フッター（Footer）
- ✅ Sticky CTA（画面下部追従）

#### 2. CSSトークン
- ✅ カラー：`#DD2C00`（プライマリ）、`#F88C5E`（プライマリライト）
- ✅ 余白：モバイル先行 40px/20px
- ✅ 角丸：8px/12px/16px/24px
- ✅ 影：3段階のシャドウ定義

#### 3. スクロールFade（IntersectionObserver）
- ✅ 全セクションでフェードイン効果
- ✅ パフォーマンス最適化（一度表示されたら監視解除）
- ✅ `prefers-reduced-motion` 対応

## 🎨 デザインシステム

### カラーパレット
```css
--color-primary: #DD2C00        /* メインカラー */
--color-primary-light: #F88C5E  /* アクセント */
--color-primary-dark: #B71C00   /* ホバー時 */
```

### スペーシング
```css
--spacing-md: 20px   /* モバイル基本余白 */
--spacing-lg: 40px   /* モバイルセクション余白 */
```

### レスポンシブブレークポイント
- 375px：最小サポート幅
- 768px：タブレット
- 1200px：デスクトップ（max-width）

## 📊 Definition of Done（DoD）検証

### 1. ✅ モバイル対応（375px以上）
- [x] 375px以上で崩れなし
- [x] タッチ操作に最適化
- [x] 40px/20pxの余白システム
- [x] 最小タップ領域：48px × 48px

### 2. ⏱️ CLS < 0.1
- [x] CLS測定機能を実装（`script.js`）
- [x] 固定サイズのコンポーネント配置
- [x] アスペクト比の維持
- [x] フォントの先読み（preconnect）
- [x] `will-change`による最適化

**測定方法：**
```javascript
// ブラウザのコンソールで確認
// "📊 CLS値: 0.0xxx" が表示されます
```

### 3. 👁️ CTA視認率 > 95%
- [x] Sticky CTA実装
- [x] 視認率測定機能実装
- [x] ヒーロー通過後に自動表示
- [x] CTAセクション到達時に非表示
- [x] z-index: 100で最前面配置

**測定方法：**
```javascript
// ブラウザのコンソールで確認
// "👁️ Sticky CTA 視認率: XX.XX%" が表示されます
```

### 4. ♿ アクセシビリティ
- [x] セマンティックHTML
- [x] フォーカス可視化
- [x] 適切なコントラスト比
- [x] キーボードナビゲーション

### 5. 📈 パフォーマンス
- [x] 画像遅延読み込み（LazyLoad）
- [x] GPUアクセラレーション
- [x] スクロールイベントのthrottle処理
- [x] IntersectionObserver活用

## 🚀 使用方法

### ローカルでの確認
```bash
# 1. ファイルをブラウザで開く
open index.html

# または、シンプルなHTTPサーバーで起動
# Python 3の場合
python3 -m http.server 8000

# Node.jsの場合（http-serverがインストール済みの場合）
npx http-server -p 8000
```

### ブラウザでの確認項目
1. **デベロッパーツールを開く**（F12）
2. **コンソールを確認**
   - CLS値が表示される
   - Sticky CTA視認率が表示される
   - LCP値が表示される
3. **レスポンシブモード**
   - 375px〜1200pxで表示を確認
   - 横向き/縦向きの両方を確認
4. **実機テスト**（推奨）
   - iPhone SE（375px）
   - iPhone 13 Pro（390px）
   - Android各種

## 📱 対応デバイス

### ✅ テスト済み
- iPhone SE（375px）
- iPhone 12/13（390px）
- iPhone 12/13 Pro Max（428px）
- iPad（768px）
- Desktop（1200px+）

### ⚠️ 非推奨
- 375px未満のデバイス（警告表示）

## 🛠️ ファイル構成

```
📁AZVELIA/源/
├── index.html          # メインHTML（13セクション）
├── styles.css          # CSSトークン + スタイル定義
├── script.js           # JavaScript（IntersectionObserver, Sticky CTA, etc.）
├── README.md           # このファイル
├── 源LP_README_DoD.txt # プロジェクト定義
└── ...
```

## 🎯 主要機能

### 1. IntersectionObserver
- スクロール時のフェードイン効果
- Sticky CTAの表示/非表示制御
- 画像の遅延読み込み
- CTA視認率の測定

### 2. パフォーマンス測定
- **CLS（Cumulative Layout Shift）**：レイアウトシフト測定
- **LCP（Largest Contentful Paint）**：最大コンテンツ描画時間
- **Navigation Timing API**：ページ読み込み時間

### 3. CTAトラッキング
- すべてのCTAボタンに`data-cta`属性
- クリックイベントの追跡
- GA4連携準備完了

## 🔧 カスタマイズ方法

### カラー変更
```css
/* styles.css の :root セクション */
--color-primary: #DD2C00;        /* お好みの色に変更 */
--color-primary-light: #F88C5E;  /* お好みの色に変更 */
```

### 余白調整
```css
--spacing-md: 20px;  /* モバイル基本余白 */
--spacing-lg: 40px;  /* セクション余白 */
```

### フォント変更
```css
--font-family: 'Noto Sans JP', sans-serif;  /* お好みのフォントに変更 */
```

## 📈 次のステップ（E3〜E5連携）

### E3: Data & Tracking
- [ ] GA4タグの設置
- [ ] ヒートマップツール導入
- [ ] A/Bテスト設定

### E4: Integrations
- [ ] LINE連携（CTA→LINE遷移）
- [ ] フォーム実装
- [ ] Webhook設定

### E5: Assets & Content
- [ ] 画像の最適化（WebP変換）
- [ ] OGP設定
- [ ] Schema.orgマークアップ

## 🐛 既知の問題

現時点で既知の問題はありません。

## 📝 変更履歴

- **2025-10-14**: 初回実装完了
  - 13セクション実装
  - Sticky CTA実装
  - IntersectionObserver実装
  - CLS/LCP測定機能実装

## 📞 お問い合わせ

質問や問題がある場合は、プロジェクトチームまでお問い合わせください。

---

**E2: Frontend UI - 実装完了** ✅
