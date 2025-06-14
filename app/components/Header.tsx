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
            <a href="/" class="text-lg sm:text-xl font-bold text-gray-900 hover:text-gray-700 truncate">
              Video Keeper X
            </a>
          </div>
          
          {/* デスクトップ用メニュー */}
          <div class="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
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
                <span class="text-sm text-gray-700 truncate max-w-24">
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

          {/* モバイル用メニュー */}
          <div class="md:hidden flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <a 
                  href="/videos/add" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md inline-flex items-center"
                  title="動画を投稿"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </a>
                <a 
                  href="/videos" 
                  class="text-gray-700 hover:text-gray-900 p-2 rounded-md"
                  title="一覧"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </a>
                <a 
                  href="/logout" 
                  class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                  title="ログアウト"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </a>
              </>
            ) : (
              <>
                <a 
                  href="/videos" 
                  class="text-gray-700 hover:text-gray-900 p-2 rounded-md"
                  title="一覧"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </a>
                <a 
                  href="/login" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 rounded-md text-xs font-medium"
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