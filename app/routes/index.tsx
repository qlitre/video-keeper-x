import { createRoute } from 'honox/factory'
import { checkauth } from '../checkauth'
import { XEmbed } from '../islands/x-embed'

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
              <div>
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                  {videoList.map((video) => (
                    <div key={video.id} class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      {/* カードヘッダー */}
                      <div class="p-3 border-b border-gray-100">
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="text-base font-semibold text-gray-900 truncate">
                            {video.artist_name || '不明'}
                          </h4>
                          <div class="text-xs text-gray-400 ml-2">
                            {new Date(video.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        
                        {video.song_name && (
                          <div class="text-sm text-gray-600 mb-1 truncate">
                            🎵 {video.song_name}
                          </div>
                        )}
                        
                        <div class="flex flex-wrap items-center gap-1 text-xs">
                          <span class="text-gray-500 truncate">
                            @{video.x_account_id}
                          </span>
                          {video.venue && (
                            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              📍 {video.venue}
                            </span>
                          )}
                          {video.event_date && (
                            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              📅 {new Date(video.event_date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* X投稿埋め込みエリア */}
                      <div class="p-2">
                        <XEmbed tweetUrl={video.video_url} width={400} />
                        
                        {/* アクションボタン */}
                        <div class="flex justify-center mt-2 pb-2">
                          <button 
                            class="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                            title="お気に入り"
                          >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {videoList.length === 5 && (
                  <div class="p-4 text-center border-t bg-gray-50">
                    <a 
                      href="/videos" 
                      class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      すべての動画を見る
                      <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
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
