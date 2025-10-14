# 🚀 デプロイメントガイド - E1 Infra

## ✅ 完了済み

- [x] ローカルプロジェクト構造作成
- [x] Gitリポジトリ初期化
- [x] E2 Frontend UI実装コミット完了
- [x] E4 Integration実装コミット完了
- [x] vercel.json設定完了

## 📋 次のステップ（手動作業必要）

---

## 1️⃣ GitHubリポジトリ作成 [必須]

### 手順

#### A. GitHubでリポジトリ作成

1. **GitHubにアクセス**: https://github.com/new

2. **リポジトリ情報を入力**:
   ```
   Repository name: minamoto-lp
   Description: 源（MINAMOTO）静的LP - Lighthouse Perf ≥90
   Public/Private: Private推奨（本番LPのため）
   
   ⚠️ 重要: 以下は何もチェックしない
   □ Add a README file
   □ Add .gitignore
   □ Choose a license
   ```

3. **Create repository** をクリック

#### B. リモートリポジトリ追加とプッシュ

GitHubに表示されるコマンドを使用します：

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# HTTPSの場合
git remote add origin https://github.com/YOUR_USERNAME/minamoto-lp.git

# SSHの場合（推奨）
git remote add origin git@github.com:YOUR_USERNAME/minamoto-lp.git

# プッシュ
git push -u origin main
```

#### または、クイックスタートスクリプト使用

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源
./QUICK_START.sh
```

スクリプトが対話的にリポジトリURLを聞いてきます。

---

## 2️⃣ Branch Protection設定 [必須]

### 目的
- mainブランチへの直接プッシュを防止
- PR必須、2名のApproval必要
- CI/CDチェック合格必須

### 手順

1. GitHubリポジトリページで **Settings** タブをクリック

2. 左メニュー **Branches** を選択

3. **Branch protection rules** セクションで **Add rule** をクリック

4. **設定内容**:

```
Branch name pattern: main
```

#### 有効化する項目:

**Protect matching branches:**

✅ **Require a pull request before merging**
  - ✅ Require approvals: **2**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners

✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - 検索ボックスで以下を追加（後でGitHub Actions設定後）:
    - `validate` (PR Checks workflow)
    - `lighthouse` (Lighthouse CI workflow)

✅ **Require conversation resolution before merging**

✅ **Require linear history**

✅ **Do not allow bypassing the above settings**
  - ⚠️ 管理者も含めて誰も迂回できなくする

5. **Create** をクリック

### 確認方法

```bash
# mainブランチに直接プッシュを試みる（エラーになるはず）
echo "test" >> README.md
git add README.md
git commit -m "test: direct push"
git push origin main
# ❌ エラー: protected branch
```

---

## 3️⃣ Vercel連携 [必須]

### 目的
- main = Production環境
- PR = Preview環境（自動生成）
- vercel.json反映（セキュリティヘッダー、キャッシュ設定）

### 手順

#### A. Vercelにアクセス

1. https://vercel.com にアクセス
2. **Continue with GitHub** でサインイン

#### B. プロジェクトをインポート

1. ダッシュボードで **Add New** → **Project** をクリック

2. **Import Git Repository**:
   - GitHub連携がまだの場合: **Add GitHub Account** をクリック
   - リポジトリ一覧から `minamoto-lp` を検索
   - **Import** をクリック

#### C. プロジェクト設定

```
Project Name: minamoto-lp
Framework Preset: Other
Root Directory: ./
Node.js Version: 20.x (デフォルト)

Build and Output Settings:
  Build Command: (空欄のまま)
  Output Directory: (空欄のまま)
  Install Command: (空欄のまま)

Environment Variables: (今は不要)
  ※ E3が後でGA4設定を追加
```

#### D. デプロイ

**Deploy** をクリック

デプロイ完了後、以下が発行されます：
```
Production URL: https://minamoto-lp.vercel.app
または
Production URL: https://minamoto-lp-xxx.vercel.app
```

### 自動設定の確認

✅ **Production環境**:
- Trigger: mainブランチへのプッシュ
- URL: https://minamoto-lp.vercel.app

✅ **Preview環境**:
- Trigger: PRの作成/更新
- URL: 自動生成（例: https://minamoto-lp-git-feature-xxx.vercel.app）
- PRコメントに自動投稿される

✅ **vercel.json反映確認**:
```bash
# デプロイ後、以下のコマンドでヘッダー確認
curl -I https://minamoto-lp.vercel.app

# 確認すべきヘッダー:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - X-XSS-Protection: 1; mode=block
# - Referrer-Policy: strict-origin-when-cross-origin
# - Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 4️⃣ コラボレーター追加 [推奨]

### 目的
- CODEOWNERSファイルのレビュアー設定
- 2 Approvalsの要件を満たす

### 手順

1. GitHubリポジトリで **Settings** → **Collaborators**

2. **Add people** をクリック

3. チームメンバーを追加:
   - E1（あなた自身） - Owner
   - E2（Frontend UI担当）
   - E3（Data & Tracking担当）
   - E4（Integrations担当）
   - E5（Assets & Content担当）

4. 権限設定:
   - E1: Admin
   - 他メンバー: Write

### CODEOWNERSの更新

`.github/CODEOWNERS` を編集:

```bash
# 実際のGitHubユーザー名に置き換え
* @YOUR_GITHUB_USERNAME

# Frontend
/index.html @YOUR_GITHUB_USERNAME @E2_GITHUB_USERNAME
/style.css @YOUR_GITHUB_USERNAME @E2_GITHUB_USERNAME

# JavaScript
/main.js @YOUR_GITHUB_USERNAME @E4_GITHUB_USERNAME

# Infra
/vercel.json @YOUR_GITHUB_USERNAME
/.github/ @YOUR_GITHUB_USERNAME
```

コミット:
```bash
git add .github/CODEOWNERS
git commit -m "chore: Update CODEOWNERS with actual GitHub usernames"
git push origin main
```

---

## 5️⃣ テストPR作成 [動作確認]

### 目的
- Preview環境の動作確認
- Branch Protection動作確認
- Lighthouse CI動作確認

### 手順

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# feature branchを作成
git checkout -b feature/test-deployment

# 軽微な変更（例：README.mdに一行追加）
echo "\n## Deployment Test" >> README.md

# コミット
git add README.md
git commit -m "test: Add deployment test section to README"

# プッシュ
git push origin feature/test-deployment
```

### GitHubでPR作成

1. GitHubリポジトリで **Pull requests** タブをクリック
2. **New pull request** をクリック
3. `feature/test-deployment` → `main` を選択
4. **Create pull request** をクリック

### 確認項目

#### ✅ Vercel Preview環境
- [ ] Vercelボットがコメントを投稿
- [ ] Preview URLが表示される（例: https://minamoto-lp-git-feature-test-deployment-xxx.vercel.app）
- [ ] Preview URLにアクセスして表示確認

#### ✅ GitHub Actions
- [ ] PR Checks workflowが実行される
- [ ] Lighthouse CI workflowが実行される
- [ ] すべてのチェックがPassする

#### ✅ Branch Protection
- [ ] 2名のApprovalが必要と表示される
- [ ] CIチェック完了前はマージボタンが無効

#### ✅ レビュアー自動割り当て
- [ ] CODEOWNERSで指定したレビュアーが自動追加される

### マージ

1. 2名のApprovalを取得
2. すべてのCIチェックがPass
3. **Merge pull request** をクリック
4. **Confirm merge** をクリック
5. Vercelが自動で本番デプロイ

---

## 6️⃣ Lighthouse計測 [パフォーマンス確認]

### Preview環境での計測

#### A. Chrome DevToolsで手動計測

1. Preview URLにアクセス
2. F12で開発者ツールを開く
3. **Lighthouse** タブを選択
4. 設定:
   ```
   Mode: Navigation
   Device: Mobile & Desktop（両方）
   Categories: すべて選択
   ```
5. **Analyze page load** をクリック

#### 目標スコア

```
✅ Performance:      ≥ 90
✅ Accessibility:    ≥ 90
✅ Best Practices:   ≥ 90
✅ SEO:              ≥ 90
```

#### B. Lighthouse CI（自動）

GitHub Actions workflowが自動で計測し、PRにコメント投稿します。

### スコアが低い場合の対処

#### Performance < 90
- 画像の最適化（WebP変換、サイズ削減）
- 未使用CSS/JavaScript削除
- フォント読み込み最適化
- キャッシュ設定確認

#### Accessibility < 90
- コントラスト比の確認
- alt属性の追加
- フォーカス可視化
- セマンティックHTML確認

---

## 📊 DoD（Definition of Done）達成確認

### ✅ E1: Lead Architect/Infra

- [x] ルート構成作成（/index.html /style.css /main.js /public/images/ /docs/）
- [x] PRテンプレート＆CODEOWNERS作成
- [ ] **GitHub新規repo作成** ← 今ここ
- [ ] **Branch Protection設定（PR必須/2 Approvals）** ← 今ここ
- [ ] **Vercel接続（main=Prod/PR=Preview）** ← 今ここ
- [ ] **vercel.json反映確認**
- [ ] **Preview URL発行確認**
- [ ] **mainへマージで自動本番デプロイ確認**
- [ ] **Lighthouse（Preview）でPerf≥90確認**

---

## 🔧 トラブルシューティング

### デプロイ失敗時

**症状**: Vercelデプロイがエラーになる

**確認事項**:
```bash
# vercel.jsonの文法チェック
cat vercel.json | python3 -m json.tool

# ファイル構成確認
ls -la
```

**解決策**:
- Vercelダッシュボードでログ確認
- vercel.jsonの文法エラー修正
- ファイルパスの大文字小文字確認

### Branch Protection回避不可時

**症状**: 緊急対応でmainに直接プッシュが必要

**解決策**:
1. Settings → Branches → Edit rule
2. 一時的に **Do not allow bypassing** を無効化
3. 緊急対応完了後、すぐに再有効化

⚠️ **注意**: セキュリティリスクがあるため、最小限の時間のみ無効化

### Preview URL生成されない時

**症状**: PRを作成してもVercelボットがコメントしない

**確認事項**:
1. VercelダッシュボードでGit Integration確認
2. GitHub App権限確認
3. リポジトリ設定確認

**解決策**:
- Vercel → Settings → Git → Reconnect GitHub
- GitHub Settings → Applications → Vercelの権限確認

### Lighthouse CIが実行されない

**症状**: GitHub Actionsが動かない

**確認事項**:
```bash
# workflow ファイル確認
cat .github/workflows/lighthouse.yml
cat .github/workflows/pr-check.yml
```

**解決策**:
- GitHub Settings → Actions → General → Allow all actions
- workflow YAMLの文法エラー確認

---

## 📝 チェックリスト

### 初回セットアップ完了確認

- [ ] GitHubリポジトリ作成完了
- [ ] リモートリポジトリ追加＆プッシュ完了
- [ ] Branch Protection設定完了（2 Approvals必須）
- [ ] Vercel連携完了
- [ ] Production URL発行確認: https://_______.vercel.app
- [ ] vercel.json反映確認（セキュリティヘッダー）
- [ ] テストPR作成→Preview URL生成確認
- [ ] Lighthouse計測実施（Mobile & Desktop）
- [ ] Performance Score ≥ 90達成
- [ ] PRマージ→本番自動デプロイ確認
- [ ] コラボレーター追加完了
- [ ] CODEOWNERS更新完了

---

## 🎯 次のステップ（他チーム連携）

### E3: Data & Tracking
```
データ分析・計測基盤担当
TODO:
- GA4タグ実装（data-ga-id注入）
- イベントトラッキング設定
- ヒートマップツール導入
```

### E4: Integrations
```
外部サービス連携担当
TODO:
- LINE公式アカウント連携
- QRコード生成
- Webhook設定
```

### E5: Assets & Content
```
画像・コンテンツ最適化担当
TODO:
- 画像最適化（WebP変換）
- OGP画像作成
- favicon設定
```

---

## 📞 サポート

問題が発生した場合:

1. **ドキュメント確認**:
   - `docs/ARCHITECTURE.md` - アーキテクチャ設計
   - `docs/DEPLOYMENT.md` - 詳細デプロイ手順
   - `LIGHTHOUSE_CHECKLIST.md` - パフォーマンス最適化

2. **ログ確認**:
   - Vercelダッシュボード → Deployments → Logs
   - GitHub Actions → Actions tab → Workflow runs

3. **チーム相談**:
   - E1（あなた）: インフラ・CI/CD
   - E2: UI/UX・フロントエンド
   - E3: 計測・分析
   - E4: 外部連携
   - E5: コンテンツ

---

**作成**: E1 (Lead Architect/Infra)  
**日時**: 2025-10-14  
**ステータス**: GitHub連携・Vercel接続待ち  
**Next Action**: GitHubリポジトリ作成 → Branch Protection → Vercel連携

