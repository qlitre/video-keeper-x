/**
 * アプリケーション設定
 */
export const SETTINGS = {
  // ページング設定
  VIDEOS_PER_PAGE: 20,           // 動画一覧ページでの1ページあたりの動画数
  HOME_VIDEOS_LIMIT: 12,         // ホームページで表示する最新動画数
  
  // 検索設定
  SEARCH_DEBOUNCE_MS: 300,       // 検索の遅延時間
  
  // その他設定
  MAX_VIDEO_TITLE_LENGTH: 100,   // 動画タイトルの最大文字数
  MAX_VENUE_NAME_LENGTH: 50,     // 会場名の最大文字数
} as const

/**
 * ページネーション計算用のヘルパー関数
 */
export function calculatePagination(totalCount: number, currentPage: number, itemsPerPage: number) {
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  
  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    startItem: (currentPage - 1) * itemsPerPage + 1,
    endItem: Math.min(currentPage * itemsPerPage, totalCount),
    totalCount
  }
}

/**
 * ページ番号をバリデーションする
 */
export function validatePageNumber(page: string | undefined, totalPages: number): number {
  const pageNum = parseInt(page || '1', 10)
  
  if (isNaN(pageNum) || pageNum < 1) {
    return 1
  }
  
  if (pageNum > totalPages && totalPages > 0) {
    return totalPages
  }
  
  return pageNum
}