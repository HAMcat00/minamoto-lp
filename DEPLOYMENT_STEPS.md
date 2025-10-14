# 🚀 デプロイ実施手順 - minamoto-lp

**実施日**: 2025-10-14  
**担当**: E1 (Lead Architect / Infrastructure)

---

## ✅ 事前確認

- [x] ローカルコミット完了（9コミット）
- [x] vercel.json最適化完了
- [x] GitHub Actions設定完了
- [x] ドキュメント整備完了

---

## 📋 実施手順（3ステップ）

### STEP 1: GitHubリポジトリ作成 ⏳

#### 1-1. GitHubでリポジトリ作成

1. **ブラウザで https://github.com/new にアクセス**

2. **リポジトリ情報を入力**:
   ```
   Repository name: minamoto-lp
   Description: 源（MINAMOTO）静的LP - Lighthouse Perf ≥90 | モバイルファーストLP
   
   Visibility: 
   ○ Public
   ● Private  ← 推奨（本番LPのため）
   
   ⚠️ 以下は何もチェックしない:
   □ Add a README file
   □ Add .gitignore
   □ Choose a license
   ```

3. **Create repository** をクリック

#### 1-2. リモートリポジトリURL取得

GitHubに表示されるURLをコピー:

**SSH（推奨）**:
```
git@github.com:YOUR_USERNAME/minamoto-lp.git
```

**HTTPS**:
```
https://github.com/YOUR_USERNAME/minamoto-lp.git
```

#### 1-3. ローカルからプッシュ

**方法A: 自動スクリプト使用（推奨）**

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源
./QUICK_START.sh
```

スクリプトがリモートURLを聞いてきたら、コピーしたURLを貼り付け

**方法B: 手動実行**

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# リモート追加
git remote add origin git@github.com:YOUR_USERNAME/minamoto-lp.git

# プッシュ
git push -u origin main
```

#### ✅ 確認

- [ ] GitHubでコミット履歴が表示される（9コミット）
- [ ] ファイルが正しく表示される（index.html, style.css, main.js等）
- [ ] README.mdが表示される

---

### STEP 2: Branch Protection設定 ⏳

#### 2-1. Branch Protection Ruleを追加

1. **GitHubリポジトリページで Settings タブをクリック**

2. **左メニューから Branches を選択**

3. **Branch protection rules セクションで Add rule をクリック**

#### 2-2. 設定内容

**Branch name pattern**:
```
main
```

**Protect matching branches** - 以下をすべて有効化:

```
✅ Require a pull request before merging
   ✅ Require approvals: 2
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   
   ※ 検索ボックスで以下を追加（GitHub Actions実行後に表示される）:
   - validate
   - lighthouse

✅ Require conversation resolution before merging

✅ Require linear history

✅ Do not allow bypassing the above settings
   ⚠️ 管理者も含めて誰も迂回できなくする
```

#### 2-3. 保存

**Create** ボタンをクリック

#### ✅ 確認

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# テスト: mainへの直接プッシュを試みる（エラーになるはず）
echo "test" >> README.md
git add README.md
git commit -m "test: direct push"
git push origin main

# ❌ エラーが出ればOK:
# remote: error: GH006: Protected branch update failed

# テストコミットを元に戻す
git reset --hard HEAD~1
```

---

### STEP 3: Vercel連携 ⏳

#### 3-1. Vercelにアクセス

1. **ブラウザで https://vercel.com にアクセス**

2. **Continue with GitHub** でサインイン

#### 3-2. プロジェクトをインポート

1. **ダッシュボードで Add New → Project をクリック**

2. **Import Git Repository**:
   - GitHub連携がまだの場合: **Add GitHub Account** をクリック
   - 権限を許可
   
3. **リポジトリ検索**:
   - 検索ボックスに `minamoto-lp` と入力
   - 表示されたら **Import** をクリック

#### 3-3. プロジェクト設定

```
Project Name: minamoto-lp

Framework Preset: Other

Root Directory: ./

Node.js Version: 20.x (デフォルトのまま)

Build and Output Settings:
  Build Command: (空欄のまま)
  Output Directory: (空欄のまま)
  Install Command: (空欄のまま)

Environment Variables:
  (今は設定不要。E3が後でGA4_MEASUREMENT_IDを追加)
```

#### 3-4. デプロイ

**Deploy** ボタンをクリック

デプロイが開始されます（約1-2分）

#### ✅ 確認

**A. Production URL確認**

デプロイ完了後、以下のようなURLが発行されます:
```
https://minamoto-lp.vercel.app
または
https://minamoto-lp-xxx.vercel.app
```

ブラウザでアクセスして表示を確認

**B. vercel.json反映確認**

```bash
# セキュリティヘッダーの確認
curl -I https://minamoto-lp.vercel.app

# 以下のヘッダーが表示されるはず:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**C. Git連携確認**

Vercel Dashboard → Settings → Git で以下を確認:
- ✅ Production Branch: `main`
- ✅ Automatic deployments: Enabled

---

## 🧪 テストPR作成（動作確認）

### 目的
- Preview環境の動作確認
- GitHub Actions動作確認
- Branch Protection動作確認

### 手順

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# 1. feature branchを作成
git checkout -b feature/test-deployment

# 2. 軽微な変更
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

1. **GitHubリポジトリで Pull requests タブをクリック**
2. **New pull request** をクリック
3. **base: main ← compare: feature/test-deployment** を選択
4. **タイトル**: `test: Verify deployment pipeline`
5. **Create pull request** をクリック

### ✅ 確認項目

#### Vercel Preview
- [ ] Vercelボットが1〜2分以内にコメント投稿
- [ ] Preview URLが表示される
- [ ] Preview URLにアクセスして表示確認
- [ ] レスポンシブ確認（375px〜1200px）

#### GitHub Actions
- [ ] **PR Checks** workflowが自動実行
- [ ] **Lighthouse CI** workflowが自動実行
- [ ] すべてのチェックがPass（緑✅）

#### Branch Protection
- [ ] 「2 approvals required」と表示
- [ ] CIチェック完了前は「Merge」ボタンが無効
- [ ] CODEOWNERSレビュアーが自動割り当て（設定済みの場合）

---

## 📊 Lighthouse計測

### 手動計測（Chrome DevTools）

1. **Preview URLにアクセス**
2. **F12で開発者ツールを開く**
3. **Lighthouse タブを選択**
4. **設定**:
   ```
   Mode: Navigation
   Device: Mobile
   Categories: すべて選択
   ```
5. **Analyze page load** をクリック

### 目標スコア

```
✅ Performance:      ≥ 90
✅ Accessibility:    ≥ 90
✅ Best Practices:   ≥ 90
✅ SEO:              ≥ 90
```

### Desktop版も計測

Device を **Desktop** に変更して再度計測

---

## 🎯 完了チェックリスト

### STEP 1: GitHub
- [ ] リポジトリ作成完了
- [ ] リモート追加完了
- [ ] プッシュ完了（9コミット）
- [ ] ファイル表示確認

### STEP 2: Branch Protection
- [ ] Branch Protection設定完了
- [ ] 2 Approvals必須設定
- [ ] Status checks必須設定
- [ ] 直接プッシュエラー確認

### STEP 3: Vercel
- [ ] プロジェクトインポート完了
- [ ] Production URL発行
- [ ] セキュリティヘッダー確認
- [ ] Git連携確認（main=Prod）

### テストPR
- [ ] feature branch作成
- [ ] PR作成完了
- [ ] Preview URL生成確認
- [ ] GitHub Actions実行確認
- [ ] Lighthouse計測実施
- [ ] Performance ≥ 90達成

---

## 📝 実施記録

### STEP 1実施日時
- 実施日: ____年__月__日 __:__
- Production URL: https://________________
- 実施者: ________________
- ステータス: □ 完了 □ 問題あり

### STEP 2実施日時
- 実施日: ____年__月__日 __:__
- Branch Protection: □ 設定完了
- テスト確認: □ エラー確認済み
- ステータス: □ 完了 □ 問題あり

### STEP 3実施日時
- 実施日: ____年__月__日 __:__
- Vercel Project: minamoto-lp
- Production URL: https://________________
- ステータス: □ 完了 □ 問題あり

### テストPR実施日時
- 実施日: ____年__月__日 __:__
- PR番号: #____
- Preview URL: https://________________
- Lighthouse Score: Performance ____ / Accessibility ____ / Best Practices ____ / SEO ____
- ステータス: □ 完了 □ 問題あり

---

## 🔧 トラブルシューティング

### Q1: git push がエラーになる

**症状**:
```
fatal: 'origin' does not appear to be a git repository
```

**解決策**:
```bash
git remote -v  # 確認
git remote add origin git@github.com:YOUR_USERNAME/minamoto-lp.git
```

---

### Q2: Vercel Previewが生成されない

**症状**: PRにVercelボットのコメントがない

**解決策**:
1. Vercel Dashboard → Settings → Git Integration
2. GitHub Settings → Applications → Vercel
3. リポジトリのアクセス権限確認
4. Vercel → Settings → Git → Reconnect GitHub

---

### Q3: GitHub Actionsが実行されない

**症状**: PR作成後もワークフローが動かない

**解決策**:
1. GitHub Settings → Actions → General
2. **Workflow permissions**: Read and write permissions
3. **Allow all actions and reusable workflows** を選択

---

### Q4: Lighthouse スコアが低い

**Performance < 90の場合**:
- 画像サイズ確認
- 未使用CSS/JavaScript確認
- フォント読み込み最適化
- キャッシュヘッダー確認

**対策**:
```bash
# Chrome DevTools → Network タブで確認
# 大きいファイルを特定
# E5に画像最適化依頼
```

---

## 📞 サポート

詳細は以下のドキュメントを参照:

1. **DEPLOYMENT_GUIDE.md** - 514行の完全ガイド
2. **READY_TO_DEPLOY.md** - クイックガイド
3. **E1_FINAL_REPORT.md** - 最終報告書

---

**作成**: E1 (Lead Architect / Infrastructure)  
**日時**: 2025-10-14  
**ステータス**: 実施準備完了

