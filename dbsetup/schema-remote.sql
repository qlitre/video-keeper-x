-- Video Keeper X データベーススキーマ（リモート本番環境用）
-- 既存データを保護しつつ、新しいテーブルを作成

-- artists マスターテーブル
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- videos テーブル
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  video_url TEXT NOT NULL,
  x_account_id TEXT NOT NULL,
  artist_id TEXT,
  venue TEXT,
  event_date DATE,
  song_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_artist_id ON videos(artist_id);
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

-- 確認用クエリ
SELECT 'リモートデータベース初期化完了' as status;
SELECT COUNT(*) as artist_count FROM artists;
SELECT COUNT(*) as video_count FROM videos;