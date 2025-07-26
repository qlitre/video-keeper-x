import { createRoute } from 'honox/factory'
import { basicAuth } from 'hono/basic-auth'

// 全てのルートにBasic認証を適用
export default createRoute(
  basicAuth({
    verifyUser: (username, password, c) => {
      const expectedPassword = c.env.BASIC_AUTH_PASSWORD || 'admin123'
      return username === 'admin' && password === expectedPassword
    },
    realm: 'Video Keeper X',
  })
)
