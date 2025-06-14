-- video-keeper-x データベーススキーマ
-- 開発時用: 既存テーブルを削除してから再作成

-- 既存テーブルを削除（外部キー制約があるため順序に注意）
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS artists;

-- artists マスターテーブル
CREATE TABLE artists (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- videos テーブル
CREATE TABLE videos (
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

-- 初期データ投入
INSERT INTO artists (id, name, name_kana) VALUES 
  ('01234567-89ab-cdef-0123-456789abcdef', '柴田聡子', 'シバタサトコ'),
  ('fedcba98-7654-3210-fedc-ba9876543210', 'kanekoayano', 'カネコアヤノ'),
  ('abcdef01-2345-6789-abcd-ef0123456789', '前野健太', 'マエノケンタ');

-- 確認用クエリ
SELECT 'artists テーブル作成完了' as status;
SELECT * FROM artists;

SELECT 'videos テーブル作成完了' as status;
SELECT COUNT(*) as video_count FROM videos;