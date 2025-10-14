# デプロイメントガイド

## 初回セットアップ

### 1. GitHubリポジトリ作成

#### 手順

1. [GitHub](https://github.com)にアクセス
2. "New repository"をクリック
3. リポジトリ情報を入力：
   - Repository name: `azvelia`（任意）
   - Description: "AZVELIA 静的ランディングページ"
   - Public or Private（任意）
   - **Initialize this repository with: 選択しない**
4. "Create repository"をクリック

#### ローカルからプッシュ

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# Gitリポジトリ初期化
git init

# 全ファイル追加
git add .

# 初回コミット
git commit -m "feat: Initial commit - Project structure and base files"

# リモート追加（GitHubのURLに置き換え）
git remote add origin https://github.com/YOUR_USERNAME/azvelia.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

### 2. Branch Protection設定

#### 手順

1. GitHubリポジトリページで **Settings** タブをクリック
2. 左メニューから **Branches** を選択
3. "Branch protection rules"セクションで **Add rule** をクリック
4. 以下を設定：

**Branch name pattern:**
```
main
```

**Protection rules:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **2**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
- ✅ **Require conversation resolution before merging**
- ✅ **Do not allow bypassing the above settings**

5. **Create** をクリック

### 3. Vercel連携

#### 手順

1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインイン
3. **Add New Project** をクリック
4. GitHubリポジトリを検索して **Import**
5. プロジェクト設定：

```
Framework Preset: Other
Build Command: (空欄)
Output Directory: (空欄)
Install Command: (空欄)
Root Directory: ./
```

6. **Deploy** をクリック

#### 環境設定確認

デプロイ後、以下を確認：
- Production: `https://azvelia.vercel.app`（または割り当てられたURL）
- Git Branch: `main`
- Pull Request: 自動でPreview環境生成

### 4. コラボレーター追加（CODEOWNERS用）

1. GitHubリポジトリで **Settings** → **Collaborators**
2. **Add people** をクリック
3. チームメンバーを追加：
   - E1（あなた）
   - FrontendDev
   - Designer

## 日常的なデプロイフロー

### Feature開発

```bash
# main最新化
git checkout main
git pull origin main

# feature branchを作成
git checkout -b feature/new-section

# 開発・コミット
git add .
git commit -m "feat: Add new hero section"

# プッシュ
git push origin feature/new-section
```

### Pull Request作成

1. GitHubでPRを作成
2. Vercelが自動でPreview URLを生成（コメントに表示）
3. Preview URLで動作確認
4. Lighthouse計測を実施

### Lighthouse計測

```bash
# Chrome DevToolsで実施
1. Preview URLにアクセス
2. F12で開発者ツールを開く
3. Lighthouseタブを選択
4. Categories: Performance, Accessibility, Best Practices, SEO
5. Device: Desktop & Mobile両方計測
6. "Analyze page load"をクリック

# Performance ≥ 90 を確認
```

### マージ

1. Lighthouse Score ≥ 90を確認
2. 2名のApprovalを取得
3. "Merge pull request"をクリック
4. Vercelが自動で本番デプロイ

## Vercel CLI（オプション）

### インストール

```bash
npm install -g vercel
```

### ローカルプレビュー

```bash
vercel dev
```

### 手動デプロイ（通常は不要）

```bash
# Preview環境
vercel

# Production環境
vercel --prod
```

## トラブルシューティング

### デプロイ失敗時

1. Vercelダッシュボードでログ確認
2. ビルドコマンドの確認
3. ファイルパスの大文字小文字確認

### Branch Protection回避不可時

- 管理者権限でも迂回不可の設定推奨
- 緊急時のみSettings → Branches → Editで一時解除

### Preview URL生成されない時

1. VercelのGitHub App権限確認
2. リポジトリ設定でVercel連携確認
3. Vercelプロジェクト設定でGit連携確認

## チェックリスト

### 初回セットアップ完了確認

- [ ] GitHubリポジトリ作成完了
- [ ] Branch Protection設定完了（2 Approvals必須）
- [ ] Vercel連携完了
- [ ] Production URL発行確認
- [ ] PR作成→Preview URL生成確認
- [ ] コラボレーター追加完了
- [ ] CODEOWNERS動作確認

### 各PR前の確認

- [ ] feature branchから作業
- [ ] Lighthouse Performance ≥ 90
- [ ] レスポンシブデザイン確認
- [ ] 不要なconsole.log削除
- [ ] PRテンプレート記入

---

**担当**: E1 (Lead Architect/Infra)
**最終更新**: 2025-10-14

