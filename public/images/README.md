# 画像アセット管理

## 必要な画像（4点）

### 1. 唐揚げ接写（karaage-closeup）
- **用途**: メインビジュアル・商品訴求
- **推奨サイズ**: 1200×800px（3:2）
- **要件**: ジューシーな断面、湯気、シズル感
- **alt**: 「完全無欠の唐揚げ弁当 - サクサクジューシーな黄金色の唐揚げ、熱々できたてをお届け」

### 2. 配達シーン（delivery）
- **用途**: 配達サービス訴求
- **推奨サイズ**: 800×600px（4:3）
- **要件**: 清潔感、スピード感、笑顔の配達員
- **alt**: 「配達員が熱々の唐揚げ弁当を迅速にお届け」

### 3. 地図・アクセス（map）
- **用途**: 店舗位置・配達エリア表示
- **推奨サイズ**: 800×600px
- **要件**: わかりやすいランドマーク、配達範囲の視覚化
- **alt**: 「配達対応エリアマップ - 鶴ヶ島市内全域、主要な職場・建設現場へ配達可能」

### 4. LINE注文画面（line-order）
- **用途**: 注文フロー説明
- **推奨サイズ**: 400×800px（縦長）
- **要件**: LINEトーク画面のスクリーンショット、注文手順
- **alt**: 「LINEでの注文フロー画面 - チャット形式で個数・配達先・時間を選択して簡単注文、わずか3ステップで完了」

### 5. OGP画像（ogp）
- **用途**: SNSシェア用
- **推奨サイズ**: 1200×630px（OGP標準）
- **要件**: タイトル・キャッチコピー・CTAを含む
- **alt**: 「完全無欠の唐揚げ弁当 - サクサクジューシーな黄金色の唐揚げ、ワンコイン500円で配達」

## フォルダ構造
```
public/images/
├── placeholders/       # プレースホルダーSVG（実装済み）
│   ├── karaage-closeup.svg
│   ├── delivery.svg
│   ├── map.svg
│   └── line-order.svg
├── ogp.svg            # OGP画像（1200×630px）
└── README.md          # このファイル
```

## 最適化ルール
- **形式**: WebP（フォールバックJPEG）
- **遅延読み込み**: loading="lazy"（ファーストビュー外）
- **alt属性**: 記述的・具体的に（30-100文字）
- **画質**: WebP 80-85%（視覚的劣化なし）
- **レスポンシブ**: srcset/sizes属性で複数解像度対応

## WebP変換コマンド

### ImageMagick使用
```bash
convert input.jpg -quality 85 output.webp
```

### cwebp使用（Google製）
```bash
cwebp -q 85 input.jpg -o output.webp
```

### 一括変換スクリプト
```bash
for f in public/images/*.jpg; do
  cwebp -q 85 "$f" -o "${f%.jpg}.webp"
done
```

## HTML実装例

### picture タグでWebP対応
```html
<picture>
  <source srcset="/public/images/karaage-closeup.webp" type="image/webp">
  <img 
    src="/public/images/karaage-closeup.jpg" 
    alt="完全無欠の唐揚げ弁当 - サクサクジューシーな黄金色の唐揚げ、熱々できたてをお届け" 
    loading="lazy"
    width="1200"
    height="800"
    decoding="async"
  >
</picture>
```

### レスポンシブ画像（srcset）
```html
<picture>
  <source 
    srcset="/public/images/hero-1920.webp 1920w,
            /public/images/hero-1200.webp 1200w,
            /public/images/hero-768.webp 768w"
    sizes="100vw"
    type="image/webp">
  <img 
    src="/public/images/hero-768.jpg" 
    alt="..." 
    fetchpriority="high"
  >
</picture>
```

## 画像サイズ最適化目標

| 画像種別 | 推奨サイズ | フォーマット | 目標ファイルサイズ |
|---------|----------|------------|-----------------|
| OGP | 1200×630px | JPEG 85% / WebP 80% | <300KB |
| ヒーロー | 1200×800px | WebP 80% | <400KB |
| メニュー | 1200×800px | WebP 80% | <300KB |
| 配達 | 800×600px | WebP 80% | <200KB |
| 地図 | 800×600px | WebP 80% | <200KB |
| LINE画面 | 400×800px | WebP 80% | <150KB |

## チェックリスト

実画像配置時の確認項目：

- [ ] 全画像をWebP変換（品質80-85%）
- [ ] JPEGフォールバック画像も用意
- [ ] alt属性を記述的に（30-100文字）
- [ ] width/height属性でCLS防止
- [ ] loading="lazy"をファーストビュー外に適用
- [ ] fetchpriority="high"をヒーロー画像に適用
- [ ] decoding="async"で描画最適化
- [ ] ファイルサイズが目標値以内
- [ ] OGP画像は1200×630pxジャスト
- [ ] 画像の見た目に劣化がないか確認

