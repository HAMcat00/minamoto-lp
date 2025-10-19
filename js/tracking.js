/**
 * GA4イベントトラッキング
 * E3: Data & Tracking担当
 * 
 * 実装イベント:
 * 1. view_section - セクションが画面に表示された時
 * 2. click_CTA - CTAボタンがクリックされた時
 * 3. submit_order - 予約フォームが送信された時
 */

(function() {
  'use strict';

  // GA4が読み込まれているか確認
  function isGA4Loaded() {
    return typeof gtag === 'function' && window.GA4_MEASUREMENT_ID;
  }

  /**
   * 1. view_section イベント
   */
  function initSectionViewTracking() {
    const sections = document.querySelectorAll('.section-trackable');
    const viewedSections = new Set();

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !viewedSections.has(entry.target)) {
          const sectionName = entry.target.dataset.sectionName || entry.target.id || 'unknown';
          
          if (isGA4Loaded()) {
            gtag('event', 'view_section', {
              'section_name': sectionName,
              'section_id': entry.target.id,
              'timestamp': new Date().toISOString()
            });
          }

          console.log('[GA4] view_section:', sectionName);
          viewedSections.add(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  /**
   * 2. click_CTA イベント
   */
  function initCTAClickTracking() {
    const ctaButtons = document.querySelectorAll('.cta-button, [data-cta-location]');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ctaLocation = this.dataset.ctaLocation || 'unknown';
        const ctaText = this.textContent.trim();
        const ctaHref = this.getAttribute('href') || '';
        
        if (isGA4Loaded()) {
          gtag('event', 'click_CTA', {
            'cta_location': ctaLocation,
            'cta_text': ctaText,
            'cta_href': ctaHref,
            'timestamp': new Date().toISOString()
          });
        }

        console.log('[GA4] click_CTA:', { location: ctaLocation, text: ctaText });
      });
    });
  }

  /**
   * 3. submit_order イベント
   */
  function initFormSubmitTracking() {
    const reservationForm = document.getElementById('reservation-form');
    
    if (reservationForm) {
      reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        if (isGA4Loaded()) {
          gtag('event', 'submit_order', {
            'order_type': 'reservation',
            'reservation_date': formData.get('date'),
            'reservation_time': formData.get('time'),
            'guest_count': formData.get('guests'),
            'course_type': formData.get('course'),
            'timestamp': new Date().toISOString()
          });
        }

        console.log('[GA4] submit_order');
        alert('ご予約ありがとうございます！');
      });
    }
  }

  /**
   * 初期化
   */
  function init() {
    if (!isGA4Loaded()) {
      console.warn('[GA4] Not loaded. Tracking disabled.');
    } else {
      console.log('[GA4] Tracking initialized');
    }

    initSectionViewTracking();
    initCTAClickTracking();
    initFormSubmitTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GA4Tracking = {
    isLoaded: isGA4Loaded,
    version: '1.0.0'
  };

})();
