interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  startItem: number
  endItem: number
  hasNextPage: boolean
  hasPrevPage: boolean
  basePath: string
  searchQuery?: string
  compact?: boolean // ホームページ用の簡素版
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  startItem,
  endItem,
  hasNextPage,
  hasPrevPage,
  basePath,
  searchQuery,
  compact = false,
}: PaginationProps) {
  // URLパラメータを構築
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (searchQuery) {
      if (basePath === '/videos') {
        params.set('search', searchQuery)
      } else {
        params.set('query', searchQuery)
      }
    }
    return `${basePath}?${params.toString()}`
  }

  // ページ番号の数を決定（コンパクト版は3個、通常版は5個）
  const maxPageNumbers = compact ? 3 : 5

  // 表示するページ番号を計算
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= maxPageNumbers) {
      // 総ページ数が最大表示数以下の場合、すべて表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= Math.ceil(maxPageNumbers / 2)) {
      // 現在のページが前半の場合
      for (let i = 1; i <= maxPageNumbers; i++) {
        pages.push(i)
      }
    } else if (currentPage >= totalPages - Math.floor(maxPageNumbers / 2)) {
      // 現在のページが後半の場合
      for (let i = totalPages - maxPageNumbers + 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 現在のページが中央の場合
      const start = currentPage - Math.floor(maxPageNumbers / 2)
      for (let i = start; i < start + maxPageNumbers; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div
      class={`flex items-center ${compact ? 'justify-center' : 'justify-between'} mt-6`}
    >
      {!compact && (
        <div class="text-sm text-gray-700">
          {totalCount}件中 {startItem}-{endItem}件目を表示
        </div>
      )}

      <div class="flex items-center space-x-2">
        {/* 前のページ */}
        {hasPrevPage ? (
          <a
            href={buildUrl(currentPage - 1)}
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            前へ
          </a>
        ) : (
          <span class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            前へ
          </span>
        )}

        {/* ページ番号 */}
        <div class="flex space-x-1">
          {pageNumbers.map(pageNum => (
            <a
              key={pageNum}
              href={buildUrl(pageNum)}
              class={`px-3 py-2 border rounded-md text-sm font-medium ${
                pageNum === currentPage
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>

        {/* 次のページ */}
        {hasNextPage ? (
          <a
            href={buildUrl(currentPage + 1)}
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            次へ
          </a>
        ) : (
          <span class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            次へ
          </span>
        )}
      </div>
    </div>
  )
}
