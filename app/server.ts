import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'
import { secureHeaders } from 'hono/secure-headers'

const app = createApp()

// CSP設定でJavaScript実行を許可
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'"],
  },
}))

showRoutes(app)

export default app
