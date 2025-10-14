# アーキテクチャ設計書

## 概要

AZVELIA静的LPの技術アーキテクチャドキュメント

## インフラストラクチャ

### ホスティング
- **プラットフォーム**: Vercel
- **Production**: main branch（自動デプロイ）
- **Preview**: Pull Request毎に自動生成

### Branch戦略

```
main (protected)
  ├── feature/xxx
  ├── fix/xxx
  └── docs/xxx
```

#### Branch Protection Rules
- PRマージ必須
- 2名のApproval必要
- CIステータスチェック必須
- Branch最新状態でのマージ必須

## パフォーマンス戦略

### Lighthouse目標値
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

### 最適化手法

1. **Critical Rendering Path最適化**
   - インラインクリティカルCSS（必要に応じて）
   - 非同期JavaScript読み込み
   - フォントの最適化（preconnect）

2. **Asset最適化**
   - 画像の遅延読み込み（Intersection Observer）
   - 適切な画像フォーマット（WebP推奨）
   - Cache-Control ヘッダー設定

3. **Core Web Vitals**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

## セキュリティ

### HTTPヘッダー
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## デプロイメントフロー

```
1. Feature Branch作成
   ↓
2. 実装・コミット
   ↓
3. PR作成
   ↓
4. Preview URL生成（Vercel）
   ↓
5. Lighthouse計測
   ↓
6. Code Review（2 Approvals）
   ↓
7. mainへマージ
   ↓
8. 本番自動デプロイ
```

## 開発ガイドライン

### コーディング規約
- セマンティックHTML使用
- BEM記法推奨（CSS）
- ES6+構文使用（JavaScript）
- アクセシビリティ考慮（ARIA属性等）

### パフォーマンスチェックリスト
- [ ] 画像最適化（WebP, 適切なサイズ）
- [ ] 未使用CSS/JavaScript削除
- [ ] 遅延読み込み実装
- [ ] キャッシュ戦略設定
- [ ] Lighthouse Score ≥ 90

## モニタリング

### 計測指標
- Vercel Analytics（本番環境）
- Lighthouse CI（PR環境）
- Core Web Vitals

## 今後の拡張計画

- CI/CD強化（GitHub Actions連携）
- E2Eテスト導入
- A/Bテスト基盤
- Analytics連携

---

**最終更新**: 2025-10-14
**担当**: E1 (Lead Architect/Infra)

