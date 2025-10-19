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
    const stickyCTA = document.getElementById('stickyCta');
    const heroSection = document.getElementById('section-02');
    
    if (!stickyCTA || !heroSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyCTA.classList.remove('is-visible');
        } else {
          stickyCTA.classList.add('is-visible');
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
   * QRモーダルの制御
   */
  function initQRModal() {
    const modal = document.getElementById('qrModal');
    const showBtn = document.getElementById('showQrBtn');
    const closeBtn = document.getElementById('closeQrBtn');

    if (showBtn) {
      showBtn.addEventListener('click', () => {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * FAQアコーディオンの制御
   */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('is-active');
          
          // 他のFAQを閉じる
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('is-active');
              otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
              otherItem.querySelector('.faq__answer').setAttribute('aria-hidden', 'true');
            }
          });
          
          // 現在のFAQを切り替え
          if (isActive) {
            item.classList.remove('is-active');
            question.setAttribute('aria-expanded', 'false');
            item.querySelector('.faq__answer').setAttribute('aria-hidden', 'true');
          } else {
            item.classList.add('is-active');
            question.setAttribute('aria-expanded', 'true');
            item.querySelector('.faq__answer').setAttribute('aria-hidden', 'false');
          }
        });
      }
    });
  }

  /**
   * 画像の遅延読み込み最適化
   */
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // フォールバック
      images.forEach(img => img.classList.add('loaded'));
    }
  }

  /**
   * スムーススクロールの最適化
   */
  function initSmoothScrollOptimized() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      });
    });
  }

  /**
   * キーボードナビゲーションの改善
   */
  function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESCキーでモーダルを閉じる
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.is-open');
        if (openModal) {
          openModal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      }
    });
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[Main] Initializing...');
    
    initStickyCTA();
    initSmoothScrollOptimized();
    initQRModal();
    initFAQ();
    initLazyLoading();
    initKeyboardNavigation();
    
    console.log('[Main] Initialization complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MainApp = {
    initStickyCTA,
    initQRModal,
    initFAQ,
    initLazyLoading,
    initKeyboardNavigation,
    version: '2.0.0'
  };

})();
