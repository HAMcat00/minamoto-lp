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
```

## 🎯 結論・要否判断

### 現時点の判断: **Webhook実装は保留**

**理由**
1. LP立ち上げ初期フェーズ
2. 注文数が未知数（手動対応可能な範囲の可能性）
3. まずはLINE誘導・CV計測を優先
4. 必要になったタイミングで段階的実装可能

**次のステップ**
- 1ヶ月運用後、注文数・手動対応工数を評価
- 注文数が増加傾向にあれば実装着手
- この設計メモを基に詳細設計・実装を開始

---

**更新日**: 2025-10-14  
**担当**: E4 (Integrations Engineer)  
**レビュー**: 次回M2マイルストーン時に再評価

