# 源 -MINAMOTO- LP / Vercel デプロイ手順

## 要件
- GitHub に push → `main` ブランチへのマージで **Production** 自動デプロイ
- 必要に応じて環境変数を設定（例: `GA_MEASUREMENT_ID`）

---

## セットアップ

### 1) 初回プッシュ（完了済み）
```bash
git init
git add .
git commit -m "Initialize LP"
git branch -M main
git remote add origin https://github.com/HAMcat00/minamoto-lp.git
git push -u origin main
```

### 2) Vercel プロジェクト作成
1. **Vercel Dashboard** → **Add New…** → **Project**
2. **GitHub** `HAMcat00/minamoto-lp` を選択
3. **フレームワーク設定**
   - **Framework Preset**: `Other`（静的サイト）
   - **Build Command**: 空（なし）
   - **Output Directory**: `.`（ルート）
   - **Root Directory**: `./`
4. **Environment Variables**（任意）
   - 例: `GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
5. **Deploy** → URL 発行

### 3) CI / 自動デプロイ
- `main` に push → **Production** へ自動デプロイ
- Pull Request → **Preview** 環境へ自動デプロイ

---

## 動作確認

✅ **本番URL**: https://minamoto-lp.vercel.app/  
✅ **スワイプLP**: https://minamoto-lp.vercel.app/index-swipe.html

- [ ] LP が表示されること
- [ ] Vercel の Deployments でビルドログを確認
- [ ] スワイプ動作確認（Mobile）
- [ ] GA4イベント発火確認（DebugView）

---

## 開発

### ローカル開発サーバー
```bash
# 静的LP: 任意のローカルHTTPサーバで確認
python3 -m http.server 8000
# または
npm run dev

# ブラウザで確認
open http://localhost:8000/
open http://localhost:8000/index-swipe.html
```

### ブランチ戦略
```bash
# 新機能開発
git checkout -b feat/new-feature
# 作業...
git add .
git commit -m "feat: 新機能追加"
git push -u origin feat/new-feature
# GitHub で PR作成 → マージで本番反映
```

---

## 環境変数

### 設定項目
- **GA_MEASUREMENT_ID**: Google Analytics 4 測定ID
- **LINE_URL**: LINE公式アカウントURL

### 設定方法
1. **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. 各変数を追加（`preview` / `production` の両方に設定）
3. 再デプロイ（Deployments → Redeploy）

### CLI で追加（任意）
```bash
vercel link
vercel env add GA_MEASUREMENT_ID production
vercel env add GA_MEASUREMENT_ID preview
```

---

## トラブルシュート

### 404 / 白画面
- ✅ `index.html` がリポ直下にあるか確認
- ✅ **Output Directory** を `.` に設定
- ✅ **Root Directory** を `./` に設定

### ビルドが走ってしまう（静的なのに）
- ✅ **Framework** を `Other` に設定
- ✅ **Build Command** を空に設定

### 環境変数が効かない
- ✅ `preview` / `production` 両方に設定したか確認
- ✅ 再デプロイしたか確認

### main に push しても反映されない
- ✅ Vercel Project が GitHub リポと正しくリンクされているか確認
- ✅ Branch Protection でブロックされていないか確認

---

## ファイル構造

```
/Users/hamcat/Desktop/📁AZVELIA/源/
├── public/
│   ├── index.html              # メインLP
│   ├── index-swipe.html        # スワイプLP
│   ├── css/
│   │   ├── styles.css          # メインスタイル
│   │   └── swipe.css           # スワイプスタイル
│   ├── js/
│   │   ├── main.js             # メインスクリプト
│   │   ├── analytics.js        # 計測システム
│   │   ├── swipe.js            # スワイプUI
│   │   └── tracking.js         # GA4トラッキング
│   ├── images/
│   │   └── (画像ファイル)
│   └── scripts/
│       └── config.js           # 設定ファイル
├── vercel.json                 # Vercel設定
├── README.md                   # プロジェクト概要
└── VERCEL_DEPLOY.md           # このファイル
```

---

## DoD（受け入れ基準）

### デプロイ
- [x] GitHub リポジトリ作成
- [x] Vercel 連携完了
- [x] 本番URL発行
- [x] 自動デプロイ動作確認

### 動作確認
- [x] 本番URLで200 OK
- [x] OGP画像アクセス確認
- [x] 静的アセット配信確認
- [ ] スワイプLP動作確認
- [ ] GA4イベント発火確認

### パフォーマンス
- [ ] Lighthouse（Mobile）≥90
- [ ] CLS < 0.1
- [ ] LCP < 2.5s

---

## 次のステップ

1. **スワイプLP テスト**
   - https://minamoto-lp.vercel.app/index-swipe.html
   - スマホでスワイプ動作確認
   - ドットナビゲーション確認

2. **GA4 設定**
   - 環境変数に `GA_MEASUREMENT_ID` 追加
   - DebugView で全イベント確認

3. **LINE URL 設定**
   - `public/scripts/config.js` に本番URL設定
   - 実機でLINE遷移確認

4. **パフォーマンス最適化**
   - Lighthouse計測
   - CLS/LCP改善

---

## サポート

- **Vercel ドキュメント**: https://vercel.com/docs
- **GitHub リポジトリ**: https://github.com/HAMcat00/minamoto-lp
- **本番URL**: https://minamoto-lp.vercel.app/

---

**完全無欠の唐揚げ弁当LP - Vercel デプロイ完了！** 🍗✨

