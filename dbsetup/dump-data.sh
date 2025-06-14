#!/bin/bash

# Video Keeper X - リモートデータベースバックアップスクリプト
# リモートのD1データベースから全データをJSON形式でローカルに保存
# 使用方法: ./dump-data.sh

set -e  # エラーで停止

# データベース名と出力ファイル設定
DB_NAME="video-keeper-x"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/backups"
BACKUP_FILE="$BACKUP_DIR/video-keeper-x_backup_$TIMESTAMP.json"

# バックアップディレクトリの作成
mkdir -p "$BACKUP_DIR"

echo "=== Video Keeper X Remote Database Backup ==="
echo "実行日時: $(date)"
echo "出力ファイル: $BACKUP_FILE"
echo ""

# jqがインストールされているか確認
if ! command -v jq &> /dev/null; then
    echo "❌ エラー: jq がインストールされていません"
    echo "インストール方法: brew install jq"
    exit 1
fi

echo "📊 リモートデータベースから情報を取得中..."

# アーティストデータを取得
echo "🎤 アーティストデータを取得中..."
ARTISTS_JSON=$(wrangler d1 execute $DB_NAME --remote --command="SELECT * FROM artists ORDER BY created_at;" --json)
ARTISTS_DATA=$(echo "$ARTISTS_JSON" | jq '.[0].results')
ARTISTS_COUNT=$(echo "$ARTISTS_DATA" | jq 'length')

# 動画データを取得（アーティスト名も含む）
echo "🎬 動画データを取得中..."
VIDEOS_JSON=$(wrangler d1 execute $DB_NAME --remote --command="SELECT v.*, a.name as artist_name FROM videos v LEFT JOIN artists a ON v.artist_id = a.id ORDER BY v.created_at DESC;" --json)
VIDEOS_DATA=$(echo "$VIDEOS_JSON" | jq '.[0].results')
VIDEOS_COUNT=$(echo "$VIDEOS_DATA" | jq 'length')

# 統計情報を取得
echo "📈 統計情報を取得中..."
STATS_JSON=$(wrangler d1 execute $DB_NAME --remote --command="
SELECT 
  'total_artists' as key, 
  COUNT(*) as value 
FROM artists
UNION ALL
SELECT 
  'total_videos' as key, 
  COUNT(*) as value 
FROM videos
UNION ALL
SELECT 
  'videos_today' as key, 
  COUNT(*) as value 
FROM videos 
WHERE DATE(created_at) = DATE('now');" --json)

STATS_DATA=$(echo "$STATS_JSON" | jq '.[0].results')

# JSONファイルを作成
echo "💾 バックアップファイルを作成中..."
cat > "$BACKUP_FILE" << EOF
{
  "metadata": {
    "export_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "database_name": "$DB_NAME",
    "total_artists": $ARTISTS_COUNT,
    "total_videos": $VIDEOS_COUNT,
    "backup_version": "1.0"
  },
  "artists": $ARTISTS_DATA,
  "videos": $VIDEOS_DATA,
  "statistics": $STATS_DATA
}
EOF

# ファイルサイズを取得
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo ""
echo "✅ バックアップ完了!"
echo "📁 ファイル: $BACKUP_FILE"
echo "📏 サイズ: $FILE_SIZE"
echo "🎤 アーティスト: $ARTISTS_COUNT 件"
echo "🎬 動画: $VIDEOS_COUNT 件"
echo ""

# 最新のバックアップへのシンボリックリンクを作成
LATEST_LINK="$BACKUP_DIR/latest.json"
rm -f "$LATEST_LINK"
ln -sfn "$BACKUP_FILE" "$LATEST_LINK"
echo "🔗 最新バックアップ: $LATEST_LINK"

echo ""
echo "=== 使用方法 ==="
echo "バックアップの確認: jq '.' $BACKUP_FILE"
echo "復元: ./restore-data.sh $BACKUP_FILE"
echo "一覧表示: ls -la $BACKUP_DIR/"
echo ""