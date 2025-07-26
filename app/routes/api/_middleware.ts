import { createRoute } from 'honox/factory'
import { bearerAuth } from 'hono/bearer-auth'

// API用Bearer認証ミドルウェア
// 未認証の場合は401エラーを返す
export default createRoute(
  bearerAuth({
    verifyToken: async (token, c) => {
      const expectedToken = c.env.API_BEARER_TOKEN || 'honoiscool'
      return token === expectedToken
    },
    realm: 'Video Keeper X API',
  })
)
