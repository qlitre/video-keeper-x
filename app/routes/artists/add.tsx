import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { checkauth } from '../../checkauth'

const schema = z.object({
  name: z.string().min(1, 'アーティスト名は必須です'),
  name_kana: z.string().min(1, 'アーティスト名（かな）は必須です'),
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
              <div class="mb-6">
                <h2 class="text-lg font-medium text-gray-900">新しいアーティストを登録</h2>
                <p class="mt-1 text-sm text-gray-600">
                  新しいアーティスト情報を登録します。登録後、動画登録時に選択できるようになります。
                </p>
              </div>
              
              {error && (
                <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error === 'validation' && 'フォームの入力内容に問題があります。'}
                  {error === 'duplicate' && 'このアーティスト名は既に登録されています。'}
                  {error === 'database' && 'データベースエラーが発生しました。'}
                  {error === 'server' && 'サーバーエラーが発生しました。'}
                </div>
              )}
              
              {success && (
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  アーティストが正常に登録されました！
                  <a href="/videos/add" class="ml-2 text-green-800 underline">
                    動画登録に戻る
                  </a>
                </div>
              )}

              <form action="/artists/add" method="post" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">
                      アーティスト名 <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="演奏者・バンド名"
                    />
                  </div>

                  <div>
                    <label for="name_kana" class="block text-sm font-medium text-gray-700">
                      アーティスト名（かな） <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name_kana"
                      id="name_kana"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="しばたさとこ"
                    />
                    <p class="mt-1 text-sm text-gray-500">検索・ソート用のかな表記を入力してください</p>
                  </div>
                </div>

                <div class="flex justify-end space-x-3">
                  <a
                    href="/videos/add"
                    class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    キャンセル
                  </a>
                  <button
                    type="submit"
                    class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    登録
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
      return c.redirect('/artists/add?error=validation', 303)
    }
  }), async (c) => {
    try {
      const authResult = await checkauth(c);

      // 認証されていない場合はログインページにリダイレクト
      if (!authResult.isAuthenticated) {
        return c.redirect('/login', 303);
      }

      const { name, name_kana } = c.req.valid('form')
      
      // 既存アーティストチェック
      const existingArtist = await c.env.DB.prepare(
        'SELECT id FROM artists WHERE name = ?'
      ).bind(name).first();
      
      if (existingArtist) {
        return c.redirect('/artists/add?error=duplicate', 303);
      }
      
      // アーティストを登録
      await c.env.DB.prepare(
        'INSERT INTO artists (name, name_kana) VALUES (?, ?)'
      ).bind(name, name_kana).run();
      
      return c.redirect('/artists/add?success=1', 303);
    } catch (err) {
      console.error('Artist save error:', err);
      return c.redirect('/artists/add?error=database', 303);
    }
  }
)