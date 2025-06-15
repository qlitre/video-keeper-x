import { Context, Next } from 'hono'
import { checkauth, AuthUser } from '../checkauth'

// 認証ユーザー情報をコンテキストに追加する型拡張
declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

/**
 * 認証必須ミドルウェア
 * 未認証の場合はログインページにリダイレクト
 */
export const requireAuthMiddleware = async (c: Context, next: Next) => {
  const authResult = await checkauth(c)
  
  if (!authResult.isAuthenticated || !authResult.user) {
    return c.redirect('/login')
  }
  
  // 認証済みユーザー情報をコンテキストに設定
  c.set('user', authResult.user)
  
  await next()
}

/**
 * API用認証ミドルウェア
 * 未認証の場合は401エラーを返す
 */
export const requireAuthApiMiddleware = async (c: Context, next: Next) => {
  const authResult = await checkauth(c)
  
  if (!authResult.isAuthenticated || !authResult.user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  // 認証済みユーザー情報をコンテキストに設定
  c.set('user', authResult.user)
  
  await next()
}