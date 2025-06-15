import { createRoute } from 'honox/factory'
import { requireAuthApiMiddleware } from '../../middleware/auth'

// API用認証ミドルウェア
// 未認証の場合は401エラーを返す
export default createRoute(requireAuthApiMiddleware)
