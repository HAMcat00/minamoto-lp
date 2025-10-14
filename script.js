// ========================================
// グローバル変数
// ========================================
const state = {
  cls: 0,
  stickyCTAVisibleTime: 0,
  stickyCTATotalTime: 0,
  observers: new Map()
};

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 源LP - Frontend UI 初期化開始');
  
  initIntersectionObserver();
  initStickyCTA();
  initFAQ();
  initSmoothScroll();
  initCTATracking();
  measurePerformance();
  
  console.log('✅ 初期化完了');
  logDeviceInfo();
});

// ========================================
// IntersectionObserver によるスクロールFade
// ========================================
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 遅延をつけてアニメーション開始
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 50);
        
        // パフォーマンス最適化：一度表示されたら監視を解除
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // .fade-in クラスを持つ全要素を監視
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(element => {
    observer.observe(element);
  });
  
  state.observers.set('fadeIn', observer);
  console.log(`📊 IntersectionObserver: ${fadeElements.length}個の要素を監視開始`);
}

// ========================================
// Sticky CTA の表示制御
// ========================================
function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('section-02');
  const ctaSection = document.getElementById('section-11');
  
  if (!stickyCTA || !heroSection || !ctaSection) {
    console.warn('⚠️ Sticky CTA関連の要素が見つかりません');
    return;
  }

  let ticking = false;
  let lastVisibilityState = false;
  let visibilityStartTime = null;

  const checkStickyCTAVisibility = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    const ctaTop = ctaSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // ヒーローセクションを過ぎて、かつCTAセクションが見えていない時に表示
    const shouldBeVisible = heroBottom < 0 && ctaTop > windowHeight;

    if (shouldBeVisible !== lastVisibilityState) {
      if (shouldBeVisible) {
        stickyCTA.classList.add('is-visible');
        visibilityStartTime = Date.now();
        console.log('👁️ Sticky CTA: 表示');
      } else {
        stickyCTA.classList.remove('is-visible');
        if (visibilityStartTime) {
          const visibleDuration = Date.now() - visibilityStartTime;
          state.stickyCTAVisibleTime += visibleDuration;
          visibilityStartTime = null;
        }
        console.log('👁️ Sticky CTA: 非表示');
      }
      lastVisibilityState = shouldBeVisible;
    }

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(checkStickyCTAVisibility);
      ticking = true;
    }
  };

  // スクロールイベント（throttle処理）
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // 初回チェック
  checkStickyCTAVisibility();
  
  // 定期的に視認率を計算
  setInterval(() => {
    state.stickyCTATotalTime = Date.now() - performance.timing.navigationStart;
    const visibilityRate = state.stickyCTATotalTime > 0 
      ? (state.stickyCTAVisibleTime / state.stickyCTATotalTime) * 100 
      : 0;
    
    if (visibilityRate > 0) {
      console.log(`👁️ Sticky CTA 視認率: ${visibilityRate.toFixed(2)}%`);
    }
  }, 10000); // 10秒ごと

  console.log('✅ Sticky CTA 初期化完了');
}

// ========================================
// FAQ アコーディオン（改善版）
// ========================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  if (faqQuestions.length === 0) {
    console.warn('⚠️ FAQ要素が見つかりません');
    return;
  }

  faqQuestions.forEach((question, index) => {
    question.addEventListener('click', function(e) {
      e.preventDefault();
      const faqItem = this.closest('.faq__item');
      const isActive = faqItem.classList.contains('is-active');

      // 他の開いているFAQを閉じる（オプション：1つだけ開く仕様）
      // アコーディオン動作をする場合は以下のコメントを外す
      /*
      document.querySelectorAll('.faq__item.is-active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('is-active');
        }
      });
      */

      // 現在のFAQをトグル
      faqItem.classList.toggle('is-active');
      
      // アクセシビリティ対応
      const answer = faqItem.querySelector('.faq__answer');
      const isNowActive = faqItem.classList.contains('is-active');
      this.setAttribute('aria-expanded', isNowActive);
      answer.setAttribute('aria-hidden', !isNowActive);
      
      console.log(`FAQ ${index + 1}: ${isNowActive ? '開く' : '閉じる'}`);
    });

    // アクセシビリティ属性の初期化
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('role', 'button');
    const answer = question.parentElement.querySelector('.faq__answer');
    if (answer) {
      answer.setAttribute('aria-hidden', 'true');
    }
  });

  console.log(`✅ FAQ アコーディオン: ${faqQuestions.length}個を初期化`);
}

// ========================================
// スムーズスクロール
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // ハッシュのみのリンクは無視
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // ヘッダーとSticky CTAの高さを考慮したオフセット
        const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
        const offset = headerHeight + 20;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        console.log(`🔗 スムーズスクロール: ${targetId}へ移動`);
      }
    });
  });
  
  console.log('✅ スムーズスクロール 初期化完了');
}

// ========================================
// CTA クリックトラッキング
// ========================================
function initCTATracking() {
  const ctaButtons = document.querySelectorAll('[data-cta]');
  
  if (ctaButtons.length === 0) {
    console.warn('⚠️ CTAボタンが見つかりません');
    return;
  }

  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ctaId = this.getAttribute('data-cta');
      const ctaText = this.textContent.trim();
      
      console.log(`🎯 CTA クリック: ${ctaId} - "${ctaText}"`);
      
      // GA4イベント送信（GA4が実装されている場合）
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': ctaId,
          'event_value': ctaText,
          'value': 1
        });
        console.log('📊 GA4イベント送信: cta_click');
      }

      // データレイヤーへのプッシュ（GTM使用時）
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'cta_click',
          'cta_id': ctaId,
          'cta_text': ctaText
        });
        console.log('📊 DataLayer プッシュ: cta_click');
      }

      // LINEへの遷移（実装例）
      // この部分は実際のLINE公式アカウントURLに置き換える
      // window.location.href = 'https://line.me/R/ti/p/@yourlineaccount';
      
      // 開発環境用のアラート（本番では削除）
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        alert(`CTA「${ctaId}」がクリックされました。\n\n実際の実装では、LINE遷移やフォーム表示などを行います。`);
      }
    });
  });

  console.log(`✅ CTA トラッキング: ${ctaButtons.length}個のボタンを監視`);
}

// ========================================
// パフォーマンス測定
// ========================================
function measurePerformance() {
  // CLS測定
  measureCLS();
  
  // LCP測定
  measureLCP();
  
  // ページ読み込み完了時の測定
  window.addEventListener('load', () => {
    measurePageLoad();
    measureStickyCTAVisibility();
  });
  
  // ページを離れる時の最終レポート
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendFinalReport();
    }
  });
  
  console.log('✅ パフォーマンス測定 開始');
}

// ========================================
// CLS（Cumulative Layout Shift）測定
// ========================================
function measureCLS() {
  let clsValue = 0;
  let clsEntries = [];

  if (!('PerformanceObserver' in window)) {
    console.warn('⚠️ PerformanceObserver がサポートされていません');
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }

      state.cls = clsValue;

      if (clsValue > 0) {
        console.log(`📊 CLS値: ${clsValue.toFixed(4)}`);
        
        if (clsValue > 0.1) {
          console.warn('⚠️ CLSが0.1を超えています！', {
            cls: clsValue,
            entries: clsEntries
          });
        } else {
          console.log('✅ CLS < 0.1 達成！');
        }
      }
    });

    if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
      observer.observe({ type: 'layout-shift', buffered: true });
      state.observers.set('cls', observer);
    } else {
      console.warn('⚠️ layout-shift がサポートされていません');
    }
  } catch (error) {
    console.error('❌ CLS測定エラー:', error);
  }
}

// ========================================
// LCP（Largest Contentful Paint）測定
// ========================================
function measureLCP() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
      
      console.log(`📊 LCP: ${lcpValue.toFixed(2)}ms`);
      
      if (lcpValue <= 2500) {
        console.log('✅ LCP ≤ 2.5s 達成！');
      } else if (lcpValue <= 4000) {
        console.warn('⚠️ LCPが2.5秒を超えています（要改善）');
      } else {
        console.error('❌ LCPが4秒を超えています（緊急改善必要）');
      }
    });

    if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      state.observers.set('lcp', observer);
    }
  } catch (error) {
    console.error('❌ LCP測定エラー:', error);
  }
}

// ========================================
// ページ読み込み時間測定
// ========================================
function measurePageLoad() {
  if (!window.performance || !window.performance.timing) {
    console.warn('⚠️ Navigation Timing API がサポートされていません');
    return;
  }

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;

  console.log('📊 パフォーマンス測定結果:');
  console.log(`  - ページ読み込み時間: ${pageLoadTime}ms`);
  console.log(`  - サーバー接続時間: ${connectTime}ms`);
  console.log(`  - レンダリング時間: ${renderTime}ms`);
  console.log(`  - DOMContentLoaded: ${domReady}ms`);

  // Web Vitalsの評価
  if (pageLoadTime < 3000) {
    console.log('✅ ページ読み込み速度: 良好');
  } else if (pageLoadTime < 5000) {
    console.warn('⚠️ ページ読み込み速度: 要改善');
  } else {
    console.error('❌ ページ読み込み速度: 緊急改善必要');
  }
}

// ========================================
// Sticky CTA 視認率測定
// ========================================
function measureStickyCTAVisibility() {
  const stickyCTA = document.getElementById('sticky-cta');
  if (!stickyCTA) return;

  let totalTime = 0;
  let visibleTime = 0;
  let startTime = Date.now();
  let lastCheck = startTime;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const now = Date.now();
      const elapsed = now - lastCheck;
      totalTime += elapsed;

      if (entry.isIntersecting && entry.target.classList.contains('is-visible')) {
        visibleTime += elapsed;
      }

      lastCheck = now;

      if (totalTime > 5000) { // 5秒以上経過したら計算
        const visibilityRate = totalTime > 0 ? (visibleTime / totalTime) * 100 : 0;
        
        console.log(`👁️ Sticky CTA 視認率: ${visibilityRate.toFixed(2)}%`);

        if (visibilityRate >= 95) {
          console.log('✅ Sticky CTA 視認率 95%以上達成！');
        }
      }
    });
  }, {
    threshold: [0, 0.5, 1]
  });

  observer.observe(stickyCTA);
  state.observers.set('stickyCTAVisibility', observer);
}

// ========================================
// 最終レポート送信
// ========================================
function sendFinalReport() {
  const now = Date.now();
  const sessionDuration = now - performance.timing.navigationStart;
  const visibilityRate = state.stickyCTATotalTime > 0 
    ? (state.stickyCTAVisibleTime / state.stickyCTATotalTime) * 100 
    : 0;

  const report = {
    cls: state.cls.toFixed(4),
    sessionDuration: Math.round(sessionDuration / 1000),
    stickyCTAVisibilityRate: visibilityRate.toFixed(2),
    timestamp: new Date().toISOString()
  };

  console.log('📊 最終レポート:', report);

  // GA4への送信
  if (typeof gtag !== 'undefined') {
    gtag('event', 'session_end', {
      'event_category': 'performance',
      'cls_value': report.cls,
      'session_duration': report.sessionDuration,
      'cta_visibility_rate': report.stickyCTAVisibilityRate
    });
    console.log('📊 GA4に最終レポート送信');
  }

  // BeaconAPIで送信（非同期、確実）
  if ('sendBeacon' in navigator) {
    const blob = new Blob([JSON.stringify(report)], { type: 'application/json' });
    // navigator.sendBeacon('/api/analytics', blob);
    console.log('📡 Beacon API準備完了（エンドポイント設定後に送信）');
  }
}

// ========================================
// デバイス情報ログ
// ========================================
function logDeviceInfo() {
  console.log('📱 デバイス情報:');
  console.log(`  - 画面幅: ${window.innerWidth}px`);
  console.log(`  - 画面高さ: ${window.innerHeight}px`);
  console.log(`  - デバイスピクセル比: ${window.devicePixelRatio}`);
  console.log(`  - User Agent: ${navigator.userAgent}`);
  console.log(`  - プラットフォーム: ${navigator.platform}`);
  console.log(`  - 言語: ${navigator.language}`);

  // 375px以下の警告
  if (window.innerWidth < 375) {
    console.warn('⚠️ 画面幅が375px未満です。レイアウトが崩れる可能性があります。');
    
    // 警告バナーの表示（オプション）
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #DD2C00;
      color: white;
      padding: 12px;
      text-align: center;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    warning.textContent = '⚠️ 画面幅が小さすぎます。375px以上の端末でご覧ください。';
    document.body.prepend(warning);
  } else {
    console.log('✅ 画面幅は375px以上です');
  }
}

// ========================================
// レスポンシブ画像の遅延読み込み
// ========================================
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
  
  if (lazyImages.length === 0) return;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
          console.log('🖼️ 画像を読み込み:', img.src);
        }
      });
    }, {
      rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
    state.observers.set('lazyLoad', imageObserver);
    console.log(`✅ 遅延読み込み: ${lazyImages.length}個の画像を監視`);
  } else {
    // フォールバック
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
    console.log('⚠️ IntersectionObserver非対応: 全画像を即座に読み込み');
  }
}

// 遅延読み込み初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoad);
} else {
  initLazyLoad();
}

// ========================================
// ユーティリティ関数
// ========================================

// スロットル関数
function throttle(func, wait) {
  let timeout;
  let lastRan;
  return function executedFunction(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if ((Date.now() - lastRan) >= wait) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  };
}

// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// エクスポート（必要に応じて）
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initIntersectionObserver,
    initStickyCTA,
    initFAQ,
    measurePerformance,
    throttle,
    debounce
  };
}

console.log('🎨 源LP - script.js 読み込み完了');
