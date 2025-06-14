import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { checkauth } from '../../checkauth'

const schema = z.object({
  video_url: z.string().url('有効なURLを入力してください'),
  x_account_id: z.string().min(1, 'Xアカウント名は必須です'),
  artist_name: z.string().min(1, 'アーティスト名は必須です'),
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

              <form action="/videos/add" method="post" class="space-y-6">
                <div>
                  <label for="video_url" class="block text-sm font-medium text-gray-700">
                    動画URL <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    id="video_url"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://x.com/username/status/..."
                  />
                  <p class="mt-1 text-sm text-gray-500">X（Twitter）の動画投稿URLを入力してください</p>
                </div>

                <div>
                  <label for="x_account_id" class="block text-sm font-medium text-gray-700">
                    投稿者のXアカウント名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="x_account_id"
                    id="x_account_id"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="@username (@ は含めない)"
                  />
                </div>

                <div>
                  <label for="artist_name" class="block text-sm font-medium text-gray-700">
                    アーティスト名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="artist_name"
                    id="artist_name"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="演奏者・バンド名"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="venue" class="block text-sm font-medium text-gray-700">
                      会場
                    </label>
                    <input
                      type="text"
                      name="venue"
                      id="venue"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="ライブハウス名など"
                    />
                  </div>

                  <div>
                    <label for="event_date" class="block text-sm font-medium text-gray-700">
                      開催日
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      id="event_date"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label for="song_name" class="block text-sm font-medium text-gray-700">
                    曲名
                  </label>
                  <input
                    type="text"
                    name="song_name"
                    id="song_name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="演奏された曲名"
                  />
                </div>

                <div class="flex justify-end space-x-3">
                  <a
                    href="/"
                    class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    キャンセル
                  </a>
                  <button
                    type="submit"
                    class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    保存
                  </button>
                </div>
              </form>
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

      const { video_url, x_account_id, artist_name, venue, event_date, song_name } = c.req.valid('form')
      
      // アーティストを検索または作成
      let artistId: string | null = null;
      
      // アーティストが既存かチェック
      const existingArtist = await c.env.DB.prepare(
        'SELECT id FROM artists WHERE name = ?'
      ).bind(artist_name).first();
      
      if (existingArtist) {
        artistId = existingArtist.id as string;
      } else {
        // 新しいアーティストを作成
        const artistInsert = await c.env.DB.prepare(
          'INSERT INTO artists (name) VALUES (?) RETURNING id'
        ).bind(artist_name).first();
        
        if (artistInsert) {
          artistId = artistInsert.id as string;
        }
      }
      
      // 動画を保存
      await c.env.DB.prepare(`
        INSERT INTO videos (video_url, x_account_id, artist_id, venue, event_date, song_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        video_url,
        x_account_id,
        artistId,
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