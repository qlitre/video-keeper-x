import { Context } from 'hono'
import { SETTINGS } from './settings'

export interface Video {
  id: string
  video_url: string
  x_account_id: string
  artist_name: string
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

/**
 * 動画の総数を取得する
 */
export async function getVideoCount(
  c: Context,
  query?: string
): Promise<number> {
  const queryArgs: any[] = []
  let whereClause = ''

  if (query && query.trim()) {
    whereClause = `
      WHERE a.name LIKE ? OR v.song_name LIKE ? OR v.venue LIKE ?
    `
    queryArgs.push(`%${query}%`, `%${query}%`, `%${query}%`)
  }

  const sql = `
    SELECT COUNT(*) as count
    FROM videos v
    LEFT JOIN artists a ON v.artist_id = a.id
    ${whereClause}
  `

  const result = await c.env.DB.prepare(sql)
    .bind(...queryArgs)
    .first()
  return (result as any)?.count || 0
}

/**
 * 動画一覧を取得する（ページング対応）
 */
export async function getVideos(
  c: Context,
  options: SearchOptions = {}
): Promise<Video[]> {
  const { query, limit = SETTINGS.VIDEOS_PER_PAGE, offset = 0 } = options
  const queryArgs: any[] = []
  let whereClause = ''

  if (query && query.trim()) {
    whereClause = `
      WHERE a.name LIKE ? OR v.song_name LIKE ? OR v.venue LIKE ?
    `
    queryArgs.push(`%${query}%`, `%${query}%`, `%${query}%`)
  }

  const sql = `
    SELECT 
      v.id,
      v.video_url,
      v.x_account_id,
      a.name as artist_name,
      v.venue,
      v.event_date,
      v.song_name,
      v.created_at
    FROM videos v
    LEFT JOIN artists a ON v.artist_id = a.id
    ${whereClause}
    ORDER BY v.event_date DESC
    LIMIT ?
    OFFSET ?
  `

  queryArgs.push(limit, offset)
  const result = await c.env.DB.prepare(sql)
    .bind(...queryArgs)
    .all()
  return result.results as unknown as Video[]
}

/**
 * 動画一覧と総数を取得する（ページング処理用）
 */
export async function getVideosWithCount(
  c: Context,
  options: SearchOptions = {}
): Promise<VideoListResult> {
  const [videos, totalCount] = await Promise.all([
    getVideos(c, options),
    getVideoCount(c, options.query),
  ])

  return {
    videos,
    totalCount,
  }
}

/**
 * 最新の動画を取得する（ホームページ用）
 */
export async function getRecentVideos(
  c: Context,
  options: SearchOptions = {}
): Promise<Video[]> {
  return getVideos(c, {
    ...options,
    limit: options.limit || SETTINGS.HOME_VIDEOS_LIMIT,
  })
}

/**
 * 動画一覧ページ用の動画を取得する（ページング対応）
 */
export async function getVideosForPage(
  c: Context,
  page: number,
  query?: string
): Promise<VideoListResult> {
  const offset = (page - 1) * SETTINGS.VIDEOS_PER_PAGE

  return getVideosWithCount(c, {
    query,
    limit: SETTINGS.VIDEOS_PER_PAGE,
    offset,
  })
}
