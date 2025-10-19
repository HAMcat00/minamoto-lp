#!/usr/bin/env node

/**
 * ビルドスクリプト
 * 環境変数をHTMLに埋め込んでdistディレクトリに出力
 */

const fs = require('fs');
const path = require('path');

// 環境変数の読み込み
require('dotenv').config();

console.log('🏗️  Building 源LP...\n');

// 環境変数の確認
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
const SITE_URL = process.env.SITE_URL || 'https://minamoto-kyoto.jp';
const LINE_OFFICIAL_URL = process.env.LINE_OFFICIAL_URL || '#';

if (!GA4_MEASUREMENT_ID) {
  console.warn('⚠️  Warning: GA4_MEASUREMENT_ID is not set in .env file');
  console.warn('   Tracking will not work properly.');
}

// distディレクトリの作成
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('✅ Created dist directory');
}

// index.htmlの読み込み
let html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// プレースホルダーの置換
html = html.replace(/__GA4_MEASUREMENT_ID__/g, GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX');
html = html.replace(/https:\/\/minamoto-kyoto\.jp/g, SITE_URL);

// HTMLの出力
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('✅ Built index.html');

// CSS、JSディレクトリのコピー
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Warning: ${src} directory not found, skipping...`);
    return;
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
};

// ディレクトリをコピー
['css', 'js', 'images'].forEach(dir => {
  const srcPath = path.join(__dirname, '..', dir);
  const destPath = path.join(distDir, dir);
  
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`✅ Copied ${dir}/ directory`);
  }
});

// ビルド情報の出力
console.log('\n📊 Build Information:');
console.log('─────────────────────────────────────');
console.log(`GA4 Measurement ID: ${GA4_MEASUREMENT_ID || '(not set)'}`);
console.log(`Site URL: ${SITE_URL}`);
console.log(`LINE URL: ${LINE_OFFICIAL_URL}`);
console.log(`Output Directory: ${distDir}`);
console.log('─────────────────────────────────────');

console.log('\n✨ Build completed successfully!\n');
console.log('Next steps:');
console.log('  1. Run "npm run preview" to preview the build');
console.log('  2. Run "npm run lighthouse" to check performance');
console.log('  3. Deploy to Vercel or your hosting platform\n');

