import { createRoute } from 'honox/factory'
import { checkauth } from '../checkauth'
import { XEmbed } from '../islands/x-embed'
import { Header } from '../components/Header'

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

  // クエリパラメータによる検索対応
  const search = c.req.query('query')?.trim() || ''
  const queryArgs: any[] = []
  let whereClause = ''

  if (search) {
    whereClause = `
      WHERE a.name LIKE ? OR v.song_name LIKE ? OR v.venue LIKE ?
    `
    queryArgs.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

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
    ${whereClause}
    ORDER BY v.created_at DESC
    LIMIT 5
  `).bind(...queryArgs).all();

  const videoList = recentVideos.results as unknown as Video[];

  return c.render(
    <div class="min-h-screen bg-gray-50">
      <Header 
        isAuthenticated={authResult.isAuthenticated} 
        userEmail={authResult.user?.email}
      />

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <form method="get" class="mb-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              name="query"
              value={search}
              placeholder="アーティスト・曲名・会場名で検索"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              検索
            </button>
          </form>
          {/* ヒーローセクション */}
          <div class="text-center mb-12">
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Xに投稿された動画URLを保存し、メタ情報で検索・管理するプロジェクトです。
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
                {videoList.map((video) => (
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
                      
                      {/* ライブ情報セクション */}
                      {(video.event_date || video.venue) && (
                        <div class="flex items-center gap-1 mt-2 p-2 bg-blue-50 rounded-md">
                          <svg class="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div class="flex flex-col">
                            {video.event_date && (
                              <span class="text-xs text-blue-700 font-medium">
                                {new Date(video.event_date).toLocaleDateString('ja-JP', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            )}
                            {video.venue && (
                              <span class="text-xs text-blue-600">
                                📍 {video.venue}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 投稿情報セクション */}
                      <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-gray-500">@{video.x_account_id}</span>
                        <div class="flex items-center gap-1">
                          <svg class="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="text-xs text-gray-400">
                            投稿: {new Date(video.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
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
