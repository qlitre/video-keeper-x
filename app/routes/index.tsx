import { createRoute } from 'honox/factory'
import { checkauth } from '../checkauth';

export default createRoute(async (c) => {
  const authResult = await checkauth(c);

  // 認証されていない場合はログインページにリダイレクト
  if (!authResult.isAuthenticated) {
    return c.redirect('/login', 303);
  }

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
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Xの動画URLを保存・管理
              </h2>
              <p class="text-gray-600 mb-8">
                Xに投稿された動画URLを保存し、メタ情報で検索・管理できます
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      動画を追加
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">
                      XのURLとメタ情報を入力して動画を保存
                    </p>
                    <button class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      動画を追加
                    </button>
                  </div>
                </div>
                
                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      動画を検索
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">
                      バンド名、会場、日時などで動画を検索
                    </p>
                    <button class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      動画を検索
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})
