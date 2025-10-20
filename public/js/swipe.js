/**
 * AZVELIA LP - Swipe UI Controller
 * スワイプUI制御とイベント管理
 */

(function() {
  'use strict';

  /**
   * CTAボタンのクリックイベント
   */
  function initCTA() {
    document.querySelectorAll('.cta').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const slide = e.target.closest('.slide');
        const pos = e.target.dataset.pos;
        
        // Analytics記録
        if (window.MINA_EVT) {
          window.MINA_EVT.cta(slide?.id, pos);
        }
        
        // LINE遷移
        const lineUrl = window.CONFIG?.LINE_URL || '';
        const search = location.search || '';
        location.href = lineUrl + search;
      });
    });
  }

  /**
   * ドットナビゲーションの初期化
   */
  function initDots() {
    const slides = [...document.querySelectorAll('.slide')];
    const dotsContainer = document.getElementById('dots');
    
    if (!dotsContainer) return;
    
    // ドットを生成
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `slide ${i + 1}`);
      dot.addEventListener('click', () => {
        slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });
    
    return [...dotsContainer.children];
  }

  /**
   * Intersection Observerでスライド表示を監視
   */
  function initObserver() {
    const slides = [...document.querySelectorAll('.slide')];
    const dotBtns = initDots();
    
    if (!dotBtns) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        
        if (entry.isIntersecting) {
          // セクション進入記録
          if (window.MINA_EVT) {
            window.MINA_EVT.markEnter(id);
          }
          
          // ドット更新
          const index = slides.indexOf(entry.target);
          dotBtns.forEach((btn, i) => {
            btn.setAttribute('aria-current', i === index ? 'true' : 'false');
          });
        } else {
          // セクション離脱記録
          if (window.MINA_EVT) {
            window.MINA_EVT.markLeave(id);
          }
        }
      });
    }, {
      root: document.querySelector('#swipe'),
      threshold: 0.6
    });
    
    // 全スライドを監視
    slides.forEach(slide => observer.observe(slide));
  }

  /**
   * スワイプ方向の検出
   */
  function initSwipeDetection() {
    let prevScrollLeft = 0;
    const swipeContainer = document.getElementById('swipe');
    
    if (!swipeContainer) return;
    
    // スクロール中
    swipeContainer.addEventListener('scroll', () => {
      const scrollLeft = swipeContainer.scrollLeft;
      const dir = scrollLeft > prevScrollLeft ? 'right' : 'left';
      prevScrollLeft = scrollLeft;
    });
    
    // スクロール終了時
    swipeContainer.addEventListener('scrollend', () => {
      const scrollLeft = swipeContainer.scrollLeft;
      const clientWidth = swipeContainer.clientWidth;
      const index = Math.round(scrollLeft / clientWidth);
      const dir = (scrollLeft - prevScrollLeft) > 0 ? 'right' : 'left';
      
      // スワイプ記録
      if (window.MINA_EVT) {
        window.MINA_EVT.swipe(dir, index);
      }
    });
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[Swipe] Initializing...');
    
    initCTA();
    initObserver();
    initSwipeDetection();
    
    console.log('[Swipe] Initialization complete');
  }

  // DOMContentLoaded または即時実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバル公開
  window.SwipeUI = {
    init,
    version: '1.0.0'
  };

})();

