# 🚀 AZVELIA セットアップガイド

## ✅ 完了済み

- [x] ローカルプロジェクト構造作成
- [x] Gitリポジトリ初期化
- [x] 初回コミット完了

## 📋 次のステップ（手動作業必要）

### 1️⃣ GitHubリポジトリ作成 [必須]

#### 手順

1. **GitHubにアクセス**: https://github.com/new
2. **リポジトリ情報を入力**:
   ```
   Repository name: azvelia
   Description: AZVELIA 静的ランディングページ - Lighthouse Perf ≥90
   Public/Private: お好みで選択
   ⚠️ Initialize this repository with: 何もチェックしない
   ```
3. **Create repository** をクリック

4. **リモートリポジトリ追加とプッシュ**:
   ```bash
   cd /Users/hamcat/Desktop/📁AZVELIA/源
   
   # GitHubで表示されたURLを使用（例）
   git remote add origin https://github.com/YOUR_USERNAME/azvelia.git
   
   # または SSH
   git remote add origin git@github.com:YOUR_USERNAME/azvelia.git
   
   # プッシュ
   git push -u origin main
   ```

---

### 2️⃣ Branch Protection設定 [必須]

#### 手順

1. GitHubリポジトリページで **Settings** タブをクリック
2. 左メニュー **Branches** を選択
3. **Add rule** をクリック
4. 以下を設定:

```
Branch name pattern: main
```

**有効化する項目:**
- ✅ Require a pull request before merging
  - ✅ Require approvals: 2
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

5. **Create** をクリック

#### 確認方法
- mainブランチに直接プッシュできないことを確認
- PRを作成すると2名のApprovalが必要になることを確認

---

### 3️⃣ Vercel連携 [必須]

#### 手順

1. **Vercelにアクセス**: https://vercel.com
2. **GitHubでサインイン**
3. **Add New Project** をクリック
4. **GitHubリポジトリをImport**:
   - `azvelia` リポジトリを検索
   - **Import** をクリック

5. **プロジェクト設定**:
   ```
   Framework Preset: Other
   Build Command: （空欄のまま）
   Output Directory: （空欄のまま）
   Install Command: （空欄のまま）
   Root Directory: ./
   ```

6. **Deploy** をクリック

#### 確認方法
- デプロイ完了後、Production URLが発行される
- 例: `https://azvelia.vercel.app` または `https://azvelia-xxx.vercel.app`
- ブラウザでアクセスして表示確認

---

### 4️⃣ コラボレーター追加 [推奨]

GitHubで他のチームメンバーを追加します。

#### 手順

1. GitHubリポジトリで **Settings** → **Collaborators**
2. **Add people** をクリック
3. ユーザー名またはメールで検索して追加:
   - フロントエンド担当者
   - デザイナー
   - その他レビュアー

#### CODEOWNERSファイルの編集

追加したコラボレーターのGitHubユーザー名を反映:

```bash
# .github/CODEOWNERS を編集
* @YOUR_GITHUB_USERNAME

/index.html @YOUR_GITHUB_USERNAME @frontend-dev-username
/style.css @YOUR_GITHUB_USERNAME @designer-username
/main.js @YOUR_GITHUB_USERNAME @frontend-dev-username
# etc...
```

---

### 5️⃣ PR作成とPreview確認 [テスト]

動作確認のため、テストPRを作成します。

#### 手順

```bash
cd /Users/hamcat/Desktop/📁AZVELIA/源

# feature branchを作成
git checkout -b feature/test-pr

# 軽微な変更（例：READMEに1行追加）
echo "\n## Test PR" >> README.md

# コミット＆プッシュ
git add README.md
git commit -m "test: Add test line for PR verification"
git push origin feature/test-pr
```

#### GitHubでPR作成

1. GitHubリポジトリで **Pull requests** タブ
2. **New pull request** をクリック
3. `feature/test-pr` → `main` を選択
4. **Create pull request** をクリック

#### 確認項目

- [ ] Vercelが自動でPreview環境をデプロイ
- [ ] コメントにPreview URLが表示される
- [ ] 2名のApproval要求が表示される
- [ ] Preview URLにアクセスして表示確認

---

### 6️⃣ Lighthouse計測 [必須]

Preview環境でLighthouse計測を実施します。

#### 手順

1. **Chrome DevToolsで計測**:
   - Preview URLにアクセス
   - F12で開発者ツールを開く
   - **Lighthouse** タブを選択
   - Categories: Performance, Accessibility, Best Practices, SEO
   - Device: **Mobile** と **Desktop** 両方計測
   - **Analyze page load** をクリック

2. **目標値の確認**:
   ```
   ✅ Performance: ≥ 90
   ✅ Accessibility: ≥ 90
   ✅ Best Practices: ≥ 90
   ✅ SEO: ≥ 90
   ```

3. **スコアをPRに記載**:
   - PRコメントに計測結果を貼り付け
   - スクリーンショットを添付（推奨）

#### トラブルシューティング

**Performance < 90の場合:**
- 画像サイズ・フォーマット確認
- 未使用CSS/JavaScript削除
- キャッシュ設定確認
- フォント読み込み最適化

---

## 📊 完了チェックリスト

### インフラ設定
- [ ] GitHubリポジトリ作成完了
- [ ] リモートリポジトリ追加＆プッシュ完了
- [ ] Branch Protection設定完了（2 Approvals必須）
- [ ] Vercel連携完了
- [ ] Production URL発行確認

### 動作確認
- [ ] テストPR作成→Preview URL生成確認
- [ ] Lighthouse計測実施（Mobile & Desktop）
- [ ] Performance Score ≥ 90達成
- [ ] PRマージ→本番自動デプロイ確認

### チーム設定
- [ ] コラボレーター追加完了
- [ ] CODEOWNERS更新完了
- [ ] レビュアー通知動作確認

---

## 🎯 DoD（Definition of Done）達成確認

✅ **Preview URL発行**: PR作成時に自動生成  
✅ **mainへマージで自動本番**: Vercel自動デプロイ  
✅ **Lighthouse（Preview）でPerf≥90**: Chrome DevToolsで計測確認  

---

## 📞 サポート

問題が発生した場合は、以下をご確認ください：

- `docs/DEPLOYMENT.md` - 詳細なデプロイ手順
- `docs/ARCHITECTURE.md` - アーキテクチャ設計
- Vercelダッシュボード - デプロイログ確認
- GitHub Actions - CI/CDログ確認（将来的に追加予定）

---

**作成**: E1 (Lead Architect/Infra)  
**日時**: 2025-10-14  
**ステータス**: ローカル構築完了 → GitHub連携待ち

