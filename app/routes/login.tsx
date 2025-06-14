
import { createRoute } from 'honox/factory'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createClient } from "@supabase/supabase-js";
import { setCookie } from 'hono/cookie'; //追加

const schema = z.object({
  email: z.string().min(3).includes('@'),
  password: z.string().min(8),
});


export default createRoute((c) => {
  const error = c.req.query('error');
  
  return c.render(
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Video Keeper X
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            ログインしてください
          </p>
        </div>
        
        {error && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ログインに失敗しました。メールアドレスとパスワードを確認してください。
          </div>
        )}
        
        <form action="/login" method="post" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <input 
                type="email" 
                name="email" 
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password" 
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export const POST = createRoute(
  zValidator('form', schema, (result, c) => {
    if (!result.success) {
      return c.redirect('/login?error=validation', 303)
    }
  }), async (c) => {
    try {
      const { email, password } = c.req.valid('form')
      const supabase = createClient(c.env.PROJECT_URL, c.env.API_KEY)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      
      if (error) {
        console.error('Supabase auth error:', error)
        return c.redirect('/login?error=credentials', 303)
      }
      
      if (data.user && data.session) {
        // Cookieにアクセストークンをセット
        setCookie(c, 'supabase_token', data.session.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          maxAge: 60 * 60 * 24 * 7 // 1週間
        })
        setCookie(c, 'supabase_refresh_token', data.session.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          maxAge: 60 * 60 * 24 * 30 // 30日
        })
        return c.redirect('/', 303)
      }
      
      return c.redirect('/login?error=credentials', 303)
    } catch (err) {
      console.error('Login error:', err)
      return c.redirect('/login?error=server', 303)
    }
  })