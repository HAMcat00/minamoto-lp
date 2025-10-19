#!/usr/bin/env node

/**
 * Vercelビルドスクリプト
 * 環境変数からGA4測定IDを取得してHTMLに注入
 * 
 * E3: Data & Tracking担当
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Vercel Build - 源LP');
console.log('════════════════════════════════════════\n');

// 環境変数取得
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log('📊 Environment:');
console.log(`   NODE_ENV: ${NODE_ENV}`);
console.log(`   GA4 ID: ${GA_MEASUREMENT_ID ? GA_MEASUREMENT_ID : '(not set)'}`);

// GA4測定IDのバリデーション
if (!GA_MEASUREMENT_ID) {
  console.error('\n❌ Error: GA_MEASUREMENT_ID environment variable is not set');
  console.error('   Please set it in Vercel dashboard > Settings > Environment Variables');
  process.exit(1);
}

if (!GA_MEASUREMENT_ID.startsWith('G-')) {
  console.warn('\n⚠️  Warning: GA_MEASUREMENT_ID does not start with "G-"');
  console.warn('   Expected format: G-XXXXXXXXXX');
}

console.log('\n✅ Environment variables validated');

// distディレクトリ作成
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// index.htmlの読み込み
const indexPath = path.join(__dirname, '..', 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('\n❌ Error: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// プレースホルダーの置換
const placeholders = [
  { pattern: '{{GA_MEASUREMENT_ID}}', name: '{{GA_MEASUREMENT_ID}}' },
  { pattern: '__GA4_MEASUREMENT_ID__', name: '__GA4_MEASUREMENT_ID__' }
];

let totalReplacements = 0;
placeholders.forEach(({ pattern, name }) => {
  const count = (html.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  html = html.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), GA_MEASUREMENT_ID);
  if (count > 0) {
    console.log(`✅ Replaced ${count} occurrence(s) of "${name}"`);
    totalReplacements += count;
  }
});

console.log(`✅ Total: ${totalReplacements} placeholder(s) replaced with GA4 ID`);

// 置換確認
if (html.includes('{{GA_MEASUREMENT_ID}}') || html.includes('__GA4_MEASUREMENT_ID__')) {
  console.warn('\n⚠️  Warning: Some placeholders may not have been replaced');
}

// HTMLの出力
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('✅ Built index.html with GA4 ID injected');

// ファイル・ディレクトリコピー関数
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    return false;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  return true;
};

// ディレクトリコピー
console.log('\n📦 Copying assets:');
const directories = ['css', 'js', 'images', 'public'];
let copiedDirs = 0;

directories.forEach(dir => {
  const srcPath = path.join(__dirname, '..', dir);
  const destPath = path.join(distDir, dir);
  
  if (copyDir(srcPath, destPath)) {
    console.log(`   ✅ ${dir}/`);
    copiedDirs++;
  }
});

// 静的ファイルコピー
const staticFiles = ['robots.txt', 'sitemap.xml', 'favicon.svg'];
let copiedFiles = 0;

staticFiles.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`   ✅ ${file}`);
    copiedFiles++;
  }
});

// ビルドサマリー
console.log('\n════════════════════════════════════════');
console.log('✨ Build Summary:');
console.log(`   HTML: 1 file built`);
console.log(`   Directories: ${copiedDirs} copied`);
console.log(`   Static files: ${copiedFiles} copied`);
console.log(`   Output: ${distDir}`);
console.log('════════════════════════════════════════\n');

console.log('🚀 Vercel build completed successfully!\n');
console.log('Next: Deploy will serve from dist/ directory\n');

// ビルド成功
process.exit(0);

