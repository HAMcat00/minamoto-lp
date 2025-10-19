/**
 * A/Bテスト機能
 * 完全無欠化のための継続的改善
 */

(function() {
  'use strict';

  /**
   * A/Bテスト設定
   */
  const AB_TEST_CONFIG = {
    // CTA文言テスト
    ctaText: {
      variants: [
        'LINEで今すぐ注文',
        '完全無欠の唐揚げを注文',
        'ワンコイン500円で注文',
        '30分で届く唐揚げを注文'
      ],
      testId: 'cta_text_2025_q4'
    },
    
    // ヒーロータイトルテスト
    heroTitle: {
      variants: [
        '完全無欠の唐揚げ弁当',
        '鶴ヶ島No.1の唐揚げ弁当',
        '現場男子の味方、唐揚げ弁当',
        '黄金色の完全無欠唐揚げ弁当'
      ],
      testId: 'hero_title_2025_q4'
    },
    
    // 価格表示テスト
    priceDisplay: {
      variants: [
        '¥500（税込・送料無料）',
        'ワンコイン500円・送料無料',
        '500円（送料込み）',
        'たった500円・送料無料'
      ],
      testId: 'price_display_2025_q4'
    }
  };

  /**
   * ユーザーIDを生成（localStorageベース）
   */
  function getUserId() {
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  }

  /**
   * バリアントを選択（ハッシュベース）
   */
  function selectVariant(testId, variants) {
    const userId = getUserId();
    const hash = hashCode(userId + testId);
    const index = Math.abs(hash) % variants.length;
    return variants[index];
  }

  /**
   * 文字列のハッシュ値を計算
   */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return hash;
  }

  /**
   * CTA文言のA/Bテスト
   */
  function initCTATextTest() {
    const config = AB_TEST_CONFIG.ctaText;
    const selectedText = selectVariant(config.testId, config.variants);
    
    // 全てのCTAボタンのテキストを更新
    const ctaButtons = document.querySelectorAll('[id^="lineCta"] span:last-child');
    ctaButtons.forEach(button => {
      if (button.textContent.includes('LINEで') || button.textContent.includes('注文')) {
        button.textContent = selectedText;
      }
    });
    
    // テスト結果を記録
    recordTestResult(config.testId, selectedText);
  }

  /**
   * ヒーロータイトルのA/Bテスト
   */
  function initHeroTitleTest() {
    const config = AB_TEST_CONFIG.heroTitle;
    const selectedTitle = selectVariant(config.testId, config.variants);
    
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      heroTitle.textContent = selectedTitle;
    }
    
    recordTestResult(config.testId, selectedTitle);
  }

  /**
   * 価格表示のA/Bテスト
   */
  function initPriceDisplayTest() {
    const config = AB_TEST_CONFIG.priceDisplay;
    const selectedPrice = selectVariant(config.testId, config.variants);
    
    const priceElements = document.querySelectorAll('.pricing-amount');
    priceElements.forEach(element => {
      if (element.textContent.includes('¥500')) {
        element.textContent = selectedPrice;
      }
    });
    
    recordTestResult(config.testId, selectedPrice);
  }

  /**
   * テスト結果を記録
   */
  function recordTestResult(testId, variant) {
    const testData = {
      testId: testId,
      variant: variant,
      timestamp: Date.now(),
      userId: getUserId(),
      url: window.location.href
    };
    
    // localStorageに保存
    const existingTests = JSON.parse(localStorage.getItem('ab_test_results') || '[]');
    existingTests.push(testData);
    localStorage.setItem('ab_test_results', JSON.stringify(existingTests));
    
    // GA4に送信（E3実装後）
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_view', {
        test_id: testId,
        variant: variant,
        user_id: getUserId()
      });
    }
  }

  /**
   * コンバージョンイベントを記録
   */
  function recordConversion(testId, variant) {
    const conversionData = {
      testId: testId,
      variant: variant,
      timestamp: Date.now(),
      userId: getUserId(),
      type: 'conversion'
    };
    
    const existingConversions = JSON.parse(localStorage.getItem('ab_test_conversions') || '[]');
    existingConversions.push(conversionData);
    localStorage.setItem('ab_test_conversions', JSON.stringify(existingConversions));
    
    // GA4に送信
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant: variant,
        user_id: getUserId()
      });
    }
  }

  /**
   * CTAクリック時のコンバージョン記録
   */
  function initConversionTracking() {
    document.addEventListener('click', (e) => {
      const ctaButton = e.target.closest('[id^="lineCta"]');
      if (ctaButton) {
        const testId = AB_TEST_CONFIG.ctaText.testId;
        const variant = ctaButton.querySelector('span:last-child')?.textContent;
        if (variant) {
          recordConversion(testId, variant);
        }
      }
    });
  }

  /**
   * テスト結果を取得
   */
  function getTestResults() {
    const results = JSON.parse(localStorage.getItem('ab_test_results') || '[]');
    const conversions = JSON.parse(localStorage.getItem('ab_test_conversions') || '[]');
    
    return {
      views: results,
      conversions: conversions,
      summary: generateSummary(results, conversions)
    };
  }

  /**
   * テスト結果のサマリーを生成
   */
  function generateSummary(views, conversions) {
    const summary = {};
    
    // テストIDごとに集計
    const testGroups = {};
    views.forEach(view => {
      if (!testGroups[view.testId]) {
        testGroups[view.testId] = { views: {}, conversions: {} };
      }
      testGroups[view.testId].views[view.variant] = (testGroups[view.testId].views[view.variant] || 0) + 1;
    });
    
    conversions.forEach(conversion => {
      if (testGroups[conversion.testId]) {
        testGroups[conversion.testId].conversions[conversion.variant] = (testGroups[conversion.testId].conversions[conversion.variant] || 0) + 1;
      }
    });
    
    // コンバージョン率を計算
    Object.keys(testGroups).forEach(testId => {
      summary[testId] = {};
      Object.keys(testGroups[testId].views).forEach(variant => {
        const viewCount = testGroups[testId].views[variant] || 0;
        const conversionCount = testGroups[testId].conversions[variant] || 0;
        summary[testId][variant] = {
          views: viewCount,
          conversions: conversionCount,
          conversionRate: viewCount > 0 ? (conversionCount / viewCount * 100).toFixed(2) + '%' : '0%'
        };
      });
    });
    
    return summary;
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[AB Testing] Initializing...');
    
    initCTATextTest();
    initHeroTitleTest();
    initPriceDisplayTest();
    initConversionTracking();
    
    console.log('[AB Testing] Initialization complete');
  }

  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバルAPI
  window.ABTesting = {
    getTestResults,
    generateSummary,
    recordConversion,
    version: '1.0.0'
  };

})();
