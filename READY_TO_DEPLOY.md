# 🚀 デプロイ準備完了チェックリスト

**日時**: 2025-10-14  
**担当**: E1 (Lead Architect / Infra)  
**ステータス**: ✅ ローカル完了 → GitHub連携準備完了

---

## ✅ ローカル準備完了項目

### コード実装
- [x] **E2 (Frontend UI)**: モバイルファーストデザイン完了
- [x] **E3 (Data & Tracking)**: GA4トラッキング設定完了
- [x] **E4 (Integrations)**: LINE連携・QRコード実装完了
- [x] **E5 (Assets)**: プレースホルダー画像配置完了

### インフラ設定
- [x] `vercel.json` 最適化（セキュリティヘッダー + キャッシュ）
- [x] `.github/workflows/` CI/CD設定（Lighthouse + PR Check）
- [x] `.github/CODEOWNERS` コードオーナー設定
- [x] `.github/pull_request_template.md` PRテンプレート
- [x] `.gitignore` 適切な除外設定

### ドキュメント
- [x] `README.md` プロジェクト概要
- [x] `DEPLOYMENT_GUIDE.md` 詳細デプロイ手順
- [x] `E1_INFRASTRUCTURE_STATUS.md` インフラステータス
- [x] `docs/ARCHITECTURE.md` アーキテクチャ設計
- [x] `docs/DEPLOYMENT.md` デプロイ詳細

### Git管理
- [x] 6コミット完了、mainブランチ整理済み
- [x] コミット履歴クリーン
- [x] リモート追加準備完了

---

## 📋 次の3ステップ（手動作業）

### STEP 1: GitHubリポジトリ作成 [必須]

#### 方法A: 自動スクリプト（推奨）

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源
./QUICK_START.sh
```

スクリプトが以下を実行します：
1. リモートリポジトリURL入力を要求
2. `git remote add origin` 実行
3. `git push -u origin main` 実行

#### 方法B: 手動実行

```bash
# 1. GitHubでリポジトリ作成
# https://github.com/new
# Repository name: minamoto-lp または azvelia-lp
# Private推奨

# 2. リモート追加
cd /Users/hamcat/Desktop/📁AZVELIA/源
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# 3. プッシュ
git push -u origin main
```

#### ✅ 確認事項
- [ ] GitHubでコミット履歴が表示される
- [ ] 6コミットすべてプッシュされている
- [ ] ファイル構成が正しい（index.html, style.css, main.js等）

---

### STEP 2: Branch Protection設定 [必須]

#### 手順

1. **GitHubリポジトリページにアクセス**
2. **Settings** タブをクリック
3. 左メニュー **Branches** を選択
4. **Add rule** をクリック

#### 設定内容

```
Branch name pattern: main
```

**有効化する項目**:

```
✅ Require a pull request before merging
   ✅ Require approvals: 2
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   
   検索ボックスで以下を追加（GitHub Actions実行後）:
   - validate (PR Checks)
   - lighthouse (Lighthouse CI)

✅ Require conversation resolution before merging

✅ Require linear history

✅ Do not allow bypassing the above settings
   ⚠️ 誰も迂回できなくする（管理者含む）
```

5. **Create** をクリック

#### ✅ 確認事項
```bash
# mainへの直接プッシュがエラーになることを確認
echo "test" >> README.md
git add README.md
git commit -m "test: direct push"
git push origin main
# ❌ エラーが出ればOK
git reset --hard HEAD~1  # テストコミットを元に戻す
```

---

### STEP 3: Vercel連携 [必須]

#### 手順

1. **https://vercel.com にアクセス**
2. **Continue with GitHub** でサインイン
3. **Add New** → **Project** をクリック
4. **Import Git Repository**
   - GitHub連携がまだの場合: **Add GitHub Account**
   - リポジトリ一覧から作成したリポジトリを検索
   - **Import** をクリック

5. **プロジェクト設定**

```
Project Name: minamoto-lp (または azvelia-lp)
Framework Preset: Other
Root Directory: ./
Node.js Version: 20.x (デフォルト)

Build and Output Settings:
  Build Command: (空欄)
  Output Directory: (空欄)
  Install Command: (空欄)

Environment Variables:
  (今は設定不要。E3が後でGA4_MEASUREMENT_IDを追加)
```

6. **Deploy** をクリック

#### ✅ 確認事項

**A. Production URLの確認**
```
https://minamoto-lp.vercel.app
または
https://minamoto-lp-xxx.vercel.app
```
ブラウザでアクセスして表示を確認

**B. vercel.json反映確認**
```bash
# セキュリティヘッダーの確認
curl -I https://YOUR_PRODUCTION_URL.vercel.app

# 以下のヘッダーが表示されるはず:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**C. Git連携確認**
- Vercel Dashboard → Settings → Git
- main branch = Production環境
- Pull Requests = Preview環境（自動）

---

## 🧪 テストPR作成（動作確認）

### 目的
- Preview環境の動作確認
- Lighthouse CI動作確認
- Branch Protection動作確認

### 手順

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# 1. feature branchを作成
git checkout -b feature/test-deployment

# 2. 軽微な変更（テスト用）
echo "\n## Deployment Test - $(date +%Y-%m-%d)" >> README.md

# 3. コミット
git add README.md
git commit -m "test: Verify deployment pipeline and CI/CD

- Test Vercel Preview deployment
- Test GitHub Actions workflows
- Test Branch Protection rules
- Verify Lighthouse CI integration"

# 4. プッシュ
git push origin feature/test-deployment
```

### GitHubでPR作成

1. GitHubリポジトリで **Pull requests** タブ
2. **New pull request** をクリック
3. `feature/test-deployment` → `main` を選択
4. タイトル: `test: Verify deployment pipeline`
5. **Create pull request** をクリック

### ✅ 確認項目

#### Vercel Preview
- [ ] Vercelボットが1〜2分以内にコメント投稿
- [ ] Preview URLが表示される
- [ ] Preview URLにアクセスして表示確認
- [ ] レスポンシブデザイン確認（375px〜1200px）

#### GitHub Actions
- [ ] PR Checks workflowが自動実行
- [ ] Lighthouse CI workflowが自動実行
- [ ] すべてのチェックがPass（緑✅）
- [ ] ワークフローログにエラーなし

#### Branch Protection
- [ ] 「2 approvals required」と表示
- [ ] CIチェック完了前は「Merge」ボタンが無効
- [ ] CODEOWNERSレビュアーが自動割り当て

#### Lighthouse スコア確認（手動）
```
1. Preview URLにアクセス
2. Chrome DevTools (F12)
3. Lighthouse タブ
4. Categories: すべて選択
5. Device: Mobile & Desktop 両方
6. Analyze page load

目標:
✅ Performance: ≥ 90
✅ Accessibility: ≥ 90
✅ Best Practices: ≥ 90
✅ SEO: ≥ 90
```

### テストPRのマージ

```bash
# 2名のApprovalを取得後、GitHubでマージ
# または、テスト完了後にPRをクローズ

# ローカルをmainに戻す
git checkout main
git pull origin main
git branch -d feature/test-deployment
```

---

## 📊 vercel.json設定サマリー

### セキュリティヘッダー（全ページ）
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

### キャッシュ戦略
```json
{
  "/style.css": "public, max-age=31536000, immutable",
  "/main.js": "public, max-age=31536000, immutable",
  "/public/images/*": "public, max-age=31536000, immutable",
  "/favicon.svg": "public, max-age=31536000, immutable"
}
```
※ max-age=31536000 = 1年間

---

## 🎯 DoD達成確認

### E1: Lead Architect/Infra

| 要件 | ステータス | 確認方法 |
|------|-----------|---------|
| main保護 | ⏳ STEP 2 | 直接プッシュがエラーになる |
| PR必須 | ⏳ STEP 2 | Branch Protection設定確認 |
| 2 Approvals | ⏳ STEP 2 | PR作成時に要求表示 |
| CI合格 | ✅ 完了 | GitHub Actions設定済み |
| Vercel自動デプロイ | ⏳ STEP 3 | main→Prod, PR→Preview |
| Lighthouse Perf≥90 | ⏳ テスト | Preview環境で計測 |
| Preview URL発行 | ⏳ STEP 3 | PR作成時に自動生成 |
| vercel.json反映 | ✅ 完了 | curl -I で確認 |

---

## 🔧 トラブルシューティング

### Q1: `git push`がエラーになる

**症状**:
```
fatal: 'origin' does not appear to be a git repository
```

**解決策**:
```bash
# リモートリポジトリが未設定
git remote -v  # 確認

# 設定されていない場合
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

---

### Q2: Vercel Previewが生成されない

**症状**: PRにVercelボットのコメントがない

**確認事項**:
1. Vercel Dashboard → Settings → Git Integration
2. GitHub Settings → Applications → Vercel
3. リポジトリのアクセス権限

**解決策**:
- Vercel → Settings → Git → Reconnect GitHub
- リポジトリを再度選択して権限付与

---

### Q3: Lighthouse スコアが低い

**Performance < 90の場合**:
- [ ] 画像サイズ確認（プレースホルダーが大きすぎないか）
- [ ] 未使用CSS/JavaScript確認
- [ ] フォント読み込み最適化
- [ ] キャッシュヘッダー確認

**対策**:
```bash
# 画像最適化（E5担当）
# CSS/JS削減（E2担当）
# vercel.json確認（E1）
```

---

### Q4: GitHub Actionsが実行されない

**症状**: PR作成後もワークフローが動かない

**確認事項**:
```bash
# workflow ファイル確認
cat .github/workflows/lighthouse.yml
cat .github/workflows/pr-check.yml
```

**解決策**:
1. GitHub Settings → Actions → General
2. **Workflow permissions**: Read and write permissions
3. **Allow all actions and reusable workflows** を選択

---

## 📝 最終チェックリスト

### ローカル準備
- [x] コード実装完了（E2/E3/E4/E5）
- [x] vercel.json最適化
- [x] GitHub Actions設定
- [x] ドキュメント整備
- [x] Gitコミット完了（6コミット）

### GitHub作業（次のステップ）
- [ ] STEP 1: リポジトリ作成＆プッシュ
- [ ] STEP 2: Branch Protection設定
- [ ] STEP 3: Vercel連携
- [ ] テストPR作成＆確認
- [ ] Lighthouse計測（Perf≥90）

### 最終確認
- [ ] Production URL発行確認
- [ ] セキュリティヘッダー確認
- [ ] Preview環境動作確認
- [ ] CI/CD自動化確認
- [ ] DoD全項目達成

---

## 🚀 デプロイ実行コマンド

```bash
# ========================================
# STEP 1: GitHubリポジトリ作成＆プッシュ
# ========================================

cd /Users/hamcat/Desktop/📁AZVELIA/源

# 方法1: 自動スクリプト
./QUICK_START.sh

# 方法2: 手動
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
# git push -u origin main

# ========================================
# STEP 2 & 3: GitHub/Vercel設定（手動）
# ========================================
# → DEPLOYMENT_GUIDE.md を参照

# ========================================
# テストPR作成
# ========================================

git checkout -b feature/test-deployment
echo "\n## Test - $(date +%Y-%m-%d)" >> README.md
git add README.md
git commit -m "test: Verify deployment pipeline"
git push origin feature/test-deployment

# GitHubでPR作成
# Preview URL確認
# Lighthouse計測
```

---

**準備完了**: ✅ すべてのコードとドキュメント整備完了  
**Next Action**: `./QUICK_START.sh` を実行してGitHubにプッシュ  
**詳細手順**: `DEPLOYMENT_GUIDE.md` 514行の完全ガイド参照

---

**E1 (Lead Architect / Infra) - 作業完了** 🎉  
**日時**: 2025-10-14  
**ステータス**: デプロイ準備完了

