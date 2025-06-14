interface HeaderProps {
  isAuthenticated: boolean
  userEmail?: string | null
}

export function Header({ isAuthenticated, userEmail }: HeaderProps) {
  return (
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a href="/" class="text-xl font-bold text-gray-900 hover:text-gray-700">
              Video Keeper X
            </a>
          </div>
          <div class="flex items-center space-x-4">
            {isAuthenticated ? (
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
                  {userEmail}
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
  )
}