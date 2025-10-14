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
        
        // ハッシュのみの場合はモーダルを表示
        if (href === '#') {
          e.preventDefault();
          openReservationModal();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
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

    // モーダルを閉じる
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // 背景クリックで閉じる
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }

    // ESCキーで閉じる
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
      
      // フォーカスを最初の入力欄に
      setTimeout(() => {
        const firstInput = modal.querySelector('input');
        firstInput?.focus();
      }, 100);
    }
  }

  /**
   * 画像の遅延読み込み
   * LCP対策：Intersection Observerを使用
   */
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
      // ネイティブのlazy loadingをサポートしている場合は何もしない
      return;
    }

    // サポートしていない場合はIntersection Observerを使用
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * ヘッダーのスクロール時の挙動
   */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // 上スクロールで表示、下スクロールで非表示
      if (currentScroll > lastScroll && currentScroll > 500) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }

      lastScroll = currentScroll;
    });
  }

  /**
   * フォームバリデーション
   */
  function initFormValidation() {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });
  }

  /**
   * フィールドバリデーション
   */
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'この項目は必須です';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '正しいメールアドレスを入力してください';
      }
    } else if (field.type === 'tel' && value) {
      const telRegex = /^[0-9-]+$/;
      if (!telRegex.test(value)) {
        isValid = false;
        errorMessage = '正しい電話番号を入力してください';
      }
    }

    // エラー表示
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup?.querySelector('.error-message');

    if (!isValid) {
      field.classList.add('error');
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup?.appendChild(errorElement);
      }
      errorElement.textContent = errorMessage;
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }

    return isValid;
  }

  /**
   * 日付選択の制限（過去日を選択不可に）
   */
  function initDatePicker() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    // 今日の日付を取得
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 明日以降のみ選択可能に
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);

    // 3ヶ月先までのみ選択可能に
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
  }

  /**
   * パフォーマンス計測（LCP、CLS、FID）
   * Web Vitalsのトラッキング
   */
  function initPerformanceTracking() {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.renderTime || lastEntry.loadTime;
          
          console.log('[Performance] LCP:', lcp.toFixed(2), 'ms');
          
          if (typeof gtag === 'function') {
            gtag('event', 'web_vitals', {
              'metric_name': 'LCP',
              'metric_value': lcp,
              'metric_rating': lcp < 2500 ? 'good' : lcp < 4000 ? 'needs_improvement' : 'poor'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            console.log('[Performance] FID:', fid.toFixed(2), 'ms');
            
            if (typeof gtag === 'function') {
              gtag('event', 'web_vitals', {
                'metric_name': 'FID',
                'metric_value': fid,
                'metric_rating': fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor'
              });
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('[Performance] CLS:', clsValue.toFixed(3));
          
          if (typeof gtag === 'function') {
            gtag('event', 'web_vitals', {
              'metric_name': 'CLS',
              'metric_value': clsValue,
              'metric_rating': clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (e) {
        console.error('Performance tracking error:', e);
      }
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
    initLazyLoading();
    initHeaderScroll();
    initFormValidation();
    initDatePicker();
    initPerformanceTracking();
    
    console.log('[Main] Initialization complete');
  }

  // DOMContentLoadedイベントで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバルスコープにエクスポート
  window.MainApp = {
    openReservationModal,
    version: '1.0.0'
  };

})();

