/**
 * AZVELIA LP - E4 Integration Module
 * LINE導線・QRコード・計測パラメータ管理
 */

// ==================== 設定 ====================
const CONFIG = {
  // LINE公式アカウントURL
  // 本番環境では実際のLINE公式アカウントURLに置き換えてください
  // 例: 'https://line.me/R/ti/p/@123abcde'
  lineUrl: 'https://line.me/R/ti/p/@azvelia',
  
  // 計測パラメータ設定（GA4連携用）
  tracking: {
    utm_source: 'azvelia_lp',          // 流入元: LPサイト
    utm_medium: 'web',                  // メディア: Web
    utm_campaign: 'order_2025_q4',     // キャンペーン: 2025年Q4注文キャンペーン
    utm_term: '',                       // キーワード（オプション）
    // utm_content は CTA配置場所により動的に設定: hero / qr-modal / sticky
  },
  
  // QRコード生成API（Google Chart API使用）
  qrApi: 'https://chart.googleapis.com/chart',
  qrSize: 250,
  
  // 追従CTA表示タイミング（スクロール量：px）
  stickyCtaThreshold: 500
};

// ==================== ユーティリティ ====================

/**
 * URLパラメータを構築
 * @param {string} location - CTA配置場所
 * @returns {string} パラメータ付きURL
 */
function buildLineUrl(location) {
  const params = new URLSearchParams({
    ...CONFIG.tracking,
    utm_content: location,
    timestamp: Date.now(),
    ref: location
  });
  
  const separator = CONFIG.lineUrl.includes('?') ? '&' : '?';
  return `${CONFIG.lineUrl}${separator}${params.toString()}`;
}

/**
 * QRコード画像URLを生成
 * @param {string} url - エンコードするURL
 * @returns {string} QRコード画像URL
 */
function generateQrCodeUrl(url) {
  const params = new URLSearchParams({
    cht: 'qr',
    chs: `${CONFIG.qrSize}x${CONFIG.qrSize}`,
    chl: url,
    choe: 'UTF-8'
  });
  
  return `${CONFIG.qrApi}?${params.toString()}`;
}

/**
 * イベント計測（GA4連携用）
 * @param {string} eventName - イベント名
 * @param {object} eventParams - イベントパラメータ
 */
function trackEvent(eventName, eventParams = {}) {
  // GA4が実装されている場合
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
  
  // コンソールログ（開発・デバッグ用）
  console.log('[Tracking Event]', eventName, eventParams);
  
  // localStorage に記録（実機テスト用）
  const logs = JSON.parse(localStorage.getItem('azvelia_tracking_logs') || '[]');
  logs.push({
    timestamp: new Date().toISOString(),
    event: eventName,
    params: eventParams
  });
  localStorage.setItem('azvelia_tracking_logs', JSON.stringify(logs.slice(-50))); // 最新50件のみ保持
}

/**
 * エラーハンドリング・代替導線
 * @param {string} location - CTA配置場所
 */
function handleLineError(location) {
  trackEvent('line_cta_error', {
    location: location,
    error_type: 'navigation_failed'
  });
  
  // 代替導線：アラート表示
  alert('LINEアプリを開けませんでした。\n\nLINEアプリがインストールされているか確認してください。\nまたは、ブラウザで「AZVELIA」を検索してLINE公式アカウントを追加してください。');
}

// ==================== LINE CTA ====================

/**
 * LINE CTAクリック処理
 * @param {string} location - CTA配置場所
 */
function handleLineCtaClick(location) {
  const lineUrl = buildLineUrl(location);
  
  // 計測イベント送信
  trackEvent('line_cta_click', {
    location: location,
    url: lineUrl,
    device_type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
  });
  
  try {
    // iOS/Androidの判定
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isIOS || isAndroid) {
      // モバイル：LINEアプリで開く
      window.location.href = lineUrl;
      
      // フォールバック：3秒後にエラー処理（アプリが開かなかった場合）
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          handleLineError(location);
        }
      }, 3000);
    } else {
      // デスクトップ：新しいタブで開く
      const newWindow = window.open(lineUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        handleLineError(location);
      }
    }
  } catch (error) {
    console.error('[LINE CTA Error]', error);
    handleLineError(location);
  }
}

// ==================== QRコードモーダル ====================

/**
 * QRコードモーダルを表示
 */
function showQrModal() {
  const modal = document.getElementById('qrModal');
  const qrContainer = document.getElementById('qrCodeContainer');
  
  // LINE URL生成
  const lineUrl = buildLineUrl('qr-modal');
  
  // QRコード画像生成
  const qrImageUrl = generateQrCodeUrl(lineUrl);
  qrContainer.innerHTML = `
    <img src="${qrImageUrl}" 
         alt="LINE QRコード" 
         width="${CONFIG.qrSize}" 
         height="${CONFIG.qrSize}"
         loading="lazy"
         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect width=%22250%22 height=%22250%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 text-anchor=%22middle%22 dy=%22.3em%22%3EQRコード読み込みエラー%3C/text%3E%3C/svg%3E';" />
  `;
  
  // モーダル表示
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  
  // 計測イベント
  trackEvent('qr_modal_open', {
    qr_url: lineUrl
  });
  
  // ボディスクロール無効化
  document.body.style.overflow = 'hidden';
}

/**
 * QRコードモーダルを閉じる
 */
function closeQrModal() {
  const modal = document.getElementById('qrModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  
  // ボディスクロール有効化
  document.body.style.overflow = '';
  
  // 計測イベント
  trackEvent('qr_modal_close');
}

// ==================== 追従CTA ====================

/**
 * 追従CTAの表示/非表示制御
 */
function handleStickyCtaVisibility() {
  const stickyCta = document.getElementById('stickyCta');
  const scrollY = window.scrollY || window.pageYOffset;
  
  if (scrollY > CONFIG.stickyCtaThreshold) {
    if (!stickyCta.classList.contains('visible')) {
      stickyCta.classList.add('visible');
      stickyCta.setAttribute('aria-hidden', 'false');
      trackEvent('sticky_cta_show', {
        scroll_position: scrollY
      });
    }
  } else {
    if (stickyCta.classList.contains('visible')) {
      stickyCta.classList.remove('visible');
      stickyCta.setAttribute('aria-hidden', 'true');
    }
  }
}

// ==================== 初期化 ====================

/**
 * イベントリスナー設定
 */
function initEventListeners() {
  // LINE CTAボタン
  const lineCtaButtons = ['lineCta', 'lineCtaQr', 'lineCtaSticky'];
  lineCtaButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const location = btn.getAttribute('data-location') || 'unknown';
        handleLineCtaClick(location);
      });
    }
  });
  
  // QRコード表示ボタン
  const showQrBtn = document.getElementById('showQrBtn');
  if (showQrBtn) {
    showQrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showQrModal();
    });
  }
  
  // QRコードモーダル閉じるボタン
  const closeQrBtn = document.getElementById('closeQrBtn');
  if (closeQrBtn) {
    closeQrBtn.addEventListener('click', closeQrModal);
  }
  
  // モーダル背景クリックで閉じる
  const qrModal = document.getElementById('qrModal');
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        closeQrModal();
      }
    });
  }
  
  // ESCキーでモーダル閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('qrModal');
      if (modal && modal.classList.contains('active')) {
        closeQrModal();
      }
    }
  });
  
  // スクロールイベント（追従CTA）
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleStickyCtaVisibility, 100);
  }, { passive: true });
}

/**
 * ページロード完了時の処理
 */
function init() {
  // イベントリスナー設定
  initEventListeners();
  
  // 初期表示時の追従CTA状態チェック
  handleStickyCtaVisibility();
  
  // ページビュー計測
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    user_agent: navigator.userAgent
  });
  
  console.log('[AZVELIA E4] Integration module initialized');
  console.log('[Tracking Logs] localStorage key: azvelia_tracking_logs');
}

// DOMContentLoaded後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==================== デバッグ用ユーティリティ ====================

/**
 * トラッキングログをコンソールに出力（開発者向け）
 */
window.showTrackingLogs = function() {
  const logs = JSON.parse(localStorage.getItem('azvelia_tracking_logs') || '[]');
  console.table(logs);
  return logs;
};

/**
 * トラッキングログをクリア（開発者向け）
 */
window.clearTrackingLogs = function() {
  localStorage.removeItem('azvelia_tracking_logs');
  console.log('[Tracking Logs] Cleared');
};

/**
 * 現在のLINE URLを確認（開発者向け）
 */
window.testLineUrl = function(location = 'test') {
  const url = buildLineUrl(location);
  console.log('[Test LINE URL]', url);
  return url;
};
