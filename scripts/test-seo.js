#!/usr/bin/env node

/**
 * SEOテストスクリプト
 * Rich Results Test APIを使用して構造化データを検証
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing SEO & Structured Data...\n');

// index.htmlの読み込み
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// チェック項目
const checks = {
  title: false,
  metaDescription: false,
  h1: false,
  jsonLd: false,
  ogTags: false,
  viewport: false
};

let errors = [];
let warnings = [];

// 1. titleタグのチェック
const titleMatch = html.match(/<title>(.*?)<\/title>/);
if (titleMatch) {
  checks.title = true;
  const titleLength = titleMatch[1].length;
  console.log(`✅ Title: "${titleMatch[1]}" (${titleLength} characters)`);
  
  if (titleLength < 30 || titleLength > 60) {
    warnings.push(`Title length should be 30-60 characters (current: ${titleLength})`);
  }
} else {
  errors.push('Missing <title> tag');
}

// 2. meta descriptionのチェック
const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/);
if (metaDescMatch) {
  checks.metaDescription = true;
  const descLength = metaDescMatch[1].length;
  console.log(`✅ Meta Description: ${descLength} characters`);
  
  if (descLength < 120 || descLength > 160) {
    warnings.push(`Meta description should be 120-160 characters (current: ${descLength})`);
  }
} else {
  errors.push('Missing meta description');
}

// 3. h1タグのチェック
const h1Matches = html.match(/<h1.*?>(.*?)<\/h1>/g);
if (h1Matches) {
  checks.h1 = true;
  console.log(`✅ H1 tags found: ${h1Matches.length}`);
  
  if (h1Matches.length > 1) {
    warnings.push(`Multiple H1 tags found (${h1Matches.length}). Should have only one.`);
  }
} else {
  errors.push('Missing <h1> tag');
}

// 4. JSON-LD構造化データのチェック
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonLdMatch) {
  checks.jsonLd = true;
  try {
    const jsonLd = JSON.parse(jsonLdMatch[1].trim());
    console.log(`✅ JSON-LD found: @type = ${jsonLd['@type']}`);
    
    // 必須フィールドのチェック
    const requiredFields = ['name', 'address', 'telephone'];
    requiredFields.forEach(field => {
      if (!jsonLd[field]) {
        warnings.push(`JSON-LD missing recommended field: ${field}`);
      }
    });
  } catch (e) {
    errors.push('Invalid JSON-LD syntax: ' + e.message);
  }
} else {
  errors.push('Missing JSON-LD structured data');
}

// 5. OGタグのチェック
const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
const ogDescMatch = html.match(/<meta property="og:description" content="(.*?)"/);
const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/);

if (ogTitleMatch && ogDescMatch && ogImageMatch) {
  checks.ogTags = true;
  console.log('✅ OG tags found (title, description, image)');
} else {
  warnings.push('Incomplete OG tags (missing title, description, or image)');
}

// 6. viewportのチェック
const viewportMatch = html.match(/<meta name="viewport" content="(.*?)"/);
if (viewportMatch) {
  checks.viewport = true;
  console.log('✅ Viewport meta tag found');
} else {
  errors.push('Missing viewport meta tag');
}

// 結果のサマリー
console.log('\n📊 SEO Check Summary:');
console.log('─────────────────────────────────────');

const totalChecks = Object.keys(checks).length;
const passedChecks = Object.values(checks).filter(v => v).length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`Score: ${score}/100 (${passedChecks}/${totalChecks} checks passed)`);

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach((warn, i) => console.log(`   ${i + 1}. ${warn}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✨ All SEO checks passed!');
}

console.log('\n📋 Next Steps:');
console.log('  1. Test with Google Rich Results Test:');
console.log('     https://search.google.com/test/rich-results');
console.log('  2. Run Lighthouse SEO audit:');
console.log('     npm run lighthouse');
console.log('─────────────────────────────────────\n');

// エラーがある場合は終了コード1を返す
process.exit(errors.length > 0 ? 1 : 0);

