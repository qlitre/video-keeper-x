import { createRoute } from 'honox/factory'
import { requireAuthMiddleware } from '../middleware/auth'

// 全てのルートに認証ミドルウェアを適用
// ただし、ログインページとログアウトページは除外
export default createRoute((c, next) => {
  const path = c.req.path
  
  // ログイン関連のページは認証をスキップ
  if (path === '/login' || path === '/logout') {
    return next()
  }
  
  // その他のページは認証必須
  return requireAuthMiddleware(c, next)
})