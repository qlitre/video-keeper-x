#!/bin/bash

# setup-db.sh - D1データベースのスキーマセットアップスクリプト

echo "🗄️  D1データベースのスキーマをセットアップ中..."
echo ""

# ローカルD1データベースにスキーマを適用
echo "📍 ローカルデータベースにスキーマを適用..."
wrangler d1 execute video-keeper-x --local --file=schema.sql

echo ""
echo "✅ ローカルデータベースのセットアップ完了！"
echo ""

# リモートデータベースへの適用確認
read -p "🌐 リモートデータベースにも適用しますか？ (y/N): " apply_remote

if [[ $apply_remote =~ ^[Yy]$ ]]; then
    echo "📡 リモートデータベースにスキーマを適用..."
    wrangler d1 execute video-keeper-x --remote --file=schema.sql
    echo "✅ リモートデータベースのセットアップ完了！"
else
    echo "ℹ️  リモートデータベースはスキップしました"
    echo "   必要な場合は以下のコマンドで実行してください:"
    echo "   wrangler d1 execute video-keeper-x --remote --file=schema.sql"
fi

echo ""
echo "🎉 データベースセットアップ完了！"