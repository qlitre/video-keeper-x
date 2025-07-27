import { createRoute } from 'honox/factory'
import { getVideoById, deleteVideo } from '../../../db'

export default createRoute(async (c) => {
  const id = c.req.param('id')
  const error = c.req.query('error')

  if (!id) {
    return c.redirect('/videos')
  }

  // 動画データを取得
  const video = await getVideoById(c, id)
  if (!video) {
    return c.redirect('/videos')
  }

  return c.render(
    <main class='max-w-3xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div class='px-4 py-6 sm:px-0'>
          <div class='bg-white shadow rounded-lg'>
            <div class='px-4 py-5 sm:p-6'>
              <div class='flex items-center mb-6'>
                <div class='flex-shrink-0'>
                  <svg class='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
                  </svg>
                </div>
                <div class='ml-4'>
                  <h2 class='text-lg font-medium text-gray-900'>動画の削除確認</h2>
                </div>
              </div>

              {error && (
                <div class='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                  {error === 'database' && 'データベースエラーが発生しました。'}
                  {error === 'server' && 'サーバーエラーが発生しました。'}
                </div>
              )}

              <div class='bg-gray-50 rounded-lg p-6 mb-6'>
                <h3 class='text-md font-medium text-gray-900 mb-4'>削除対象の動画</h3>
                <div class='space-y-3'>
                  <div class='flex justify-between'>
                    <span class='text-sm font-medium text-gray-500'>アーティスト名:</span>
                    <span class='text-sm text-gray-900'>{video.artist_name || '不明'}</span>
                  </div>
                  {video.song_name && (
                    <div class='flex justify-between'>
                      <span class='text-sm font-medium text-gray-500'>曲名:</span>
                      <span class='text-sm text-gray-900'>{video.song_name}</span>
                    </div>
                  )}
                  {video.venue && (
                    <div class='flex justify-between'>
                      <span class='text-sm font-medium text-gray-500'>会場:</span>
                      <span class='text-sm text-gray-900'>{video.venue}</span>
                    </div>
                  )}
                  {video.event_date && (
                    <div class='flex justify-between'>
                      <span class='text-sm font-medium text-gray-500'>開催日:</span>
                      <span class='text-sm text-gray-900'>
                        {new Date(video.event_date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                  <div class='flex justify-between'>
                    <span class='text-sm font-medium text-gray-500'>投稿者:</span>
                    <span class='text-sm text-gray-900'>@{video.x_account_id}</span>
                  </div>
                  <div class='flex justify-between'>
                    <span class='text-sm font-medium text-gray-500'>動画URL:</span>
                    <a 
                      href={video.video_url} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      class='text-sm text-indigo-600 hover:text-indigo-900 underline truncate max-w-xs'
                    >
                      動画を見る
                    </a>
                  </div>
                  <div class='flex justify-between'>
                    <span class='text-sm font-medium text-gray-500'>登録日:</span>
                    <span class='text-sm text-gray-900'>
                      {new Date(video.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>

              <div class='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                <div class='flex'>
                  <div class='flex-shrink-0'>
                    <svg class='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path fill-rule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clip-rule='evenodd' />
                    </svg>
                  </div>
                  <div class='ml-3'>
                    <h3 class='text-sm font-medium text-red-800'>
                      この操作は取り消せません
                    </h3>
                    <div class='mt-2 text-sm text-red-700'>
                      <p>
                        この動画データを削除すると、すべての関連情報が完全に削除されます。
                        削除後は復元できませんので、ご注意ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class='flex justify-end space-x-3'>
                <a
                  href='/videos'
                  class='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  キャンセル
                </a>
                <form method='post' style='display: inline;'>
                  <button
                    type='submit'
                    class='bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    削除する
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </main>
  )
})

export const POST = createRoute(async (c) => {
  try {
    const id = c.req.param('id')
    
    if (!id) {
      return c.redirect('/videos')
    }

    // 動画を削除
    const success = await deleteVideo(c, id)
    
    if (!success) {
      return c.redirect(`/videos/delete/${id}?error=database`, 303)
    }

    // 削除成功時は動画一覧に戻る
    return c.redirect('/videos', 303)
  } catch (err) {
    console.error('Video delete error:', err)
    const id = c.req.param('id')
    return c.redirect(`/videos/delete/${id}?error=server`, 303)
  }
})