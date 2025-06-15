import { createRoute } from 'honox/factory'
import { XEmbed } from '../islands/x-embed'
import { Pagination } from '../components/Pagination'
import { getVideosWithCount, Video } from '../db'
import { calculatePagination, validatePageNumber, SETTINGS } from '../settings'

export default createRoute(async (c) => {
  // ミドルウェアで認証済み - ユーザー情報をコンテキストから取得
  const user = c.get('user')

  // ページング処理
  const pageParam = c.req.query('page')
  const search = c.req.query('query')?.trim() || ''

  // ホームページ用のページサイズを使用
  const limit = SETTINGS.HOME_VIDEOS_LIMIT

  // データベースから動画一覧を取得（総数も含む）
  const result = await getVideosWithCount(c, { query: search, limit: 1 }) // 一時的に1件取得して総数を確認
  const totalPages = Math.ceil(result.totalCount / limit)
  const currentPage = validatePageNumber(pageParam, totalPages)

  // 実際のページの動画を取得
  const offset = (currentPage - 1) * limit
  const { videos: videoList, totalCount } = await getVideosWithCount(c, {
    query: search,
    limit,
    offset,
  })
  const pagination = calculatePagination(totalCount, currentPage, limit)

  return c.render(
    <main class='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div class='px-4 py-6 sm:px-0'>
          <form method='get' class='mb-6 max-w-md mx-auto flex gap-2'>
            <input
              type='text'
              name='query'
              value={search}
              placeholder='アーティスト・曲名・会場名で検索'
              class='flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
            />
            <input type='hidden' name='page' value='1' />
            <button
              type='submit'
              class='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700'
            >
              検索
            </button>
            {search && (
              <a
                href='/'
                class='px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600'
              >
                クリア
              </a>
            )}
          </form>
          {/* 最新動画セクション */}
          {videoList.length > 0 && (
            <div class='mb-16'>
              <div class='flex items-center justify-between mb-6'>
                <div>
                  <h3 class='text-xl font-semibold text-gray-900'>
                    {search ? '検索結果' : '最近の投稿'}
                  </h3>
                  {pagination.totalCount > 0 && (
                    <p class='text-sm text-gray-600 mt-1'>
                      {pagination.totalCount}件中 {pagination.startItem}-{pagination.endItem}
                      件目を表示
                    </p>
                  )}
                </div>
                <a
                  href='/videos'
                  class='text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center'
                >
                  すべて見る
                  <svg class='ml-1 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </a>
              </div>

              <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {videoList.map((video) => (
                  <div
                    key={video.id}
                    class='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                  >
                    {/* コンパクトヘッダー */}
                    <div class='p-3 border-b border-gray-100'>
                      <h4 class='text-sm font-medium text-gray-900 truncate'>
                        {video.artist_name || '不明'}
                      </h4>
                      {video.song_name && (
                        <p class='text-xs text-gray-600 truncate mt-1'>{video.song_name}</p>
                      )}

                      {/* ライブ情報セクション */}
                      {(video.event_date || video.venue) && (
                        <div class='flex items-center gap-1 mt-2 p-2 bg-blue-50 rounded-md'>
                          <svg
                            class='h-3 w-3 text-blue-600'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <div class='flex flex-col'>
                            {video.event_date && (
                              <span class='text-xs text-blue-700 font-medium'>
                                {new Date(video.event_date).toLocaleDateString('ja-JP', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                            {video.venue && (
                              <span class='text-xs text-blue-600'>📍 {video.venue}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 投稿情報セクション */}
                      <div class='flex items-center gap-2 mt-2'>
                        <span class='text-xs text-gray-500'>@{video.x_account_id}</span>
                        <div class='flex items-center gap-1'>
                          <svg
                            class='h-3 w-3 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          <span class='text-xs text-gray-400'>
                            投稿:{' '}
                            {new Date(video.created_at).toLocaleDateString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 簡素化された埋め込みエリア */}
                    <div class='p-2'>
                      <XEmbed tweetUrl={video.video_url} width={300} />
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                startItem={pagination.startItem}
                endItem={pagination.endItem}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                basePath='/'
                searchQuery={search}
                compact={true}
              />
            </div>
          )}

          {/* 空の状態 - より控えめに */}
          {videoList.length === 0 && (
            <div class='text-center py-12'>
              <svg
                class='mx-auto h-16 w-16 text-gray-300'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='1'
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              <h3 class='mt-4 text-lg font-medium text-gray-900'>
                {search ? '検索結果が見つかりません' : 'まだ動画が投稿されていません'}
              </h3>
              <p class='mt-2 text-sm text-gray-500'>
                {search
                  ? '別のキーワードで検索してみてください'
                  : 'ヘッダーの「動画を投稿」ボタンから最初の動画を追加してみましょう'}
              </p>
            </div>
          )}
        </div>
    </main>
  )
})
