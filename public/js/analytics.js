/**
 * AZVELIA LP - Analytics Module
 * 離脱深掘り計測システム
 */

(function() {
  'use strict';

  // グローバル状態管理
  window.MINA = {
    seen: {},
    t0: performance.now(),
    last: null
  };

  const GA_ID = window.CONFIG?.GA_MEASUREMENT_ID;

  /**
   * GA4イベント送信
   * @param {string} name - イベント名
   * @param {object} params - イベントパラメータ
   */
  function send(name, params = {}) {
    if (!GA_ID || !window.gtag) {
      console.log('[Analytics] Event:', name, params);
      return;
    }
    window.gtag('event', name, params);
  }

  /**
   * セクション進入記録
   * @param {string} id - セクションID
   */
  function markEnter(id) {
    window.MINA.last = { id, at: performance.now() };
    send('view_section', { section_id: id });
    
    // 未表示セクションをマーク
    if (!window.MINA.seen[id]) {
      window.MINA.seen[id] = true;
    }
  }

  /**
   * セクション離脱記録
   * @param {string} id - セクションID
   */
  function markLeave(id) {
    if (!window.MINA.last || window.MINA.last.id !== id) return;
    
    const dur = Math.round(performance.now() - window.MINA.last.at);
    send('leave_section', { 
      section_id: id, 
      time_ms: dur 
    });
  }

  /**
   * CTAクリック記録
   * @param {string} name - セクション名
   * @param {string} pos - CTA位置
   */
  function cta(name, pos) {
    send('click_CTA', { 
      pos: pos || 'unknown', 
      section_id: name || window.MINA.last?.id 
    });
  }

  /**
   * スワイプ記録
   * @param {string} dir - スワイプ方向
   * @param {number} idx - スライドインデックス
   */
  function swipe(dir, idx) {
    send('swipe', { 
      direction: dir, 
      index: idx 
    });
  }

  // グローバル公開
  window.MINA_EVT = {
    send,
    markEnter,
    markLeave,
    cta,
    swipe
  };

  // ページ離脱時の記録
  window.addEventListener('beforeunload', () => {
    if (window.MINA.last) {
      markLeave(window.MINA.last.id);
      send('exit_page', { 
        last_section: window.MINA.last.id 
      });
    }
  });

  console.log('[Analytics] Module initialized', {
    GA_ID: GA_ID || 'not set',
    version: '1.0.0'
  });

})();

