/**
 * 分析ダッシュボード
 * 完全無欠化のためのリアルタイム分析
 */

(function() {
  'use strict';

  /**
   * 分析データを収集
   */
  function collectAnalyticsData() {
    const data = {
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      scrollDepth: 0,
      timeOnPage: 0,
      ctaClicks: 0,
      modalOpens: 0,
      faqOpens: 0
    };

    // スクロール深度を追跡
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      data.scrollDepth = maxScrollDepth;
    });

    // 滞在時間を追跡
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      data.timeOnPage = Math.round((Date.now() - startTime) / 1000);
      saveAnalyticsData(data);
    });

    // CTAクリックを追跡
    document.addEventListener('click', (e) => {
      if (e.target.closest('[id^="lineCta"]')) {
        data.ctaClicks++;
        recordEvent('cta_click', {
          location: e.target.closest('[id^="lineCta"]').dataset.location,
          timestamp: Date.now()
        });
      }
    });

    // モーダル開閉を追跡
    document.addEventListener('click', (e) => {
      if (e.target.id === 'showQrBtn') {
        data.modalOpens++;
        recordEvent('modal_open', { timestamp: Date.now() });
      }
    });

    // FAQ開閉を追跡
    document.addEventListener('click', (e) => {
      if (e.target.closest('.faq__question')) {
        data.faqOpens++;
        recordEvent('faq_open', { 
          question: e.target.textContent.trim(),
          timestamp: Date.now()
        });
      }
    });

    return data;
  }

  /**
   * イベントを記録
   */
  function recordEvent(eventName, eventData) {
    const event = {
      name: eventName,
      data: eventData,
      timestamp: Date.now(),
      url: window.location.href
    };

    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(events));

    // GA4に送信
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    }
  }

  /**
   * 分析データを保存
   */
  function saveAnalyticsData(data) {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    sessions.push(data);
    
    // 最新100セッションのみ保持
    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }
    
    localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
  }

  /**
   * 分析レポートを生成
   */
  function generateReport() {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const abTestResults = window.ABTesting ? window.ABTesting.getTestResults() : null;

    const report = {
      summary: {
        totalSessions: sessions.length,
        totalEvents: events.length,
        averageTimeOnPage: calculateAverage(sessions, 'timeOnPage'),
        averageScrollDepth: calculateAverage(sessions, 'scrollDepth'),
        ctaClickRate: calculateCTAClickRate(sessions, events),
        modalOpenRate: calculateModalOpenRate(sessions, events),
        faqOpenRate: calculateFAQOpenRate(sessions, events)
      },
      deviceBreakdown: getDeviceBreakdown(sessions),
      trafficSources: getTrafficSources(sessions),
      topPages: getTopPages(sessions),
      abTestResults: abTestResults,
      recommendations: generateRecommendations(sessions, events, abTestResults)
    };

    return report;
  }

  /**
   * 平均値を計算
   */
  function calculateAverage(sessions, field) {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, session) => acc + (session[field] || 0), 0);
    return Math.round(sum / sessions.length);
  }

  /**
   * CTAクリック率を計算
   */
  function calculateCTAClickRate(sessions, events) {
    const ctaClicks = events.filter(e => e.name === 'cta_click').length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? ((ctaClicks / totalSessions) * 100).toFixed(2) + '%' : '0%';
  }

  /**
   * モーダル開封率を計算
   */
  function calculateModalOpenRate(sessions, events) {
    const modalOpens = events.filter(e => e.name === 'modal_open').length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? ((modalOpens / totalSessions) * 100).toFixed(2) + '%' : '0%';
  }

  /**
   * FAQ開封率を計算
   */
  function calculateFAQOpenRate(sessions, events) {
    const faqOpens = events.filter(e => e.name === 'faq_open').length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? ((faqOpens / totalSessions) * 100).toFixed(2) + '%' : '0%';
  }

  /**
   * デバイス別内訳を取得
   */
  function getDeviceBreakdown(sessions) {
    const devices = {};
    sessions.forEach(session => {
      const isMobile = /Mobile|Android|iPhone/i.test(session.userAgent);
      const device = isMobile ? 'Mobile' : 'Desktop';
      devices[device] = (devices[device] || 0) + 1;
    });
    return devices;
  }

  /**
   * トラフィックソースを取得
   */
  function getTrafficSources(sessions) {
    const sources = {};
    sessions.forEach(session => {
      const referrer = session.referrer || 'Direct';
      const source = referrer.includes('google') ? 'Google' :
                    referrer.includes('facebook') ? 'Facebook' :
                    referrer.includes('twitter') ? 'Twitter' :
                    referrer.includes('line') ? 'LINE' :
                    referrer === 'Direct' ? 'Direct' : 'Other';
      sources[source] = (sources[source] || 0) + 1;
    });
    return sources;
  }

  /**
   * トップページを取得
   */
  function getTopPages(sessions) {
    const pages = {};
    sessions.forEach(session => {
      const page = session.url.split('?')[0];
      pages[page] = (pages[page] || 0) + 1;
    });
    return Object.entries(pages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }

  /**
   * 改善提案を生成
   */
  function generateRecommendations(sessions, events, abTestResults) {
    const recommendations = [];

    // CTAクリック率が低い場合
    const ctaClickRate = parseFloat(calculateCTAClickRate(sessions, events));
    if (ctaClickRate < 5) {
      recommendations.push({
        type: 'cta_optimization',
        priority: 'high',
        message: 'CTAクリック率が低いです。ボタンのデザインや配置を見直してください。',
        action: 'CTAボタンの色、サイズ、配置を改善する'
      });
    }

    // スクロール深度が低い場合
    const avgScrollDepth = calculateAverage(sessions, 'scrollDepth');
    if (avgScrollDepth < 50) {
      recommendations.push({
        type: 'content_optimization',
        priority: 'medium',
        message: 'ユーザーのスクロール深度が低いです。コンテンツの魅力度を向上させてください。',
        action: 'ヒーローセクションの改善、画像の追加、ストーリーテリングの強化'
      });
    }

    // 滞在時間が短い場合
    const avgTimeOnPage = calculateAverage(sessions, 'timeOnPage');
    if (avgTimeOnPage < 30) {
      recommendations.push({
        type: 'engagement_optimization',
        priority: 'medium',
        message: '滞在時間が短いです。ユーザーの関心を引くコンテンツを追加してください。',
        action: 'インタラクティブ要素の追加、動画の活用、お客様の声の充実'
      });
    }

    // A/Bテスト結果に基づく提案
    if (abTestResults && abTestResults.summary) {
      Object.entries(abTestResults.summary).forEach(([testId, variants]) => {
        const bestVariant = Object.entries(variants)
          .sort(([,a], [,b]) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))[0];
        
        if (bestVariant) {
          recommendations.push({
            type: 'ab_test_optimization',
            priority: 'high',
            message: `A/Bテスト「${testId}」で「${bestVariant[0]}」が最も効果的です。`,
            action: `「${bestVariant[0]}」をデフォルトに設定する`
          });
        }
      });
    }

    return recommendations;
  }

  /**
   * ダッシュボードを表示
   */
  function showDashboard() {
    const report = generateReport();
    
    const dashboard = document.createElement('div');
    dashboard.id = 'analytics-dashboard';
    dashboard.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border: 2px solid #FF6B35;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 10000;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    dashboard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #FF6B35;">📊 分析ダッシュボード</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 10px;">📈 基本指標</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
          <div>セッション数: <strong>${report.summary.totalSessions}</strong></div>
          <div>平均滞在時間: <strong>${report.summary.averageTimeOnPage}秒</strong></div>
          <div>平均スクロール深度: <strong>${report.summary.averageScrollDepth}%</strong></div>
          <div>CTAクリック率: <strong>${report.summary.ctaClickRate}</strong></div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 10px;">📱 デバイス別</h4>
        <div style="font-size: 14px;">
          ${Object.entries(report.deviceBreakdown).map(([device, count]) => 
            `<div>${device}: ${count} (${Math.round(count/report.summary.totalSessions*100)}%)</div>`
          ).join('')}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 10px;">🎯 改善提案</h4>
        <div style="font-size: 12px;">
          ${report.recommendations.map(rec => 
            `<div style="background: ${rec.priority === 'high' ? '#ffebee' : '#e8f5e8'}; padding: 8px; margin: 4px 0; border-radius: 4px;">
              <strong>${rec.type}:</strong> ${rec.message}<br>
              <em>アクション: ${rec.action}</em>
            </div>`
          ).join('')}
        </div>
      </div>

      <div style="text-align: center;">
        <button onclick="window.AnalyticsDashboard.exportData()" style="background: #FF6B35; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          データをエクスポート
        </button>
      </div>
    `;

    document.body.appendChild(dashboard);
  }

  /**
   * データをエクスポート
   */
  function exportData() {
    const report = generateReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 初期化
   */
  function init() {
    console.log('[Analytics Dashboard] Initializing...');
    
    collectAnalyticsData();
    
    // 開発者モードでダッシュボードを表示
    if (window.location.search.includes('debug=1')) {
      setTimeout(showDashboard, 1000);
    }
    
    console.log('[Analytics Dashboard] Initialization complete');
  }

  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバルAPI
  window.AnalyticsDashboard = {
    generateReport,
    showDashboard,
    exportData,
    version: '1.0.0'
  };

})();
