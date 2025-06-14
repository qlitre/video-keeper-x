# Database Setup Guide

Video Keeper X のデータベースセットアップガイド

## ファイル構成

### スキーマファイル
- `schema.sql` - **ローカル開発環境用** (DROP TABLE含む)
- `schema-remote.sql` - **リモート本番環境用** (CREATE IF NOT EXISTS)

### セットアップスクリプト
- `setup-db.sh` - ローカル開発環境用
- `setup-remote-db.sh` - リモート本番環境用
- `dump-data.sh` - ローカルデータダンプ用

## ローカル開発環境

```bash
# ローカルデータベースの初期化（データを削除して再作成）
./setup-db.sh

# または直接実行
wrangler d1 execute video-keeper-x --file=schema.sql
```

## リモート本番環境

```bash
# リモートデータベースの初期化（既存データを保護）
./setup-remote-db.sh

# または直接実行
wrangler d1 execute video-keeper-x --remote --file=schema-remote.sql
```

## データベース操作

### データのダンプ
```bash
# ローカルデータのダンプ
./dump-data.sh

# リモートデータの確認
wrangler d1 execute video-keeper-x --remote --command="SELECT * FROM videos;"
```

### 個別クエリ実行
```bash
# ローカル
wrangler d1 execute video-keeper-x --command="SELECT COUNT(*) FROM videos;"

# リモート
wrangler d1 execute video-keeper-x --remote --command="SELECT COUNT(*) FROM videos;"
```

## データベース構造

### テーブル
- `artists` - アーティストマスター
- `videos` - 動画情報

### インデックス（リモートのみ）
- `idx_videos_created_at` - 作成日時での高速検索
- `idx_videos_artist_id` - アーティストIDでの関連検索
- `idx_artists_name` - アーティスト名での検索

## 注意事項

⚠️ **重要**
- `schema.sql` は **DROP TABLE** を含むため、ローカル開発のみで使用
- `schema-remote.sql` は **CREATE IF NOT EXISTS** で既存データを保護
- リモート環境では必ず `schema-remote.sql` を使用すること

## トラブルシューティング

### データベースファイルの場所
ローカル: `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/[ID].sqlite`

### データベースのリセット
```bash
# ローカルのみ（注意: データが削除されます）
rm -rf .wrangler/state/v3/d1/
./setup-db.sh
```