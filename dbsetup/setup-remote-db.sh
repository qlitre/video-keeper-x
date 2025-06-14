#!/bin/bash

# Video Keeper X - リモートD1データベースセットアップスクリプト
# 使用方法: ./setup-remote-db.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEMA_FILE="${SCRIPT_DIR}/schema-remote.sql"

echo "=== Video Keeper X Remote Database Setup ==="
echo "実行日時: $(date)"
echo ""

# データベース名
DB_NAME="video-keeper-x"

echo "🚀 リモートD1データベースにスキーマを適用中..."
wrangler d1 execute $DB_NAME --remote --file="$SCHEMA_FILE"

echo ""
echo "📊 リモートデータベースの状態確認:"
echo ""

echo "テーブル一覧:"
wrangler d1 execute $DB_NAME --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%';"

echo ""
echo "アーティスト数:"
wrangler d1 execute $DB_NAME --remote --command="SELECT COUNT(*) as count FROM artists;"

echo ""
echo "動画数:"
wrangler d1 execute $DB_NAME --remote --command="SELECT COUNT(*) as count FROM videos;"

echo ""
echo "インデックス確認:"
wrangler d1 execute $DB_NAME --remote --command="SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%';"

echo ""
echo "=== リモートデータベースセットアップ完了 ==="
echo ""
echo "次のステップ:"
echo "1. wrangler deploy でアプリケーションをデプロイ"
echo "2. 本番環境でログイン機能をテスト"
echo "3. 動画投稿機能をテスト"