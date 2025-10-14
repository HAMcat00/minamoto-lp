# GA4イベントトラッキング仕様書

**プロジェクト:** 源LP  
**担当:** E3 (Data & Tracking)  
**バージョン:** 1.0.0  
**最終更新:** 2025-10-14

---

## 目次
1. [概要](#概要)
2. [実装イベント一覧](#実装イベント一覧)
3. [イベント詳細仕様](#イベント詳細仕様)
4. [計測設計](#計測設計)
5. [テスト手順](#テスト手順)
6. [KPI・目標値](#kpi目標値)

---

## 1. 概要

### 1.1 目的
源LP（ランディングページ）におけるユーザー行動を正確に計測し、CVR向上のためのデータドリブンな意思決定を支援する。

### 1.2 計測ツール
- **Google Analytics 4 (GA4)**
- 測定ID: `G-XXXXXXXXXX`（環境変数で管理）

### 1.3 実装ファイル
- `/js/tracking.js` - イベントトラッキングロジック
- `/index.html` - GA4スクリプト埋め込み

---

## 2. 実装イベント一覧

| # | イベント名 | カテゴリ | 優先度 | 実装状況 |
|---|-----------|---------|-------|---------|
| 1 | `view_section` | エンゲージメント | 高 | ✅ 完了 |
| 2 | `click_CTA` | コンバージョン | 最高 | ✅ 完了 |
| 3 | `submit_order` | コンバージョン | 最高 | ✅ 完了 |
| 4 | `scroll_depth` | エンゲージメント | 中 | ✅ 完了 |
| 5 | `web_vitals` | パフォーマンス | 中 | ✅ 完了 |
| 6 | `page_exit` | エンゲージメント | 低 | ✅ 完了 |
| 7 | `sticky_cta_view` | エンゲージメント | 中 | ✅ 完了 |

---

## 3. イベント詳細仕様

### 3.1 view_section（セクション表示）

#### 目的
ユーザーがどのセクションまで閲覧したかを計測し、コンテンツの効果を測定する。

#### トリガー条件
- セクションがビューポートに50%以上表示された時
- 各セクションにつき1回のみ発火

#### 実装方法
```javascript
// Intersection Observer使用
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !viewedSections.has(entry.target)) {
      gtag('event', 'view_section', {
        'section_name': sectionName,
        'section_id': entry.target.id,
        'timestamp': new Date().toISOString(),
        'viewport_width': window.innerWidth,
        'viewport_height': window.innerHeight
      });
    }
  });
}, { threshold: 0.5 });
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `section_name` | string | ✓ | セクション名 | "hero", "about", "menu" |
| `section_id` | string | ✓ | セクションのHTML ID | "hero", "about" |
| `timestamp` | string | ✓ | イベント発火時刻（ISO 8601） | "2025-10-14T10:30:00.000Z" |
| `viewport_width` | number | - | ビューポート幅（px） | 375, 1920 |
| `viewport_height` | number | - | ビューポート高さ（px） | 667, 1080 |

#### 対象セクション
- `hero` - メインビジュアル
- `about` - お店について
- `menu` - お品書き
- `reviews` - お客様の声
- `access` - アクセス

#### HTML実装
```html
<section id="hero" class="hero section-trackable" data-section-name="hero">
  <!-- コンテンツ -->
</section>
```

#### 期待される使い方
- ファネル分析: どのセクションで離脱が多いか
- コンテンツ効果測定: セクション到達率の比較
- A/Bテスト: セクション順序の最適化

---

### 3.2 click_CTA（CTAクリック）

#### 目的
ユーザーがどのCTAボタンをクリックしたかを計測し、CV導線の効果を測定する。

#### トリガー条件
- `.cta-button`クラスまたは`[data-cta-location]`属性を持つ要素がクリックされた時

#### 実装方法
```javascript
button.addEventListener('click', function(e) {
  gtag('event', 'click_CTA', {
    'cta_location': ctaLocation,
    'cta_text': ctaText,
    'cta_href': ctaHref,
    'timestamp': new Date().toISOString(),
    'page_url': window.location.href,
    'scroll_depth': Math.round((window.scrollY / totalHeight) * 100)
  });
});
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `cta_location` | string | ✓ | CTA設置場所 | "header", "hero", "sticky" |
| `cta_text` | string | ✓ | ボタンのテキスト | "LINE予約", "今すぐ予約する" |
| `cta_href` | string | - | リンク先URL | "https://lin.ee/XXX" |
| `timestamp` | string | ✓ | クリック時刻 | "2025-10-14T10:30:00.000Z" |
| `page_url` | string | ✓ | 現在のページURL | "https://minamoto-kyoto.jp/" |
| `scroll_depth` | number | - | クリック時のスクロール深度（%） | 25, 50, 75 |

#### CTA設置場所

| Location | 説明 | 要素 |
|----------|------|------|
| `header` | ヘッダーCTA | 固定ヘッダー内のボタン |
| `hero` | ヒーローCTA | ファーストビュー内のメインCTA |
| `menu` | メニューセクションCTA | お品書き下のCTA |
| `access` | アクセスセクションCTA | アクセス情報下のCTA |
| `sticky` | 追従CTA | スクロール時に表示される固定ボタン |

#### HTML実装
```html
<a href="https://lin.ee/XXX" class="cta-button" data-cta-location="hero">
  LINE予約はこちら
</a>
```

#### 期待される使い方
- CTA効果比較: どの位置のCTAが最もクリックされるか
- デザイン最適化: テキストや色の効果測定
- スクロール深度分析: どの深度でCTAがクリックされるか

---

### 3.3 submit_order（予約フォーム送信）

#### 目的
予約フォームの送信（コンバージョン）を計測し、CVRを追跡する。

#### トリガー条件
- 予約フォーム（`#reservation-form`）が送信された時
- バリデーション通過後

#### 実装方法
```javascript
reservationForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  gtag('event', 'submit_order', {
    'order_type': 'reservation',
    'reservation_date': formValues.date,
    'reservation_time': formValues.time,
    'guest_count': formValues.guests,
    'course_type': formValues.course,
    'has_message': !!formValues.message,
    'timestamp': new Date().toISOString(),
    'form_id': this.id,
    'value': getCourseValue(formValues.course),
    'currency': 'JPY'
  });
});
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `order_type` | string | ✓ | 注文種別 | "reservation" |
| `reservation_date` | string | ✓ | 予約日（YYYY-MM-DD） | "2025-10-20" |
| `reservation_time` | string | ✓ | 予約時間（HH:mm） | "18:00", "19:30" |
| `guest_count` | string | ✓ | 人数 | "2", "4", "6" |
| `course_type` | string | - | コース種別 | "kaiseki", "kaiseki-premium", "omakase" |
| `has_message` | boolean | - | メッセージ・要望の有無 | true, false |
| `timestamp` | string | ✓ | 送信時刻 | "2025-10-14T10:30:00.000Z" |
| `form_id` | string | ✓ | フォームID | "reservation-form" |
| `value` | number | - | 予約金額（円） | 8000, 12000, 15000 |
| `currency` | string | - | 通貨コード | "JPY" |

#### コース金額マッピング
```javascript
const courseValues = {
  'kaiseki': 8000,           // 懐石コース
  'kaiseki-premium': 12000,  // 会席コース
  'omakase': 15000           // おまかせコース
};
```

#### PII（個人情報）除外
**送信しないデータ:**
- 氏名（`name`）
- メールアドレス（`email`）
- 電話番号（`phone`）
- メッセージの内容（`message`の値）

**理由:** GDPRおよびプライバシー保護のため

#### 期待される使い方
- CVR計測: 訪問→予約のコンバージョン率
- 人気コース分析: どのコースが最も予約されるか
- 曜日・時間帯分析: 人気の予約時間帯
- eコマーストラッキング: 予約金額の集計

---

### 3.4 scroll_depth（スクロール深度）

#### 目的
ユーザーのページスクロール行動を計測し、コンテンツのエンゲージメントを測定する。

#### トリガー条件
- ページスクロール深度が25%, 50%, 75%, 100%に達した時
- 各深度につき1回のみ発火

#### 実装方法
```javascript
function checkScrollDepth() {
  const scrollPercent = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  
  depths.forEach(depth => {
    if (scrollPercent >= depth && !triggered.has(depth)) {
      gtag('event', 'scroll_depth', {
        'depth_percent': depth,
        'page_url': window.location.href,
        'timestamp': new Date().toISOString()
      });
      triggered.add(depth);
    }
  });
}
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `depth_percent` | number | ✓ | スクロール深度（%） | 25, 50, 75, 100 |
| `page_url` | string | ✓ | ページURL | "https://minamoto-kyoto.jp/" |
| `timestamp` | string | ✓ | 到達時刻 | "2025-10-14T10:30:00.000Z" |

#### 期待される使い方
- エンゲージメント測定: ページをどこまで読んでいるか
- 離脱ポイント特定: スクロール深度と離脱の相関
- コンテンツ長の最適化: 100%到達率の向上

---

### 3.5 web_vitals（Web Vitals）

#### 目的
Core Web Vitalsを計測し、ページパフォーマンスを監視する。

#### トリガー条件
- LCP（Largest Contentful Paint）計測完了時
- FID（First Input Delay）計測完了時
- CLS（Cumulative Layout Shift）計測完了時

#### 実装方法
```javascript
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  const lcp = lastEntry.renderTime || lastEntry.loadTime;
  
  gtag('event', 'web_vitals', {
    'metric_name': 'LCP',
    'metric_value': lcp,
    'metric_rating': lcp < 2500 ? 'good' : lcp < 4000 ? 'needs_improvement' : 'poor'
  });
});
lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `metric_name` | string | ✓ | メトリクス名 | "LCP", "FID", "CLS" |
| `metric_value` | number | ✓ | メトリクス値 | 2300（ms）, 0.05 |
| `metric_rating` | string | ✓ | 評価 | "good", "needs_improvement", "poor" |

#### 評価基準

| メトリクス | Good | Needs Improvement | Poor |
|-----------|------|-------------------|------|
| **LCP** | <2.5s | 2.5s - 4.0s | >4.0s |
| **FID** | <100ms | 100ms - 300ms | >300ms |
| **CLS** | <0.1 | 0.1 - 0.25 | >0.25 |

#### 期待される使い方
- パフォーマンス監視: リアルユーザーの体験計測
- 改善効果測定: 最適化施策の効果検証
- デバイス別分析: モバイル/デスクトップの比較

---

### 3.6 page_exit（ページ離脱）

#### 目的
ユーザーのページ滞在時間とスクロール深度を計測する。

#### トリガー条件
- ページ離脱時（`beforeunload`イベント）

#### 実装方法
```javascript
window.addEventListener('beforeunload', () => {
  const timeOnPage = Math.round((Date.now() - startTime) / 1000);
  
  const payload = new Blob([JSON.stringify({
    event: 'page_exit',
    time_on_page: timeOnPage,
    scroll_depth: Math.round((window.scrollY / totalHeight) * 100)
  })], { type: 'application/json' });
  
  navigator.sendBeacon(endpoint, payload);
});
```

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `time_on_page` | number | ✓ | ページ滞在時間（秒） | 45, 120, 300 |
| `scroll_depth` | number | ✓ | 離脱時のスクロール深度（%） | 35, 78 |

---

### 3.7 sticky_cta_view（追従CTA表示）

#### 目的
追従CTAボタンの表示回数を計測し、UI効果を測定する。

#### トリガー条件
- 追従CTA（`#sticky-cta`）がビューポートに表示された時
- ページにつき1回のみ発火

#### パラメータ

| パラメータ名 | 型 | 必須 | 説明 | 例 |
|------------|---|-----|------|---|
| `cta_type` | string | ✓ | CTAタイプ | "sticky" |
| `timestamp` | string | ✓ | 表示時刻 | "2025-10-14T10:30:00.000Z" |

---

## 4. 計測設計

### 4.1 ユーザーフロー
```
訪問
  ↓
[ページビュー] (自動)
  ↓
[view_section: hero] (ファーストビュー)
  ↓
スクロール
  ↓
[scroll_depth: 25%]
[view_section: about]
  ↓
[scroll_depth: 50%]
[view_section: menu]
  ↓
[click_CTA: menu] → LINE遷移（CVパス1）
  または
  ↓
スクロール継続
  ↓
[view_section: reviews]
[view_section: access]
  ↓
[scroll_depth: 75%]
  ↓
[click_CTA: sticky] → モーダル表示
  ↓
フォーム入力
  ↓
[submit_order] → コンバージョン達成（CVパス2）
```

### 4.2 コンバージョンファネル

| ステップ | イベント | 期待到達率 |
|---------|---------|-----------|
| 1. 訪問 | `page_view` | 100% |
| 2. エンゲージメント | `view_section: hero` | 100% |
| 3. スクロール | `scroll_depth: 25%` | 80% |
| 4. メニュー閲覧 | `view_section: menu` | 60% |
| 5. CTA表示 | `sticky_cta_view` | 50% |
| 6. CTAクリック | `click_CTA` | 20% |
| 7. フォーム送信 | `submit_order` | 10% |

**目標CVR: ≥10%**（訪問→予約）

### 4.3 セグメント設計

#### デバイス別
- モバイル（375px-767px）
- タブレット（768px-1199px）
- デスクトップ（1200px以上）

#### 流入元別
- オーガニック検索
- 有料広告（Google Ads）
- SNS（Instagram, Facebook, LINE）
- ダイレクト

#### 行動別
- ヒーローCTAクリック: 即座に興味あり（熱量高）
- スティッキーCTAクリック: 情報収集後（熱量中）
- フォーム送信: コンバージョン（成約）

---

## 5. テスト手順

### 5.1 DebugView確認手順

1. **DebugViewを有効化**
```
https://minamoto-kyoto.jp/?debug_mode=true
```

2. **Chrome DevToolsでの確認**
```javascript
// コンソールで確認
console.log('GA4 ID:', window.GA4_MEASUREMENT_ID);
console.log('GA4 Loaded:', typeof gtag === 'function');
```

3. **各イベントのテスト**

| テスト項目 | 操作 | 期待結果 |
|-----------|------|---------|
| view_section | ページをスクロール | DebugViewに各セクション名が表示 |
| click_CTA | CTAボタンをクリック | location, text, hrefパラメータ確認 |
| submit_order | フォームを送信 | date, time, guestsパラメータ確認 |
| scroll_depth | 25%までスクロール | depth_percent: 25 を確認 |

4. **ネットワークタブ確認**
   - DevTools > Network
   - Filter: `google-analytics.com/g/collect`
   - Status: 204（成功）

### 5.2 テストチェックリスト

#### 基本動作
- [ ] GA4スクリプトが読み込まれている
- [ ] `gtag`関数が定義されている
- [ ] `window.GA4_MEASUREMENT_ID`が設定されている
- [ ] コンソールエラーがない

#### イベント発火
- [ ] `view_section`が各セクション表示時に発火
- [ ] `click_CTA`が各CTAクリック時に発火
- [ ] `submit_order`がフォーム送信時に発火
- [ ] `scroll_depth`が25/50/75/100%で発火
- [ ] `web_vitals`がLCP/FID/CLS計測時に発火

#### パラメータ検証
- [ ] 各イベントに必須パラメータが含まれている
- [ ] PII（個人情報）が送信されていない
- [ ] タイムスタンプが正しいISO 8601形式
- [ ] 数値パラメータが適切な型

#### GA4管理画面
- [ ] DebugViewでイベントが表示される
- [ ] リアルタイムレポートでイベントが確認できる
- [ ] イベントパラメータが正しく記録されている

### 5.3 録画・スクリーンショット（DoD用）

**必須提出物:**
1. DebugViewでのイベント発火動画（1-2分）
2. 各イベントのパラメータスクリーンショット
3. Lighthouseスコアのスクリーンショット

**撮影手順:**
```bash
# Chromeで録画
1. DevTools > Console > 右上の⋮ > Start recording
2. ページを操作（スクロール、CTA クリック、フォーム送信）
3. GA4 DebugViewを開いて並べて表示
4. 録画停止してエクスポート
```

---

## 6. KPI・目標値

### 6.1 コンバージョン指標

| KPI | 目標値 | 計測方法 |
|-----|--------|---------|
| **CVR** | ≥10% | (submit_order / page_view) × 100 |
| **CTAクリック率** | ≥20% | (click_CTA / page_view) × 100 |
| **フォーム到達率** | ≥25% | (modal_open / page_view) × 100 |
| **フォーム完了率** | ≥50% | (submit_order / modal_open) × 100 |

### 6.2 エンゲージメント指標

| KPI | 目標値 | 計測方法 |
|-----|--------|---------|
| **離脱率** | ≤20% | (exit / page_view) × 100 |
| **平均滞在時間** | ≥90秒 | avg(time_on_page) |
| **スクロール到達率（100%）** | ≥40% | (scroll_depth:100 / page_view) × 100 |
| **メニュー到達率** | ≥60% | (view_section:menu / page_view) × 100 |

### 6.3 パフォーマンス指標

| KPI | 目標値 | 計測方法 |
|-----|--------|---------|
| **LCP** | <2.5s | web_vitals (metric_name=LCP, rating=good) |
| **FID** | <100ms | web_vitals (metric_name=FID, rating=good) |
| **CLS** | <0.1 | web_vitals (metric_name=CLS, rating=good) |
| **Lighthouse Performance** | ≥90 | Lighthouse CI |
| **Lighthouse SEO** | ≥90 | Lighthouse CI |

### 6.4 レポート頻度

| レポート | 頻度 | 内容 |
|---------|------|------|
| リアルタイム監視 | 常時 | GA4リアルタイムレポート |
| 日次レポート | 毎日 | CVR, CTAクリック率, 離脱率 |
| 週次レポート | 毎週月曜 | 詳細分析、改善提案 |
| 月次レポート | 毎月1日 | 月間サマリー、KPI達成状況 |

---

## 7. データプライバシー

### 7.1 GDPR・個人情報保護

#### 送信しないデータ（PII除外）
- 氏名
- メールアドレス
- 電話番号
- フリーテキストの内容（メッセージ欄）

#### 匿名化データのみ送信
- 予約日時（日付・時間）
- 人数（数値）
- コース種別（カテゴリ）
- 行動データ（クリック、スクロール）

### 7.2 Cookie同意
```javascript
gtag('config', window.GA4_MEASUREMENT_ID, {
  'send_page_view': true,
  'cookie_flags': 'SameSite=None;Secure'
});
```

### 7.3 データ保持期間
- GA4デフォルト: 2ヶ月
- カスタム設定: 14ヶ月（推奨）

---

## 8. 関連ドキュメント

- [SETUP.md](./SETUP.md) - セットアップガイド
- [PERFORMANCE_STRATEGY.md](./PERFORMANCE_STRATEGY.md) - パフォーマンス戦略
- [源LP_README_DoD.txt](./源LP_README_DoD.txt) - プロジェクト全体のDoD

---

## 9. 変更履歴

| バージョン | 日付 | 変更内容 | 担当 |
|-----------|------|---------|------|
| 1.0.0 | 2025-10-14 | 初版作成 | E3 |

---

## 10. 承認

| 役割 | 氏名 | 承認日 | サイン |
|-----|------|--------|--------|
| E3 (Data & Tracking) | | | |
| E1 (Lead Architect) | | | |
| プロジェクトマネージャー | | | |

---

**ドキュメント管理**  
- ファイルパス: `/GA4_TRACKING_SPEC.md`
- 最終更新: 2025-10-14
- 次回レビュー: 2025-11-14

