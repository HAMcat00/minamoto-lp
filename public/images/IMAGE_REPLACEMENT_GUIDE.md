# 実写画像差し替えガイド

## 📸 必要な実写画像（優先順）

### 1. ヒーロー画像（最優先）
**現在**: `/public/images/hero.svg` (プレースホルダー)  
**実写素材**: 唐揚げ弁当の魅力的な写真

#### 必要なサイズ（レスポンシブ対応）
- **デスクトップ**: `hero.jpg` (1920×1080px) → `hero.webp`
- **タブレット**: `hero-tablet.jpg` (1200×675px) → `hero-tablet.webp`
- **モバイル**: `hero-mobile.jpg` (800×450px) → `hero-mobile.webp`

#### 撮影ポイント
- ✅ サクサクジューシーな唐揚げの断面
- ✅ 湯気やシズル感
- ✅ 黄金色の美しい揚げ色
- ✅ ボリューム感（6個の唐揚げ＋ご飯）
- ✅ 明るく食欲をそそる構図

#### WebP変換コマンド
```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images

# デスクトップ版
cwebp -q 85 hero.jpg -o hero.webp

# タブレット版
convert hero.jpg -resize 1200x675 hero-tablet.jpg
cwebp -q 85 hero-tablet.jpg -o hero-tablet.webp

# モバイル版
convert hero.jpg -resize 800x450 hero-mobile.jpg
cwebp -q 85 hero-mobile.jpg -o hero-mobile.webp
```

---

### 2. OGP画像（SNSシェア用）
**現在**: `/public/images/ogp.svg` (プレースホルダー)  
**実写素材**: 唐揚げ弁当＋テキストオーバーレイ

#### 必要なサイズ（厳密）
- **サイズ**: 1200×630px（OGP標準）
- **形式**: `ogp.jpg` (JPEG品質85%) → `ogp.webp` (WebP品質80%)
- **ファイルサイズ**: <300KB推奨

#### デザイン要件
- ✅ 唐揚げ弁当の写真（背景）
- ✅ テキストオーバーレイ:
  - 「完全無欠の唐揚げ弁当」（大見出し）
  - 「鶴ヶ島の現場男子へ」（サブタイトル）
  - 「ワンコイン500円・送料無料」（価格訴求）
  - 「LINEで今すぐ注文」（CTA）
- ✅ ロゴ: 「源 -MINAMOTO-」

#### WebP変換コマンド
```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images

# JPEG版（SNS互換性）
convert ogp-source.jpg -resize 1200x630! -quality 85 ogp.jpg

# WebP版（最適化）
cwebp -q 80 ogp.jpg -o ogp.webp
```

#### 検証ツール
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- OGP確認くん: https://ogp.buta3.net/

---

### 3. 概念図（3つのこだわり）
**現在**: `/public/images/concept.svg` (プレースホルダー)  
**実写素材**: 3つの要素を表現する写真またはインフォグラフィック

#### 必要なサイズ
- **サイズ**: 800×600px
- **形式**: `concept.jpg` → `concept.webp`

#### 内容
- ① 完全無欠の味（唐揚げ接写）
- ② ワンコイン500円（コインとお弁当）
- ③ スマホで簡単（LINE注文画面）

#### WebP変換コマンド
```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images

cwebp -q 85 concept.jpg -o concept.webp
```

---

### 4. 配達シーン（Feature 2用）
**現在**: `/public/images/placeholders/delivery.svg` (プレースホルダー)  
**実写素材**: 配達員が弁当を届けるシーン

#### 必要なサイズ
- **サイズ**: 800×600px
- **形式**: `delivery.jpg` → `delivery.webp`

#### 撮影ポイント
- ✅ 清潔感のある配達員
- ✅ 笑顔・親しみやすさ
- ✅ スピード感（バイク・自転車）
- ✅ 熱々の弁当を持っている様子

#### WebP変換コマンド
```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images/placeholders

cwebp -q 85 delivery.jpg -o delivery.webp
```

---

### 5. LINE注文画面（Feature 3用）
**現在**: `/public/images/placeholders/line-order.svg` (プレースホルダー)  
**実写素材**: LINEトーク画面のスクリーンショット

#### 必要なサイズ
- **サイズ**: 400×800px（縦長）
- **形式**: `line-order.jpg` → `line-order.webp`

#### 内容
- ✅ LINEトーク画面
- ✅ 注文フロー（3ステップ）
- ✅ チャット形式のUI
- ✅ 個数・配達先・時間選択

#### WebP変換コマンド
```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images/placeholders

cwebp -q 85 line-order.jpg -o line-order.webp
```

---

## 🔧 一括変換スクリプト

### ImageMagick + cwebp を使用
```bash
#!/bin/bash
cd /Users/hamcat/Desktop/📁AZVELIA/源/public/images

# ヒーロー画像（レスポンシブ）
if [ -f "hero-original.jpg" ]; then
  # デスクトップ
  convert hero-original.jpg -resize 1920x1080 -quality 90 hero.jpg
  cwebp -q 85 hero.jpg -o hero.webp
  
  # タブレット
  convert hero-original.jpg -resize 1200x675 -quality 90 hero-tablet.jpg
  cwebp -q 85 hero-tablet.jpg -o hero-tablet.webp
  
  # モバイル
  convert hero-original.jpg -resize 800x450 -quality 90 hero-mobile.jpg
  cwebp -q 85 hero-mobile.jpg -o hero-mobile.webp
  
  echo "✅ ヒーロー画像変換完了"
fi

# OGP画像
if [ -f "ogp-original.jpg" ]; then
  convert ogp-original.jpg -resize 1200x630! -quality 85 ogp.jpg
  cwebp -q 80 ogp.jpg -o ogp.webp
  echo "✅ OGP画像変換完了"
fi

# 概念図
if [ -f "concept-original.jpg" ]; then
  convert concept-original.jpg -resize 800x600 -quality 85 concept.jpg
  cwebp -q 85 concept.jpg -o concept.webp
  echo "✅ 概念図変換完了"
fi

# プレースホルダー画像
cd placeholders

if [ -f "delivery-original.jpg" ]; then
  convert delivery-original.jpg -resize 800x600 -quality 85 delivery.jpg
  cwebp -q 85 delivery.jpg -o delivery.webp
  echo "✅ 配達画像変換完了"
fi

if [ -f "line-order-original.jpg" ]; then
  convert line-order-original.jpg -resize 400x800 -quality 85 line-order.jpg
  cwebp -q 85 line-order.jpg -o line-order.webp
  echo "✅ LINE画像変換完了"
fi

echo "🎉 すべての画像変換が完了しました！"
```

### 実行方法
```bash
chmod +x /Users/hamcat/Desktop/📁AZVELIA/源/convert-images.sh
/Users/hamcat/Desktop/📁AZVELIA/源/convert-images.sh
```

---

## 📊 画像最適化チェックリスト

実写画像配置後の確認項目：

### 画像ファイル
- [ ] ヒーロー画像（3サイズ）配置完了
- [ ] OGP画像（1200×630px）配置完了
- [ ] 概念図配置完了
- [ ] 配達シーン配置完了
- [ ] LINE注文画面配置完了
- [ ] すべてWebP変換済み
- [ ] JPEGフォールバック画像も用意

### HTML実装
- [ ] picture タグで WebP 対応
- [ ] width/height 属性で CLS 防止
- [ ] loading="lazy" をファーストビュー外に適用
- [ ] fetchpriority="high" をヒーロー画像に適用
- [ ] decoding="async" で描画最適化
- [ ] alt属性が記述的（30-100文字）

### OGP検証
- [ ] Facebook Sharing Debugger で確認
- [ ] Twitter Card Validator で確認
- [ ] 実機（iOS/Android）で表示確認
- [ ] 画像サイズ <300KB 確認

### Lighthouse測定
- [ ] Performance ≥90
- [ ] Accessibility ≥90
- [ ] Best Practices ≥90
- [ ] SEO ≥90
- [ ] LCP ≤2.5s
- [ ] CLS <0.1

---

## 🎯 優先順位

1. **最優先**: ヒーロー画像 + OGP画像（ファーストインプレッション）
2. **高**: 概念図（コンテンツの理解）
3. **中**: 配達シーン + LINE画面（補足説明）

---

## 📝 注意事項

### ファイル命名規則
- オリジナル画像: `*-original.jpg`
- 最適化後JPEG: `*.jpg`
- WebP版: `*.webp`

### 画像品質設定
- **JPEG**: 品質85-90%（視覚的劣化なし）
- **WebP**: 品質80-85%（JPEGより20-30%軽量）

### ファイルサイズ目標
| 画像 | 目標サイズ |
|------|-----------|
| ヒーロー（デスクトップ） | <500KB |
| ヒーロー（タブレット） | <300KB |
| ヒーロー（モバイル） | <200KB |
| OGP | <300KB |
| 概念図 | <200KB |
| 配達・LINE | <150KB |

### SVGプレースホルダーの削除
実写画像配置後、以下のSVGファイルは削除してOK：
- `/public/images/hero.svg`
- `/public/images/concept.svg`
- `/public/images/ogp.svg`
- `/public/images/placeholders/*.svg`

---

**作成日**: 2025年10月14日  
**担当**: E5: Assets & Content

