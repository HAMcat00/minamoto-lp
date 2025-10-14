/**
 * メインJavaScript
 * UI/UXインタラクション
 */

(function() {
  'use strict';

  /**
   * 追従CTAボタンの表示制御
   */
  function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    
    if (!stickyCTA || !heroSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyCTA.classList.remove('visible');
        } else {
          stickyCTA.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroSection);
  }

  /**
   * スムーススクロール
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
          e.preventDefault();
          openReservationModal();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * 予約モーダルの制御
   */
  function initReservationModal() {
    const modal = document.getElementById('reservation-modal');
    const closeBtn = modal?.querySelector('.modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
  }

  /**
   * 予約モーダルを開く
   */
  function openReservationModal() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[Main] Initializing...');
    
    initStickyCTA();
    initSmoothScroll();
    initReservationModal();
    
    console.log('[Main] Initialization complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MainApp = {
    openReservationModal,
    version: '1.0.0'
  };

})();
