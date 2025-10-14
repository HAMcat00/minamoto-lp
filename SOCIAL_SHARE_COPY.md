# SNSシェア文・OGP設定

## OGP画像仕様
- **サイズ**: 1200×630px
- **ファイル**: `/public/images/ogp.jpg` (WebP版: `/public/images/ogp.webp`)
- **形式**: JPEG（品質85%）/ WebP（品質80%）
- **ファイルサイズ**: <300KB推奨

## SNSシェア文（プラットフォーム別）

### Facebook
**タイトル**: 完全無欠の唐揚げ弁当｜源 -MINAMOTO-【500円・送料無料】

**本文**:
```
鶴ヶ島の現場男子へ。手の届く最強、完全無欠の唐揚げ弁当。

✨ サクサクジューシーな黄金色の唐揚げ
💰 ワンコイン500円・送料無料
📱 LINEで簡単3ステップ注文
🚚 最短30分でお届け

職場・現場でガッツリ食べたい時に。
毎日でも気軽に注文できる価格設定です。

👉 今すぐLINEで注文
🔗 https://minamoto.example.com

#源 #MINAMOTO #唐揚げ弁当 #鶴ヶ島 #鶴ヶ島グルメ #デリバリー #ワンコイン #500円 #現場飯 #職場ランチ #唐揚げ #弁当配達
```

### Twitter/X
**パターン1（通常投稿）**:
```
🍗 完全無欠の唐揚げ弁当

ワンコイン500円・送料無料
鶴ヶ島市内の職場・現場へ配達

📱 LINEで簡単3ステップ
⏱️ 最短30分でお届け
💪 ボリューム満点

#鶴ヶ島グルメ #唐揚げ弁当 #現場飯
https://minamoto.example.com
```

**パターン2（キャンペーン用）**:
```
【今だけ限定】初回注文で漬物増量🎁

完全無欠の唐揚げ弁当
通常500円→初回500円＋漬物大盛り

サクサクジューシーな唐揚げ6個
炊きたてご飯（大盛り無料）
配達無料・最短30分

#鶴ヶ島 #唐揚げ #デリバリー
https://minamoto.example.com
```

**パターン3（口コミ引用）**:
```
「これで500円は安すぎる！」
「現場でみんな取り合いになった😂」
「唐揚げがマジで美味い」

鶴ヶ島の現場男子に人気の
完全無欠の唐揚げ弁当🍗

LINEで今すぐ注文👇
https://minamoto.example.com

#唐揚げ弁当 #鶴ヶ島グルメ
```

### Instagram
**キャプション**:
```
🍗 完全無欠の唐揚げ弁当

鶴ヶ島の現場男子へ。
手の届く最強、ワンコイン500円✨

📸 こだわりポイント
・サクサクジューシーな黄金色の唐揚げ×6個
・秘伝のタレで下味、二度揚げでカリッと
・炊きたてご飯（大盛り無料）
・自家製漬物付き
・送料無料で職場・現場へ配達

📱 LINEで簡単3ステップ
わずか3タップで注文完了🎵
最短30分でお届けします🚚

💰 ワンコイン500円（税込・送料無料）
毎日でも気軽に注文できる価格設定💪

📍 鶴ヶ島市内全域配達OK
⏰ 配達時間：11:00〜13:00（平日のみ）

プロフィールのリンクから注文👆
→ @minamoto_karaage

#源 #MINAMOTO #唐揚げ弁当 #鶴ヶ島 #鶴ヶ島グルメ #鶴ヶ島ランチ #埼玉グルメ #埼玉ランチ #デリバリー #弁当配達 #職場ランチ #現場飯 #ワンコイン #500円ランチ #唐揚げ #からあげ #ジューシー #ボリューム満点 #コスパ最強 #ランチ #お昼ご飯 #karaage #japanesefood #lunchbox #bento
```

### LINE公式アカウント（友だち追加時の挨拶文）
```
ご登録ありがとうございます🙇

源 -MINAMOTO- 公式LINEアカウントです。

完全無欠の唐揚げ弁当を
《ワンコイン500円・送料無料》で配達🍗

【ご注文の流れ】
1️⃣ 「注文する」ボタンをタップ
2️⃣ 個数・配達先・時間を選択
3️⃣ 最短30分でお届け✨

🎁 初回特典
→ 自家製漬物増量サービス

📍 配達エリア：鶴ヶ島市内全域
⏰ 配達時間：11:00〜13:00（平日のみ）

▼今すぐ注文
[注文する]

▼メニュー詳細
[メニューを見る]

▼配達エリア確認
[エリアマップ]

ご不明点はお気軽にお問い合わせください💬
```

### LINE公式アカウント（リッチメニュー文言）

| ボタン | 文言 |
|-------|------|
| ①注文 | 🍗 今すぐ注文 |
| ②メニュー | 📋 メニュー |
| ③エリア | 📍 配達エリア |
| ④お得情報 | 🎁 お得情報 |

## OGPメタタグ設定（実装済み）

```html
<!-- OGP設定 (1200×630px) -->
<meta property="og:type" content="website">
<meta property="og:title" content="完全無欠の唐揚げ弁当｜源 -MINAMOTO-【500円・送料無料】">
<meta property="og:description" content="鶴ヶ島の現場男子へ。手の届く最強、完全無欠の唐揚げ弁当を《500円・送料無料》でお届け。スマホ1つで今すぐ注文。">
<meta property="og:image" content="https://minamoto.example.com/public/images/ogp.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="完全無欠の唐揚げ弁当 - サクサクジューシーな黄金色の唐揚げ、ワンコイン500円で配達">
<meta property="og:url" content="https://minamoto.example.com/">
<meta property="og:site_name" content="源 -MINAMOTO-">
<meta property="og:locale" content="ja_JP">

<!-- Twitter Card (1200×630px) -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="完全無欠の唐揚げ弁当｜源 -MINAMOTO-【500円・送料無料】">
<meta name="twitter:description" content="鶴ヶ島の現場男子へ。完全無欠の唐揚げ弁当を500円・送料無料で配達。今すぐスマホで注文。">
<meta name="twitter:image" content="https://minamoto.example.com/public/images/ogp.jpg">
<meta name="twitter:image:alt" content="完全無欠の唐揚げ弁当 - サクサクジューシーな黄金色の唐揚げ、ワンコイン500円で配達">
```

## OGP検証ツール

実装後、以下のツールで確認してください：

### 1. Facebook Sharing Debugger
- **URL**: https://developers.facebook.com/tools/debug/
- **使い方**: URLを入力→「Scrape Again」でキャッシュクリア
- **確認項目**: 
  - 画像が正しく表示されるか（1200×630px）
  - タイトル・説明文が正しいか
  - 画像のファイルサイズ（<300KB推奨）

### 2. Twitter Card Validator
- **URL**: https://cards-dev.twitter.com/validator
- **使い方**: URLを入力→プレビュー確認（ログイン必要）
- **確認項目**:
  - カードタイプ: summary_large_image
  - 画像サイズ: 最小300×157px（推奨1200×630px）

### 3. LinkedIn Post Inspector
- **URL**: https://www.linkedin.com/post-inspector/
- **使い方**: URLを入力→「Inspect」
- **確認項目**:
  - 画像・タイトル・説明文の表示

### 4. OGP確認くん（日本語）
- **URL**: https://ogp.buta3.net/
- **使い方**: URLを入力→一括確認
- **利点**: 日本語UI、複数SNS同時確認

### 5. Meta Tags（オンラインプレビュー）
- **URL**: https://metatags.io/
- **使い方**: URLまたはメタタグを入力→プレビュー
- **利点**: Google/Facebook/Twitter/LinkedInのプレビュー同時表示

## 画像最適化チェックリスト

実装前の確認項目：

- [x] OGP画像（1200×630px）作成
- [x] 全画像にWebP版を用意
- [x] picture タグでフォールバック実装
- [x] loading="lazy" をファーストビュー外に適用
- [x] fetchpriority="high" をヒーロー画像に適用
- [x] alt属性は記述的（30-100文字）
- [x] width/height属性で CLS 防止
- [x] decoding="async" で描画最適化

実画像配置後の確認項目：

- [ ] OGP画像を実画像（JPEG/WebP）に差し替え
- [ ] Facebook Sharing Debuggerで確認
- [ ] Twitter Card Validatorで確認
- [ ] 実機（iOS/Android）で表示確認
- [ ] ファイルサイズが<300KB以内
- [ ] 画像の見た目に劣化がないか

## Lighthouse Best Practices目標

- **Performance**: ≥90
- **SEO**: ≥90
- **Accessibility**: ≥90
- **Best Practices**: ≥90

画像最適化により、特にPerformanceとBest Practicesスコアの向上を期待。

## 運用Tips

### シェア文のA/Bテスト

以下の要素を変更してテスト：

1. **絵文字の有無**
   - パターンA: 🍗📱💰を使用
   - パターンB: 絵文字なし

2. **CTAの強さ**
   - パターンA: 「今すぐ注文」
   - パターンB: 「詳細を見る」

3. **価格の表現**
   - パターンA: 「ワンコイン500円」
   - パターンB: 「たった500円」
   - パターンC: 「500円ポッキリ」

### 投稿タイミング

最適な投稿時間：

- **平日**: 10:00-10:30（ランチ前の注文喚起）
- **金曜**: 16:00-17:00（週末キャンペーン告知）
- **避けるべき**: 14:00-16:00（配達時間外）

### ハッシュタグ戦略

#### 必須ハッシュタグ（常時使用）
- #源
- #MINAMOTO
- #唐揚げ弁当
- #鶴ヶ島グルメ

#### 拡張ハッシュタグ（エンゲージメント向上）
- #鶴ヶ島ランチ
- #埼玉グルメ
- #現場飯
- #職場ランチ
- #ワンコインランチ
- #デリバリー

#### トレンドハッシュタグ（適時追加）
- #今日のランチ
- #お昼ご飯
- #ランチ何食べた
- #飯テロ

---

**作成日**: 2025年10月14日  
**最終更新**: 2025年10月14日  
**担当**: E5: Assets & Content

