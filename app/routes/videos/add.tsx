import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import VideoAddForm from '../../islands/video-add-form'
import { Header } from '../../components/Header'
import { getCookie, deleteCookie } from 'hono/cookie'

const schema = z.object({
  video_url: z.string().url('有効なURLを入力してください'),
  x_account_id: z.string().min(1, 'Xアカウント名は必須です'),
  artist_id: z.string().min(1, 'アーティストを選択してください'),
  venue: z.string().optional(),
  event_date: z.string().optional(),
  song_name: z.string().optional(),
})

export default createRoute(async (c) => {
  // ミドルウェアで認証済み - ユーザー情報をコンテキストから取得
  const user = c.get('user');

  const error = c.req.query('error');
  const success = c.req.query('success');
  
  // Cookieから保存されたフォームデータを取得
  const savedFormData = getCookie(c, 'video_form_data');

  return c.render(
    <div class="min-h-screen bg-gray-50">
      <Header 
        isAuthenticated={true} 
        userEmail={user.email}
      />
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
              <VideoAddForm savedFormData={savedFormData} />
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
      // ミドルウェアで認証済み - ユーザー情報をコンテキストから取得
      const user = c.get('user');

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
      
      // フォーム送信成功時にCookieをクリア
      deleteCookie(c, 'video_form_data');
      
      return c.redirect('/videos/add?success=1', 303);
    } catch (err) {
      console.error('Video save error:', err);
      return c.redirect('/videos/add?error=database', 303);
    }
  }
)