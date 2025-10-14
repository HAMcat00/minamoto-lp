# AZVELIA 静的ランディングページ

## 📋 プロジェクト概要

高パフォーマンスな静的LPの基盤プロジェクトです。

## 🎯 要件

- **Branch Protection**: main保護、PR必須、2 Approvals
- **CI/CD**: Vercel自動デプロイ（main=Prod, PR=Preview）
- **Performance**: Lighthouse Performance Score ≥ 90

## 🏗️ プロジェクト構造

```
源/
├── index.html          # メインHTML
├── style.css           # スタイルシート
├── main.js             # JavaScript
├── public/
│   └── images/         # 画像ファイル
├── docs/               # ドキュメント
├── .github/
│   ├── pull_request_template.md
│   └── CODEOWNERS
└── README.md
```

## 🚀 セットアップ手順

### 1. GitHub Repository作成

```bash
# Gitリポジトリの初期化
git init
git add .
git commit -m "Initial commit: Project structure"

# GitHubにプッシュ（リポジトリ作成後）
git remote add origin https://github.com/YOUR_USERNAME/azvelia.git
git branch -M main
git push -u origin main
```

### 2. Branch Protection設定

GitHubリポジトリで以下を設定：
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. 以下を有効化：
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 2
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 3. Vercel連携

1. [Vercel](https://vercel.com)にログイン
2. "Add New Project" → GitHubリポジトリを選択
3. Framework Preset: Other
4. Build Settings:
   - Build Command: (空欄)
   - Output Directory: (空欄)
5. Deploy

**自動設定される内容：**
- main branch → Production環境
- Pull Request → Preview環境（自動生成URL）

### 4. CODEOWNERS設定

リポジトリの Settings → Code and automation → Collaborators でレビュアーを追加

## 📊 パフォーマンス目標

- Lighthouse Performance: ≥ 90
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

## 🔧 開発フロー

1. feature branchを作成
2. 変更を実装
3. PRを作成（Preview URLが自動生成）
4. Lighthouse スコアを確認
5. 2名のApprovalを取得
6. mainへマージ → 本番自動デプロイ

## 📝 ライセンス

© 2025 AZVELIA. All rights reserved.

