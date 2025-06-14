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

  // 認証チェック結果を取得（未認証でも閲覧は許可）

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
              {authResult.isAuthenticated ? (
                // ログイン済みユーザー向けヘッダー
                <>
                  <a 
                    href="/videos/add" 
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    動画を投稿
                  </a>
                  <a 
                    href="/videos" 
                    class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    一覧
                  </a>
                  <span class="text-sm text-gray-700">
                    {authResult.user?.email}
                  </span>
                  <a 
                    href="/logout" 
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ログアウト
                  </a>
                </>
              ) : (
                // 未ログインユーザー向けヘッダー
                <>
                  <a 
                    href="/videos" 
                    class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    一覧
                  </a>
                  <a 
                    href="/login" 
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    ログイン
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          {/* ヒーローセクション */}
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Xの動画URLを保存・管理
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Xに投稿された動画URLを保存し、メタ情報で検索・管理できるプラットフォームです
            </p>
          </div>

          {/* 最新動画セクション */}
          {videoList.length > 0 && (
            <div class="mb-16">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900">最近の投稿</h3>
                <a 
                  href="/videos" 
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  すべて見る
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videoList.slice(0, 4).map((video) => (
                  <div key={video.id} class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* コンパクトヘッダー */}
                    <div class="p-3 border-b border-gray-100">
                      <h4 class="text-sm font-medium text-gray-900 truncate">
                        {video.artist_name || '不明'}
                      </h4>
                      {video.song_name && (
                        <p class="text-xs text-gray-600 truncate mt-1">
                          {video.song_name}
                        </p>
                      )}
                      <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-gray-500">@{video.x_account_id}</span>
                        <span class="text-xs text-gray-400">
                          {new Date(video.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    {/* 簡素化された埋め込みエリア */}
                    <div class="p-2">
                      <XEmbed tweetUrl={video.video_url} width={300} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 空の状態 - より控えめに */}
          {videoList.length === 0 && (
            <div class="text-center py-12">
              <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">まだ動画が投稿されていません</h3>
              <p class="mt-2 text-sm text-gray-500">
                {authResult.isAuthenticated 
                  ? 'ヘッダーの「動画を投稿」ボタンから最初の動画を追加してみましょう' 
                  : 'ユーザーが動画を投稿すると、ここに表示されます'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
})
