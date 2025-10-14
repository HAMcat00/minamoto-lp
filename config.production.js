/**
 * AZVELIA LP - 本番環境設定ファイル
 * 
 * ⚠️ 重要: このファイルは本番デプロイ前に必ず設定を確認してください
 * ⚠️ 機密情報を含むため、.gitignore に追加してください
 */

const CONFIG = {
  // ==================== LINE設定（本番） ====================
  
  /**
   * LINE公式アカウントURL（本番）
   * 
   * 【設定手順】
   * 1. LINE Official Account Manager にログイン
   * 2. 設定 → アカウント設定 → LINE ID を確認
   * 3. 以下の形式でURLを設定: https://line.me/R/ti/p/@YOUR_LINE_ID
   * 
   * 例: https://line.me/R/ti/p/@123abcde
   */
  lineUrl: 'https://line.me/R/ti/p/@azvelia',
  
  /**
   * LINE Messaging API設定（Webhook実装時に使用）
   * 現時点では不要（将来の拡張用）
   */
  lineMessagingApi: {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || ''
  },
  
  // ==================== 計測パラメータ（本番・最終版） ====================
  
  /**
   * UTMパラメータ（GA4連携用）
   * 
   * 【命名規則】
   * - utm_source: 流入元サイト名（小文字・アンダースコア区切り）
   * - utm_medium: メディアタイプ（web, social, email等）
   * - utm_campaign: キャンペーン名（年_四半期_目的）
   * - utm_content: コンテンツ配置場所（自動設定: hero/qr-modal/sticky）
   * 
   * 【GA4での分析】
   * - トラフィック獲得 → キャンペーン別
   * - イベント → line_cta_click でフィルタ
   * - utm_content でCTA配置別の効果測定
   */
  tracking: {
    utm_source: 'azvelia_lp',              // 流入元: AZVELIA LP
    utm_medium: 'web',                      // メディア: Webサイト
    utm_campaign: '2025_q4_karaage_order', // キャンペーン: 2025年Q4唐揚げ注文
    utm_term: '',                           // キーワード（検索広告用、現時点は空）
    // utm_content は自動設定されます:
    // - hero: ヒーローセクションCTA
    // - qr-modal: QRコードモーダル内CTA
    // - sticky: 追従CTA（スクロール後表示）
  },
  
  // ==================== QRコード設定 ====================
  
  /**
   * QRコード生成API
   * 
   * 【使用API】Google Chart API（無料・認証不要）
   * 【代替案】
   * - qrserver.com API
   * - QRCode.js（クライアントサイド生成）
   * - 静的QR画像（/public/images/qr-code.png）
   */
  qrApi: 'https://chart.googleapis.com/chart',
  qrSize: 250,  // QRコードサイズ（px）
  
  /**
   * QRコード用静的画像（オプション）
   * Google Chart API障害時のフォールバック
   */
  qrStaticImage: '/public/images/qr-placeholder.svg',
  
  // ==================== UI設定 ====================
  
  /**
   * 追従CTA表示タイミング
   * ユーザーがこのピクセル数スクロールしたら追従CTAを表示
   * 
   * 【推奨値】
   * - 500px: デフォルト（ファーストビュー通過後）
   * - 300px: 早めに表示（積極的）
   * - 800px: 遅めに表示（控えめ）
   */
  stickyCtaThreshold: 500,
  
  /**
   * モーダルアニメーション速度（ms）
   */
  modalAnimationDuration: 300,
  
  // ==================== Analytics設定 ====================
  
  /**
   * Google Analytics 4 測定ID（本番）
   * 
   * 【取得方法】
   * 1. GA4管理画面 → データストリーム
   * 2. Webストリーム選択
   * 3. 測定IDをコピー（G-XXXXXXXXXX形式）
   */
  ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  
  /**
   * Google Tag Manager ID（オプション）
   * GTM経由でGA4を管理する場合
   */
  gtmId: process.env.GTM_ID || '',
  
  // ==================== エラーハンドリング ====================
  
  /**
   * エラー時のフォールバック動作
   */
  errorHandling: {
    // LINE遷移失敗時の待機時間（ms）
    // iOS/Androidでアプリ起動を待つ時間
    lineNavigationTimeout: 3000,
    
    // QRコード読み込み失敗時の代替画像
    qrFallbackImage: '/public/images/qr-placeholder.svg',
    
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
   * 
   * 【本番環境】false（必須）
   * 【ステージング】true（推奨）
   * 【ローカル開発】true
   */
  debug: false,
  
  /**
   * トラッキングログ保存件数（localStorage）
   * 最新N件のみ保持してストレージ容量を節約
   */
  maxTrackingLogs: 50,
  
  // ==================== 環境設定 ====================
  
  /**
   * 環境識別
   * 
   * production: 本番環境
   * staging: ステージング環境
   * development: 開発環境
   */
  environment: 'production',
  
  /**
   * 本番ドメイン
   */
  productionDomain: 'https://azvelia.vercel.app',
  
  // ==================== セキュリティ設定 ====================
  
  /**
   * CORS設定（Webhook実装時に使用）
   */
  cors: {
    allowedOrigins: [
      'https://azvelia.vercel.app',
      'https://azvelia-staging.vercel.app'
    ]
  },
  
  /**
   * レート制限（将来の拡張用）
   */
  rateLimit: {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000
  }
};

// Node.js環境（Webhook等）での使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// ブラウザ環境での使用
if (typeof window !== 'undefined') {
  window.AZVELIA_CONFIG = CONFIG;
}

// 設定検証（開発時のみ）
if (CONFIG.debug && typeof console !== 'undefined') {
  console.log('[AZVELIA Config] Loaded:', {
    environment: CONFIG.environment,
    lineUrl: CONFIG.lineUrl,
    tracking: CONFIG.tracking,
    debug: CONFIG.debug
  });
}

