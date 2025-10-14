// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initIntersectionObserver();
  initStickyCTA();
  initFAQ();
  initCTATracking();
  measureCLS();
});

// ========================================
// IntersectionObserver によるスクロールFade
// ========================================
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // 10%表示されたらトリガー
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
}

// ========================================
// Sticky CTA の表示制御
// ========================================
function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('section-02');
  const ctaSection = document.getElementById('section-11');
  
  if (!stickyCTA || !heroSection || !ctaSection) return;

  let ticking = false;

  const checkStickyCTAVisibility = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    const ctaTop = ctaSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // ヒーローセクションを過ぎて、かつCTAセクションが見えていない時に表示
    if (heroBottom < 0 && ctaTop > windowHeight) {
      stickyCTA.classList.add('visible');
    } else {
      stickyCTA.classList.remove('visible');
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
}

// ========================================
// FAQ アコーディオン
// ========================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');

      // 他の開いているFAQを閉じる（オプション）
      // document.querySelectorAll('.faq-item.active').forEach(item => {
      //   if (item !== faqItem) {
      //     item.classList.remove('active');
      //   }
      // });

      // 現在のFAQをトグル
      faqItem.classList.toggle('active');
    });
  });
}

// ========================================
// CTA クリックトラッキング
// ========================================
function initCTATracking() {
  const ctaButtons = document.querySelectorAll('[data-cta]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const ctaId = button.getAttribute('data-cta');
      
      // GA4イベント送信（GA4が実装されている場合）
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': ctaId,
          'value': 1
        });
      }

      // コンソールログ（開発用）
      console.log(`CTA clicked: ${ctaId}`);

      // LINEへの遷移（実装例）
      // window.location.href = 'https://line.me/R/ti/p/@yourlineaccount';
      
      // または、フォーム送信、モーダル表示など
      alert(`CTA「${ctaId}」がクリックされました。\n実際の実装では、LINE遷移やフォーム表示などを行います。`);
    });
  });
}

// ========================================
// CLS（Cumulative Layout Shift）測定
// ========================================
function measureCLS() {
  let clsValue = 0;
  let clsEntries = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // hadRecentInputがfalseの場合のみカウント（ユーザー操作による変更を除外）
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }

    // 開発環境でのログ出力
    if (clsValue > 0) {
      console.log('📊 CLS値:', clsValue.toFixed(4));
      
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

  // layout-shiftエントリーを監視
  if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
    observer.observe({ type: 'layout-shift', buffered: true });
  } else {
    console.warn('このブラウザはLayout Shift APIをサポートしていません。');
  }

  // ページを離れる時にCLS値を送信（本番環境用）
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // GA4やその他のアナリティクスに送信
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cls_measurement', {
          'event_category': 'performance',
          'event_label': 'CLS',
          'value': Math.round(clsValue * 1000) // 小数点3桁まで
        });
      }
    }
  });
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
  let lastVisibilityCheck = startTime;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const now = Date.now();
      const elapsed = now - lastVisibilityCheck;
      totalTime += elapsed;

      if (entry.isIntersecting) {
        visibleTime += elapsed;
      }

      lastVisibilityCheck = now;

      // 視認率を計算
      const visibilityRate = totalTime > 0 ? (visibleTime / totalTime) * 100 : 0;
      
      // デバッグログ
      console.log(`👁️ Sticky CTA 視認率: ${visibilityRate.toFixed(2)}%`);

      if (visibilityRate >= 95) {
        console.log('✅ Sticky CTA 視認率 95%以上達成！');
      }
    });
  }, {
    threshold: [0, 0.5, 1]
  });

  observer.observe(stickyCTA);

  // ページを離れる時に最終的な視認率を報告
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const finalRate = totalTime > 0 ? (visibleTime / totalTime) * 100 : 0;
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'sticky_cta_visibility', {
          'event_category': 'engagement',
          'event_label': 'visibility_rate',
          'value': Math.round(finalRate)
        });
      }

      console.log(`📊 最終 Sticky CTA 視認率: ${finalRate.toFixed(2)}%`);
    }
  });
}

// ページ読み込み完了後に視認率測定を開始
window.addEventListener('load', () => {
  measureStickyCTAVisibility();
});

// ========================================
// パフォーマンス監視
// ========================================
window.addEventListener('load', () => {
  // LCP（Largest Contentful Paint）測定
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime, 'ms');
    
    if ((lastEntry.renderTime || lastEntry.loadTime) <= 2500) {
      console.log('✅ LCP ≤ 2.5s 達成！');
    } else {
      console.warn('⚠️ LCPが2.5秒を超えています！');
    }
  });

  if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  // Navigation Timing API でページ読み込み時間を測定
  if (window.performance && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log('📊 パフォーマンス測定結果:');
    console.log(`  - ページ読み込み時間: ${pageLoadTime}ms`);
    console.log(`  - サーバー接続時間: ${connectTime}ms`);
    console.log(`  - レンダリング時間: ${renderTime}ms`);
  }
});

// ========================================
// スムーズスクロール（ポリフィル不要のネイティブ実装）
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // ハッシュのみのリンクは無視
    if (href === '#') return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Sticky CTAの高さを考慮したオフセット
      const offset = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// レスポンシブ画像の遅延読み込み（LazyLoad）
// ========================================
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // フォールバック：IntersectionObserverがサポートされていない場合
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// 画像の遅延読み込み初期化
initLazyLoad();

// ========================================
// デバッグ情報（開発環境のみ）
// ========================================
console.log('🎨 源LP - Frontend UI 初期化完了');
console.log('📱 画面幅:', window.innerWidth, 'px');
console.log('📏 画面高さ:', window.innerHeight, 'px');
console.log('🌐 User Agent:', navigator.userAgent);

// 375px以下の警告
if (window.innerWidth < 375) {
  console.warn('⚠️ 画面幅が375px未満です。レイアウトが崩れる可能性があります。');
}

