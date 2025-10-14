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
   * セクションが画面に表示された時に発火
   * IntersectionObserverを使用してビューポートに入ったことを検知
   */
  function initSectionViewTracking() {
    const sections = document.querySelectorAll('.section-trackable');
    const viewedSections = new Set();

    // IntersectionObserverの設定
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // 50%以上表示されたら発火
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !viewedSections.has(entry.target)) {
          const sectionName = entry.target.dataset.sectionName || entry.target.id || 'unknown';
          
          // GA4イベント送信
          if (isGA4Loaded()) {
            gtag('event', 'view_section', {
              'section_name': sectionName,
              'section_id': entry.target.id,
              'timestamp': new Date().toISOString(),
              'viewport_width': window.innerWidth,
              'viewport_height': window.innerHeight
            });
          }

          // デバッグログ
          console.log('[GA4] view_section:', sectionName);
          
          viewedSections.add(entry.target);
        }
      });
    }, observerOptions);

    // 各セクションを監視
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * 2. click_CTA イベント
   * CTAボタンがクリックされた時に発火
   */
  function initCTAClickTracking() {
    // すべてのCTAボタンを取得
    const ctaButtons = document.querySelectorAll('.cta-button, [data-cta-location]');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ctaLocation = this.dataset.ctaLocation || 'unknown';
        const ctaText = this.textContent.trim();
        const ctaHref = this.getAttribute('href') || '';
        
        // GA4イベント送信
        if (isGA4Loaded()) {
          gtag('event', 'click_CTA', {
            'cta_location': ctaLocation,
            'cta_text': ctaText,
            'cta_href': ctaHref,
            'timestamp': new Date().toISOString(),
            'page_url': window.location.href,
            'scroll_depth': Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
          });
        }

        // デバッグログ
        console.log('[GA4] click_CTA:', {
          location: ctaLocation,
          text: ctaText,
          href: ctaHref
        });

        // LINEへの遷移の場合（E4との連携ポイント）
        if (ctaHref.includes('line.me') || ctaHref.includes('lin.ee')) {
          // UTMパラメータやトラッキングパラメータを追加
          const url = new URL(ctaHref);
          url.searchParams.set('utm_source', 'website');
          url.searchParams.set('utm_medium', 'cta');
          url.searchParams.set('utm_campaign', ctaLocation);
          
          // 遷移前に少し待機してイベントを確実に送信
          e.preventDefault();
          setTimeout(() => {
            window.location.href = url.toString();
          }, 300);
        }
      });
    });
  }

  /**
   * 3. submit_order イベント
   * 予約フォームが送信された時に発火
   */
  function initFormSubmitTracking() {
    const reservationForm = document.getElementById('reservation-form');
    
    if (reservationForm) {
      reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータを取得
        const formData = new FormData(this);
        const formValues = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          date: formData.get('date'),
          time: formData.get('time'),
          guests: formData.get('guests'),
          course: formData.get('course'),
          message: formData.get('message')
        };

        // GA4イベント送信（PII除外）
        if (isGA4Loaded()) {
          gtag('event', 'submit_order', {
            'order_type': 'reservation',
            'reservation_date': formValues.date,
            'reservation_time': formValues.time,
            'guest_count': formValues.guests,
            'course_type': formValues.course,
            'has_message': !!formValues.message,
            'timestamp': new Date().toISOString(),
            'form_id': this.id,
            'value': getCourseValue(formValues.course), // コースの金額
            'currency': 'JPY'
          });
        }

        // デバッグログ
        console.log('[GA4] submit_order:', {
          date: formValues.date,
          time: formValues.time,
          guests: formValues.guests,
          course: formValues.course
        });

        // フォーム送信処理（実際のAPIコールはE4が実装）
        submitReservation(formValues);
      });
    }
  }

  /**
   * コース金額を取得（eコマーストラッキング用）
   */
  function getCourseValue(course) {
    const courseValues = {
      'kaiseki': 8000,
      'kaiseki-premium': 12000,
      'omakase': 15000
    };
    return courseValues[course] || 0;
  }

  /**
   * 予約送信処理（モック）
   * 実際の実装はE4（Integrations）が担当
   */
  function submitReservation(formValues) {
    console.log('Submitting reservation:', formValues);
    
    // ローディング表示
    const submitButton = document.querySelector('#reservation-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;

    // モック送信（実際はAPI呼び出し）
    setTimeout(() => {
      alert('ご予約ありがとうございます！\n確認メールをお送りしましたので、ご確認ください。');
      
      // モーダルを閉じる
      const modal = document.getElementById('reservation-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      
      // フォームをリセット
      document.getElementById('reservation-form').reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 1500);
  }

  /**
   * スクロール深度トラッキング（追加機能）
   * 25%, 50%, 75%, 100%のスクロール深度を記録
   */
  function initScrollDepthTracking() {
    const depths = [25, 50, 75, 100];
    const triggered = new Set();
    
    function checkScrollDepth() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      depths.forEach(depth => {
        if (scrollPercent >= depth && !triggered.has(depth)) {
          if (isGA4Loaded()) {
            gtag('event', 'scroll_depth', {
              'depth_percent': depth,
              'page_url': window.location.href,
              'timestamp': new Date().toISOString()
            });
          }
          console.log('[GA4] scroll_depth:', depth + '%');
          triggered.add(depth);
        }
      });
    }
    
    // スクロールイベントをスロットリング
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(checkScrollDepth, 100);
    });
  }

  /**
   * ページ離脱前のトラッキング
   * セッション時間などを記録
   */
  function initExitTracking() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      if (isGA4Loaded() && navigator.sendBeacon) {
        // sendBeaconを使用して確実にデータを送信
        const payload = new Blob([JSON.stringify({
          event: 'page_exit',
          time_on_page: timeOnPage,
          scroll_depth: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
        })], { type: 'application/json' });
        
        navigator.sendBeacon(`https://www.google-analytics.com/mp/collect?measurement_id=${window.GA4_MEASUREMENT_ID}`, payload);
      }
    });
  }

  /**
   * 追従CTAの表示トラッキング
   */
  function initStickyCTATracking() {
    const stickyCTA = document.getElementById('sticky-cta');
    if (!stickyCTA) return;

    let isVisible = false;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const nowVisible = entry.isIntersecting;
        
        if (nowVisible !== isVisible) {
          isVisible = nowVisible;
          
          if (isVisible && isGA4Loaded()) {
            gtag('event', 'sticky_cta_view', {
              'cta_type': 'sticky',
              'timestamp': new Date().toISOString()
            });
            console.log('[GA4] sticky_cta_view');
          }
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(stickyCTA);
  }

  /**
   * 初期化
   * DOMContentLoadedで各トラッキング機能を有効化
   */
  function init() {
    if (!isGA4Loaded()) {
      console.warn('[GA4] Google Analytics 4 is not loaded. Tracking will be disabled.');
      // GA4が無くても機能は動作する
    } else {
      console.log('[GA4] Tracking initialized with ID:', window.GA4_MEASUREMENT_ID);
    }

    // 各トラッキング機能を初期化
    initSectionViewTracking();
    initCTAClickTracking();
    initFormSubmitTracking();
    initScrollDepthTracking();
    initExitTracking();
    initStickyCTATracking();
  }

  // DOMContentLoadedイベントで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバルスコープにエクスポート（デバッグ用）
  window.GA4Tracking = {
    isLoaded: isGA4Loaded,
    version: '1.0.0'
  };

})();

