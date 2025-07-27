import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import VideoEditForm from '../../../islands/video-edit-form'
import { getVideoById, updateVideo } from '../../../db'

interface Artist {
  id: string
  name: string
  name_kana: string
}

const schema = z.object({
  video_url: z.string().url('有効なURLを入力してください'),
  x_account_id: z.string().min(1, 'Xアカウント名は必須です'),
  artist_id: z.string().min(1, 'アーティストを選択してください'),
  venue: z.string().optional(),
  event_date: z.string().optional(),
  song_name: z.string().optional(),
})

export default createRoute(async (c) => {
  const id = c.req.param('id')
  const error = c.req.query('error')
  const success = c.req.query('success')

  if (!id) {
    return c.redirect('/videos')
  }

  // 既存の動画データを取得
  const video = await getVideoById(c, id)
  if (!video) {
    return c.redirect('/videos')
  }
  
  // アーティスト一覧を取得
  let artists: Artist[] = []
  try {
    const artistsResult = await c.env.DB.prepare(
      'SELECT id, name, name_kana FROM artists ORDER BY name'
    ).all()
    artists = (artistsResult.results || []) as unknown as Artist[]
  } catch (error) {
    console.error('Failed to fetch artists:', error)
  }

  return c.render(
    <main class='max-w-3xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div class='px-4 py-6 sm:px-0'>
          <div class='bg-white shadow rounded-lg'>
            <div class='px-4 py-5 sm:p-6'>
              <h2 class='text-lg font-medium text-gray-900 mb-6'>動画情報を編集</h2>

              {error && (
                <div class='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                  {error === 'validation' && 'フォームの入力内容に問題があります。'}
                  {error === 'database' && 'データベースエラーが発生しました。'}
                  {error === 'server' && 'サーバーエラーが発生しました。'}
                  {error === 'not_found' && '指定された動画が見つかりません。'}
                </div>
              )}

              {success && (
                <div class='mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
                  動画情報が正常に更新されました！
                </div>
              )}
              <VideoEditForm video={video} artists={artists} />
            </div>
          </div>
        </div>
    </main>
  )
})

export const POST = createRoute(
  zValidator('form', schema, (result, c) => {
    if (!result.success) {
      const id = c.req.param('id')
      return c.redirect(`/videos/edit/${id}?error=validation`, 303)
    }
  }),
  async (c) => {
    try {
      const id = c.req.param('id')
      if (!id) {
        return c.redirect('/videos')
      }

      const { video_url, x_account_id, artist_id, venue, event_date, song_name } =
        c.req.valid('form')

      // 動画を更新
      const success = await updateVideo(c, id, {
        video_url,
        x_account_id,
        artist_id,
        venue,
        event_date,
        song_name
      })

      if (!success) {
        return c.redirect(`/videos/edit/${id}?error=not_found`, 303)
      }

      return c.redirect(`/videos/edit/${id}?success=1`, 303)
    } catch (err) {
      console.error('Video update error:', err)
      const id = c.req.param('id')
      return c.redirect(`/videos/edit/${id}?error=database`, 303)
    }
  }
)