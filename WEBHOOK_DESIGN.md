# Webhook設計メモ - 将来の注文自動化に備えたIF設計

## 📋 概要
将来的にLINE経由の注文を自動化するためのWebhook実装に向けた要件定義・設計メモ

## 🎯 目的
- LINE Messaging API経由の注文受付自動化
- 注文データの構造化とデータベース連携
- 在庫管理・決済システムとの統合準備

## 🔍 Webhook要否判断

### ✅ Webhook実装が必要なケース
1. **自動注文受付**：LINE上でメニュー選択→注文確定の自動化
2. **在庫連携**：リアルタイムで在庫状況を反映・通知
3. **決済連携**：LINE Pay等との統合
4. **注文ステータス通知**：調理中→完成→配達等の自動通知
5. **CRM連携**：顧客データ管理・リピーター特典

### ⚠️ Webhook不要（現時点）のケース
- 単純なLINE公式アカウントへの誘導のみ
- 手動での注文受付・返信で十分な規模
- 注文数が少ない初期フェーズ

## 🏗️ システム構成案

```
[顧客] 
  ↓ LINE Message
[LINE Platform]
  ↓ Webhook
[API Gateway / Vercel Functions]
  ↓
[認証・検証レイヤー]
  ↓
[ビジネスロジック]
  ├→ 注文処理
  ├→ 在庫確認
  ├→ 決済処理
  └→ 通知送信
  ↓
[Database / Supabase or Firebase]
```

## 📡 Webhook仕様設計

### エンドポイント
```
POST /api/webhook/line
```

### リクエスト検証
```javascript
// LINE Platform署名検証
const crypto = require('crypto');

function verifySignature(body, signature, channelSecret) {
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');
  
  return hash === signature;
}
```

### イベント処理例
```javascript
// Webhook受信時の処理フロー
async function handleLineWebhook(event) {
  const { type, replyToken, source, message } = event;
  
  switch (type) {
    case 'message':
      return await handleMessage(message, replyToken, source);
    
    case 'postback':
      return await handlePostback(event);
    
    case 'follow':
      return await handleFollow(source);
    
    case 'unfollow':
      return await handleUnfollow(source);
    
    default:
      console.log(`Unhandled event type: ${type}`);
  }
}
```

## 💾 データモデル設計

### 注文テーブル (orders)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line_user_id VARCHAR(255) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  delivery_type VARCHAR(50),
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_line_user_id ON orders(line_user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 顧客テーブル (customers)
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  picture_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  total_orders INTEGER DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  first_order_at TIMESTAMP,
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 商品マスタ (products)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 セキュリティ要件

### 1. 署名検証
- 全てのWebhookリクエストでLINE Platform署名を検証
- Channel Secretは環境変数で管理

### 2. レート制限
- IP/ユーザー単位でのレート制限実装
- 異常なリクエスト数の検知・ブロック

### 3. データ暗号化
- 個人情報は暗号化して保存
- SSL/TLS通信必須

### 4. ログ・監査
- 全トランザクションのログ記録
- 異常検知アラート設定

## 📊 計測・モニタリング

### KPI指標
- Webhook応答時間（目標: <500ms）
- エラー率（目標: <0.1%）
- 注文完了率
- 離脱ポイント分析

### ログ項目
```javascript
{
  timestamp: "2025-10-14T12:34:56.789Z",
  event_type: "order_created",
  line_user_id: "U1234567890abcdef",
  order_id: "ORD-20251014-001",
  amount: 3500,
  status: "success",
  response_time_ms: 234
}
```

## 🚀 実装フェーズ

### Phase 1: 基礎インフラ（M1）
- [ ] Vercel Functions / API Routes セットアップ
- [ ] データベース（Supabase）セットアップ
- [ ] 環境変数・シークレット管理

### Phase 2: Webhook基本実装（M2）
- [ ] LINE Messaging API連携
- [ ] 署名検証実装
- [ ] 基本イベントハンドリング
- [ ] エラーハンドリング・リトライ

### Phase 3: 注文機能実装（M3）
- [ ] Flex Messageによるメニュー表示
- [ ] Postback処理（商品選択）
- [ ] 注文確認・確定フロー
- [ ] データベース連携

### Phase 4: 決済・通知実装（M4）
- [ ] LINE Pay連携（オプション）
- [ ] 注文ステータス通知
- [ ] 管理者通知（Slack等）
- [ ] 領収書・注文確認メッセージ

## 🔧 技術スタック候補

### バックエンド
- **サーバーレス**: Vercel Functions / Netlify Functions
- **データベース**: Supabase (PostgreSQL) / Firebase Firestore
- **認証**: JWT / LINE Login

### LINE API
- **Messaging API**: メッセージ送受信
- **LINE Login**: ユーザー認証（オプション）
- **LINE Pay**: 決済連携（オプション）

### 監視・ログ
- **ログ**: Vercel Analytics / LogRocket
- **エラー追跡**: Sentry
- **監視**: Uptime Robot / Better Uptime

## 📝 開発チェックリスト

### 実装前
- [ ] LINE Developers アカウント作成
- [ ] Messaging API Channel 作成
- [ ] Webhook URL登録
- [ ] Channel Secret / Access Token 取得
- [ ] 開発環境セットアップ

### 実装中
- [ ] 署名検証実装・テスト
- [ ] イベントハンドラ実装
- [ ] データベーススキーマ作成
- [ ] ユニットテスト作成
- [ ] 統合テスト実施

### 実装後
- [ ] 本番環境デプロイ
- [ ] モニタリング設定
- [ ] エラーアラート設定
- [ ] 運用ドキュメント作成
- [ ] ロールバック手順確認

## 📚 参考リソース

### 公式ドキュメント
- [LINE Messaging API リファレンス](https://developers.line.biz/ja/reference/messaging-api/)
- [Webhook イベントオブジェクト](https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects)
- [署名検証](https://developers.line.biz/ja/reference/messaging-api/#signature-validation)

### サンプルコード
- [LINE Bot SDK (Node.js)](https://github.com/line/line-bot-sdk-nodejs)
- [Vercel Functions 実装例](https://vercel.com/docs/functions/serverless-functions)

## 💡 推奨事項

### 現時点（初期フェーズ）
1. **手動運用でスタート**: Webhook実装せず、LINE公式アカウントで手動対応
2. **計測重視**: まずはLINE遷移率・CV率を計測
3. **注文数モニタリング**: 1日あたり注文数が50件超えたらWebhook検討

### 自動化判断基準
- 1日あたり注文数 > 50件
- 手動対応の人的コスト > システム開発・運用コスト
- 顧客からの即時応答要望が強い

## 🎯 結論・要否判断

### 現時点の判断: **Webhook実装は保留**

**理由**
1. LP立ち上げ初期フェーズ
2. 注文数が未知数（手動対応可能な範囲の可能性）
3. まずはLINE誘導・CV計測を優先
4. 必要になったタイミングで段階的実装可能

**次のステップ**
- 1ヶ月運用後、注文数・手動対応工数を評価
- 注文数が増加傾向にあれば Phase 1（基礎インフラ）着手
- この設計メモを基に詳細設計・実装を開始

---

**更新日**: 2025-10-14  
**担当**: E4 (Integrations Engineer)  
**レビュー**: 次回M2マイルストーン時に再評価

