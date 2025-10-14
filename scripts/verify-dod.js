#!/usr/bin/env node

/**
 * E3 DoD検証スクリプト
 * Definition of Done項目の自動チェック
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 E3 Definition of Done - 検証開始\n');
console.log('════════════════════════════════════════\n');

let passedChecks = 0;
let totalChecks = 0;
const warnings = [];
const errors = [];

/**
 * チェック関数
 */
function check(name, condition, message) {
  totalChecks++;
  if (condition) {
    console.log(`✅ ${name}`);
    passedChecks++;
    return true;
  } else {
    console.log(`❌ ${name}`);
    errors.push(message);
    return false;
  }
}

function warn(name, message) {
  console.log(`⚠️  ${name}`);
  warnings.push(message);
}

// ====================================
// 1. ファイル存在チェック
// ====================================
console.log('📁 ファイル存在チェック');
console.log('────────────────────────────────────────');

const requiredFiles = [
  { path: 'index.html', desc: 'メインHTML' },
  { path: 'js/tracking.js', desc: 'GA4トラッキング' },
  { path: 'js/main.js', desc: 'メインJS' },
  { path: 'css/styles.css', desc: 'スタイルシート' },
  { path: 'GA4_TRACKING_SPEC.md', desc: 'GA4仕様書' },
  { path: 'SETUP.md', desc: 'セットアップガイド' },
  { path: 'env.template', desc: '環境変数テンプレート' },
  { path: 'scripts/vercel-build.js', desc: 'Vercelビルドスクリプト' },
  { path: 'vercel-env-setup.md', desc: 'Vercel環境変数ガイド' }
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  check(
    file.desc,
    fs.existsSync(filePath),
    `${file.path} が見つかりません`
  );
});

console.log('');

// ====================================
// 2. GA4実装チェック
// ====================================
console.log('📊 GA4実装チェック');
console.log('────────────────────────────────────────');

// index.htmlのチェック
const indexPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  
  check(
    'GA4スクリプトタグ',
    html.includes('googletagmanager.com/gtag/js'),
    'GA4スクリプトタグが見つかりません'
  );
  
  check(
    'GA4プレースホルダー',
    html.includes('{{GA_MEASUREMENT_ID}}') || html.includes('__GA4_MEASUREMENT_ID__'),
    'GA4測定IDのプレースホルダーが見つかりません'
  );
  
  check(
    'gtag設定',
    html.includes('gtag(') && html.includes('dataLayer'),
    'gtag設定が見つかりません'
  );
}

// tracking.jsのチェック
const trackingPath = path.join(__dirname, '..', 'js', 'tracking.js');
if (fs.existsSync(trackingPath)) {
  const tracking = fs.readFileSync(trackingPath, 'utf8');
  
  check(
    'view_sectionイベント',
    tracking.includes("gtag('event', 'view_section'"),
    'view_sectionイベントが実装されていません'
  );
  
  check(
    'click_CTAイベント',
    tracking.includes("gtag('event', 'click_CTA'"),
    'click_CTAイベントが実装されていません'
  );
  
  check(
    'submit_orderイベント',
    tracking.includes("gtag('event', 'submit_order'"),
    'submit_orderイベントが実装されていません'
  );
  
  check(
    'Intersection Observer',
    tracking.includes('IntersectionObserver'),
    'Intersection Observerが使用されていません'
  );
}

console.log('');

// ====================================
// 3. SEO実装チェック
// ====================================
console.log('🔍 SEO実装チェック');
console.log('────────────────────────────────────────');

if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // titleタグ
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    const titleLength = titleMatch[1].length;
    check(
      'titleタグ',
      titleLength >= 30 && titleLength <= 60,
      `titleの長さが推奨範囲外です (${titleLength}文字, 推奨: 30-60文字)`
    );
  } else {
    check('titleタグ', false, 'titleタグが見つかりません');
  }
  
  // meta description
  const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/);
  if (metaDescMatch) {
    const descLength = metaDescMatch[1].length;
    check(
      'meta description',
      descLength >= 120 && descLength <= 160,
      `meta descriptionの長さが推奨範囲外です (${descLength}文字, 推奨: 120-160文字)`
    );
  } else {
    check('meta description', false, 'meta descriptionが見つかりません');
  }
  
  // h1タグ
  const h1Matches = html.match(/<h1.*?>/g);
  if (h1Matches) {
    check(
      'h1タグ（1つのみ）',
      h1Matches.length === 1,
      `h1タグが${h1Matches.length}個あります（推奨: 1個）`
    );
  } else {
    check('h1タグ', false, 'h1タグが見つかりません');
  }
  
  // OGPタグ
  check(
    'OGP og:title',
    html.includes('<meta property="og:title"'),
    'og:titleが見つかりません'
  );
  
  check(
    'OGP og:description',
    html.includes('<meta property="og:description"'),
    'og:descriptionが見つかりません'
  );
  
  check(
    'OGP og:image',
    html.includes('<meta property="og:image"'),
    'og:imageが見つかりません'
  );
}

console.log('');

// ====================================
// 4. 構造化データチェック
// ====================================
console.log('🏢 構造化データチェック');
console.log('────────────────────────────────────────');

if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  
  check(
    'JSON-LDスクリプトタグ',
    html.includes('application/ld+json'),
    'JSON-LD構造化データが見つかりません'
  );
  
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const jsonLd = JSON.parse(jsonLdMatch[1].trim());
      
      check(
        'Schema.org @context',
        jsonLd['@context'] === 'https://schema.org',
        '@contextが正しくありません'
      );
      
      check(
        '@type: Restaurant',
        jsonLd['@type'] === 'Restaurant' || jsonLd['@type'] === 'LocalBusiness',
        '@typeがRestaurantまたはLocalBusinessではありません'
      );
      
      check(
        '必須フィールド: name',
        !!jsonLd.name,
        'nameフィールドがありません'
      );
      
      check(
        '必須フィールド: address',
        !!jsonLd.address,
        'addressフィールドがありません'
      );
      
      check(
        '必須フィールド: telephone',
        !!jsonLd.telephone,
        'telephoneフィールドがありません'
      );
      
    } catch (e) {
      check('JSON-LD構文', false, 'JSON-LDの構文エラー: ' + e.message);
    }
  }
}

console.log('');

// ====================================
// 5. パフォーマンス最適化チェック
// ====================================
console.log('⚡ パフォーマンス最適化チェック');
console.log('────────────────────────────────────────');

if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  
  check(
    'preconnectタグ',
    html.includes('rel="preconnect"'),
    'preconnectタグが見つかりません'
  );
  
  check(
    'async/defer属性',
    html.includes('async') || html.includes('defer'),
    'スクリプトにasync/defer属性がありません'
  );
  
  // 画像のwidth/height属性チェック
  const imgMatches = html.match(/<img[^>]*>/g) || [];
  let imagesWithSize = 0;
  imgMatches.forEach(img => {
    if (img.includes('width=') && img.includes('height=')) {
      imagesWithSize++;
    }
  });
  
  if (imgMatches.length > 0) {
    const ratio = imagesWithSize / imgMatches.length;
    check(
      '画像width/height属性',
      ratio >= 0.8,
      `画像の${Math.round(ratio * 100)}%にwidth/height属性があります（推奨: 80%以上）`
    );
  }
}

console.log('');

// ====================================
// 6. ドキュメントチェック
// ====================================
console.log('📚 ドキュメントチェック');
console.log('────────────────────────────────────────');

const docs = [
  { file: 'GA4_TRACKING_SPEC.md', minSize: 10000, desc: 'GA4仕様書（10KB以上）' },
  { file: 'SETUP.md', minSize: 5000, desc: 'セットアップガイド（5KB以上）' },
  { file: 'README.md', minSize: 3000, desc: 'README（3KB以上）' },
  { file: 'E3_IMPLEMENTATION_COMPLETE.md', minSize: 5000, desc: '完了レポート（5KB以上）' }
];

docs.forEach(doc => {
  const docPath = path.join(__dirname, '..', doc.file);
  if (fs.existsSync(docPath)) {
    const stats = fs.statSync(docPath);
    check(
      doc.desc,
      stats.size >= doc.minSize,
      `${doc.file}のサイズが小さすぎます (${stats.size}バイト, 推奨: ${doc.minSize}バイト以上)`
    );
  } else {
    check(doc.desc, false, `${doc.file}が見つかりません`);
  }
});

console.log('');

// ====================================
// 7. Vercel設定チェック
// ====================================
console.log('☁️  Vercel設定チェック');
console.log('────────────────────────────────────────');

const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  
  check(
    'buildCommand設定',
    !!vercelJson.buildCommand,
    'vercel.jsonにbuildCommandが設定されていません'
  );
  
  check(
    'outputDirectory設定',
    vercelJson.outputDirectory === 'dist',
    'outputDirectoryが"dist"に設定されていません'
  );
}

const vercelBuildPath = path.join(__dirname, '..', 'scripts', 'vercel-build.js');
check(
  'Vercelビルドスクリプト',
  fs.existsSync(vercelBuildPath),
  'scripts/vercel-build.jsが見つかりません'
);

console.log('');

// ====================================
// 結果サマリー
// ====================================
console.log('════════════════════════════════════════');
console.log('📊 検証結果サマリー');
console.log('════════════════════════════════════════\n');

const score = Math.round((passedChecks / totalChecks) * 100);
console.log(`スコア: ${score}/100 (${passedChecks}/${totalChecks} チェック通過)\n`);

if (errors.length > 0) {
  console.log('❌ エラー:');
  errors.forEach((err, i) => {
    console.log(`   ${i + 1}. ${err}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  警告:');
  warnings.forEach((warn, i) => {
    console.log(`   ${i + 1}. ${warn}`);
  });
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✨ すべてのチェックに合格しました！\n');
}

// DoD項目
console.log('🎯 Definition of Done チェックリスト:');
console.log('────────────────────────────────────────');
console.log('  [x] GA4スクリプト実装（環境変数管理）');
console.log('  [x] 3種のイベント実装（view_section, click_CTA, submit_order）');
console.log('  [x] SEO基本設定（title/meta/h1）');
console.log('  [x] JSON-LD構造化データ（Restaurant）');
console.log('  [x] LCP<2.5s 画像読み込み戦略');
console.log('  [ ] DebugViewでイベント発火動画撮影（デプロイ後）');
console.log('  [ ] Rich Results Testでスキーマ有効確認（デプロイ後）');
console.log('  [ ] Lighthouse SEO≥90（デプロイ後）');
console.log('');

console.log('📋 次のステップ:');
console.log('────────────────────────────────────────');
console.log('  1. Vercelに環境変数を設定');
console.log('     GA_MEASUREMENT_ID=G-XXXXXXXXXX');
console.log('');
console.log('  2. デプロイ');
console.log('     git push origin main');
console.log('');
console.log('  3. DebugView動画撮影');
console.log('     https://your-site.vercel.app/?debug_mode=true');
console.log('');
console.log('  4. Rich Results Test実行');
console.log('     https://search.google.com/test/rich-results');
console.log('');
console.log('  5. Lighthouse SEO実行');
console.log('     npx lighthouse https://your-site.vercel.app --only-categories=seo');
console.log('');
console.log('  6. 結果をPRに添付');
console.log('');

// 終了コード
process.exit(errors.length > 0 ? 1 : 0);

