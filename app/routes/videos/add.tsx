import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { checkauth } from '../../checkauth'
import VideoAddForm from '../../islands/video-add-form'

const schema = z.object({
  video_url: z.string().url('有効なURLを入力してください'),
  x_account_id: z.string().min(1, 'Xアカウント名は必須です'),
  artist_id: z.string().min(1, 'アーティストを選択してください'),
  venue: z.string().optional(),
  event_date: z.string().optional(),
  song_name: z.string().optional(),
})

export default createRoute(async (c) => {
  const authResult = await checkauth(c);

  // 認証されていない場合はログインページにリダイレクト
  if (!authResult.isAuthenticated) {
    return c.redirect('/login', 303);
  }

  const error = c.req.query('error');
  const success = c.req.query('success');

  return c.render(
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-xl font-bold text-gray-900">Video Keeper X</a>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                {authResult.user?.email}
              </span>
              <a 
                href="/logout" 
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                ログアウト
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-6">動画URLを追加</h2>
              
              {error && (
                <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error === 'validation' && 'フォームの入力内容に問題があります。'}
                  {error === 'database' && 'データベースエラーが発生しました。'}
                  {error === 'server' && 'サーバーエラーが発生しました。'}
                </div>
              )}
              
              {success && (
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  動画URLが正常に保存されました！
                </div>
              )}

              <VideoAddForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})

export const POST = createRoute(
  zValidator('form', schema, (result, c) => {
    if (!result.success) {
      return c.redirect('/videos/add?error=validation', 303)
    }
  }), async (c) => {
    try {
      const authResult = await checkauth(c);

      // 認証されていない場合はログインページにリダイレクト
      if (!authResult.isAuthenticated) {
        return c.redirect('/login', 303);
      }

      const { video_url, x_account_id, artist_id, venue, event_date, song_name } = c.req.valid('form')
      
      // 動画を保存
      await c.env.DB.prepare(`
        INSERT INTO videos (video_url, x_account_id, artist_id, venue, event_date, song_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        video_url,
        x_account_id,
        artist_id,
        venue || null,
        event_date || null,
        song_name || null
      ).run();
      
      return c.redirect('/videos/add?success=1', 303);
    } catch (err) {
      console.error('Video save error:', err);
      return c.redirect('/videos/add?error=database', 303);
    }
  }
)