import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

// ログインページ専用レンダラー（Headerなし）
export default jsxRenderer(({ children }) => {
  return (
    <html lang='ja'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
        <Link href='/app/style.css' rel='stylesheet' />
        <Script src='/app/client.ts' async />
      </head>
      <body>
        <div class='min-h-screen bg-gray-50'>{children}</div>
      </body>
    </html>
  )
})