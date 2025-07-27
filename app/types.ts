/**
 * 共通型定義
 */

export interface Artist {
  id: string
  name: string
  name_kana: string
}

export interface Video {
  id: string
  video_url: string
  x_account_id: string
  artist_name: string
  artist_id?: string
  venue: string | null
  event_date: string | null
  song_name: string | null
  created_at: string
}

export interface SearchOptions {
  query?: string
  limit?: number
  offset?: number
}

export interface VideoListResult {
  videos: Video[]
  totalCount: number
}

// フォーム関連の型
export interface FormData {
  video_url?: string
  x_account_id?: string
  artist?: Artist
  venue?: string
  event_date?: string
  song_name?: string
}

// コンポーネントProps型
export interface VideoAddFormProps {
  savedFormData?: string
  artists?: Artist[]
}

export interface VideoEditFormProps {
  video: Video
  artists: Artist[]
}

