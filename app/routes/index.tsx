import { createRoute } from 'honox/factory'
import { checkauth } from '../checkauth';

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

  // 認証されていない場合はログインページにリダイレクト
  if (!authResult.isAuthenticated) {
    return c.redirect('/login', 303);
  }

  // 最新の動画を取得（上位5件）
  const recentVideos = await c.env.DB.prepare(`
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
    LIMIT 5
  `).all();

  const videoList = recentVideos.results as unknown as Video[];

  return c.render(
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Video Keeper X</h1>
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

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          {/* アクションボタンエリア */}
          <div class="mb-8">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Xの動画URLを保存・管理
              </h2>
              <p class="text-gray-600">
                Xに投稿された動画URLを保存し、メタ情報で検索・管理できます
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/videos/add"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                + 動画を追加
              </a>
              <a 
                href="/videos"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
              >
                すべての動画を見る
              </a>
            </div>
          </div>

          {/* 最新動画セクション */}
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">最新の動画</h3>
            </div>
            
            {videoList.length === 0 ? (
              <div class="p-8 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h4 class="mt-2 text-sm font-medium text-gray-900">動画がありません</h4>
                <p class="mt-1 text-sm text-gray-500">
                  最初の動画を追加してみましょう
                </p>
                <a
                  href="/videos/add"
                  class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  動画を追加
                </a>
              </div>
            ) : (
              <div class="divide-y divide-gray-200">
                {videoList.map((video) => (
                  <div key={video.id} class="p-6 hover:bg-gray-50">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center mb-2">
                          <h4 class="text-lg font-medium text-gray-900 mr-3">
                            {video.artist_name || '不明'}
                          </h4>
                          {video.song_name && (
                            <span class="text-sm text-gray-600">
                              - {video.song_name}
                            </span>
                          )}
                        </div>
                        
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                          <span class="text-sm text-gray-500">
                            @{video.x_account_id}
                          </span>
                          {video.venue && (
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {video.venue}
                            </span>
                          )}
                          {video.event_date && (
                            <span class="text-xs text-gray-500">
                              {new Date(video.event_date).toLocaleDateString('ja-JP')}
                            </span>
                          )}
                        </div>
                        
                        <div class="text-xs text-gray-400">
                          {new Date(video.created_at).toLocaleDateString('ja-JP')} に登録
                        </div>
                      </div>
                      
                      <div class="ml-4">
                        <a 
                          href={video.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          動画を見る
                          <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                
                {videoList.length === 5 && (
                  <div class="p-4 text-center border-t">
                    <a 
                      href="/videos" 
                      class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      すべての動画を見る →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
})
