#!/bin/bash

# AZVELIA Quick Start Script
# このスクリプトはGitHubリポジトリ作成後に実行してください

set -e

echo "🚀 AZVELIA - Quick Start Script"
echo "================================"
echo ""

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# リモートリポジトリURLの入力
echo -e "${YELLOW}GitHubでリポジトリを作成しましたか？${NC}"
echo "作成していない場合は Ctrl+C で中断してください"
echo ""
read -p "リモートリポジトリURL (例: https://github.com/username/azvelia.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}エラー: リポジトリURLが入力されていません${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ リポジトリURL: $REPO_URL${NC}"
echo ""

# リモート追加確認
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}既存のリモートリポジトリが設定されています${NC}"
    CURRENT_URL=$(git remote get-url origin)
    echo "現在のURL: $CURRENT_URL"
    read -p "上書きしますか？ (y/N): " OVERWRITE
    
    if [[ $OVERWRITE =~ ^[Yy]$ ]]; then
        git remote remove origin
        git remote add origin "$REPO_URL"
        echo -e "${GREEN}✓ リモートリポジトリを更新しました${NC}"
    else
        echo "スキップします"
    fi
else
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓ リモートリポジトリを追加しました${NC}"
fi

echo ""

# プッシュ確認
read -p "mainブランチにプッシュしますか？ (Y/n): " PUSH_CONFIRM

if [[ ! $PUSH_CONFIRM =~ ^[Nn]$ ]]; then
    echo "プッシュ中..."
    git push -u origin main
    echo -e "${GREEN}✓ mainブランチにプッシュ完了${NC}"
else
    echo "プッシュをスキップしました"
    echo "手動でプッシュする場合: git push -u origin main"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ セットアップ完了！${NC}"
echo ""
echo "次のステップ:"
echo "1. GitHubでBranch Protection設定"
echo "2. Vercelと連携"
echo "3. テストPRを作成してPreview確認"
echo ""
echo "詳細は SETUP_GUIDE.md をご覧ください"
echo "================================"

