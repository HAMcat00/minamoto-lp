/**
 * AZVELIA LP - 設定ファイル（サンプル）
 * 
 * 本番環境では config.js として配置し、実際の値を設定してください
 * config.js は .gitignore に追加し、リポジトリには含めないこと
 */

const CONFIG = {
  // ==================== LINE設定 ====================
  
  /**
   * LINE公式アカウントURL
   * 取得方法: LINE Official Account Manager → 設定 → アカウント設定 → LINE ID
   * 形式: https://line.me/R/ti/p/@YOUR_LINE_ID
   * 
   * 例: https://line.me/R/ti/p/@123abcde
   * 
   * 【重要】本番環境では必ず実際のLINE IDに置き換えてください
   */
  lineUrl: 'https://line.me/R/ti/p/@azvelia',
  
  /**
   * LINE Messaging API設定（Webhook実装時に使用）
   */
  lineMessagingApi: {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET'
  },
  
  // ==================== 計測パラメータ ====================
  
  /**
   * UTMパラメータ（GA4連携用）
   * 各値はGA4でキャンペーン分析に使用されます
   * 
   * utm_content は自動的に設定されます:
   * - hero: ヒーローセクションCTA
   * - qr-modal: QRモーダル内CTA
   * - sticky: 追従CTA
   */
  tracking: {
    utm_source: 'azvelia_lp',        // 流入元: LPサイト
    utm_medium: 'web',                // メディア: Web
    utm_campaign: 'order_2025_q4',   // キャンペーン: 2025年Q4
    utm_term: ''                      // キーワード（オプション）
  },
  
  // ==================== QRコード設定 ====================
  
  /**
   * QRコード生成API
   * デフォルト: Google Chart API（無料・認証不要）
   * 代替案: qrserver.com, QRCode.js（クライアント生成）
   */
  qrApi: 'https://chart.googleapis.com/chart',
  qrSize: 250,  // QRコードサイズ（px）
  
  // ==================== UI設定 ====================
  
  /**
   * 追従CTA表示タイミング
   * スクロール量がこの値を超えたら追従CTAを表示
   */
  stickyCtaThreshold: 500,  // 500px
  
  /**
   * モーダルアニメーション速度
   */
  modalAnimationDuration: 300,  // 300ms
  
  // ==================== Analytics設定 ====================
  
  /**
   * Google Analytics 4 測定ID
   * 取得方法: GA4管理画面 → データストリーム → 測定ID
   * 形式: G-XXXXXXXXXX
   */
  ga4MeasurementId: 'G-XXXXXXXXXX',
  
  /**
   * Google Tag Manager ID（オプション）
   * GTM経由でGA4を管理する場合
   * 形式: GTM-XXXXXXX
   */
  gtmId: 'GTM-XXXXXXX',
  
  // ==================== エラーハンドリング ====================
  
  /**
   * エラー時のフォールバック動作
   */
  errorHandling: {
    // LINE遷移失敗時の待機時間（ms）
    lineNavigationTimeout: 3000,
    
    // QRコード読み込み失敗時の代替画像
    qrFallbackImage: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect width=%22250%22 height=%22250%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 text-anchor=%22middle%22 dy=%22.3em%22%3EQRコード読み込みエラー%3C/text%3E%3C/svg%3E',
    
    // エラーアラートメッセージ
    errorMessages: {
      lineNotFound: 'LINEアプリを開けませんでした。\n\nLINEアプリがインストールされているか確認してください。\nまたは、ブラウザで「AZVELIA」を検索してLINE公式アカウントを追加してください。',
      qrLoadFailed: 'QRコードの読み込みに失敗しました。\nもう一度お試しください。',
      networkError: 'ネットワークエラーが発生しました。\nインターネット接続を確認してください。'
    }
  },
  
  // ==================== デバッグ設定 ====================
  
  /**
   * デバッグモード
   * true: コンソールログ出力、詳細エラー表示
   * false: 本番モード（エラーログのみ）
   */
  debug: false,
  
  /**
   * トラッキングログ保存件数（localStorage）
   */
  maxTrackingLogs: 50,
  
  // ==================== 環境設定 ====================
  
  /**
   * 環境識別
   * development: 開発環境
   * staging: ステージング環境
   * production: 本番環境
   */
  environment: 'production'
};

// Node.js環境（Webhook等）での使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// ブラウザ環境での使用
if (typeof window !== 'undefined') {
  window.AZVELIA_CONFIG = CONFIG;
}

