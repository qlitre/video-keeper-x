#!/bin/bash

# setup-db.sh - D1データベースのスキーマセットアップスクリプト

# スクリプトが置かれているディレクトリの絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEMA_FILE="${SCRIPT_DIR}/schema.sql"

echo "🗄️  D1データベースのスキーマをセットアップ中..."
echo ""

# ローカルD1データベースにスキーマを適用
echo "📍 ローカルデータベースにスキーマを適用..."
wrangler d1 execute video-keeper-x --local --file="$SCHEMA_FILE"

echo ""
echo "✅ ローカルデータベースのセットアップ完了！"
echo ""

echo ""
echo "🎉 データベースセットアップ完了！"