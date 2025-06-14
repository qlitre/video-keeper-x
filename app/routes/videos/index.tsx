import { createRoute } from 'honox/factory'
import { checkauth } from '../../checkauth'
import { Header } from '../../components/Header'

interface Video {
  id: string
  video_url: string
  x_account_id: string
  artist_name: string
  venue: string | null
  event_date: string | null
  song_name: string | null
  created_at: string
}

export default createRoute(async (c) => {
  const authResult = await checkauth(c);

  // 認証チェック結果を取得（未認証でも閲覧は許可）

  // データベースから動画一覧を取得（アーティスト名もJOINで取得）
  const videos = await c.env.DB.prepare(`
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
    ORDER BY v.created_at DESC
  `).all();

  const videoList = videos.results as unknown as Video[];

  return c.render(
    <div class="min-h-screen bg-gray-50">
      <Header 
        isAuthenticated={authResult.isAuthenticated} 
        userEmail={authResult.user?.email}
      />

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="mb-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">動画一覧</h1>
            <div class="text-sm text-gray-600">
              {videoList.length}件の動画が登録されています
            </div>
          </div>

          {videoList.length === 0 ? (
            <div class="bg-white shadow rounded-lg p-8">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">動画がありません</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {authResult.isAuthenticated 
                    ? '最初の動画を追加してみましょう' 
                    : 'まだ動画が投稿されていません'
                  }
                </p>
                {authResult.isAuthenticated ? (
                  <a
                    href="/videos/add"
                    class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    動画を追加
                  </a>
                ) : (
                  <a
                    href="/login"
                    class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    ログインして投稿
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        動画・アーティスト
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        詳細情報
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        投稿者
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録日
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {videoList.map((video) => (
                      <tr key={video.id} class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div class="text-sm font-medium text-gray-900">
                              {video.artist_name || '不明'}
                            </div>
                            {video.song_name && (
                              <div class="text-sm text-gray-500">
                                {video.song_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="text-sm text-gray-900">
                            {video.venue && (
                              <div class="mb-1">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {video.venue}
                                </span>
                              </div>
                            )}
                            {video.event_date && (
                              <div class="text-xs text-gray-500">
                                {new Date(video.event_date).toLocaleDateString('ja-JP')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            @{video.x_account_id}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(video.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a 
                            href={video.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            動画を見る
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
})