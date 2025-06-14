/**
 * X (旧 Twitter) 埋め込み用コンポーネント
 * 
 * @description
 * X投稿を動画付きで埋め込み表示するコンポーネント
 * Twitter公式のwidgets.jsを使用して、動画やメディアを含む投稿を完全に表示
 * 
 * @features
 * - 自動でwidgets.jsを読み込み
 * - 動画付きツイートの再生機能
 * - レスポンシブ対応
 * - エラーハンドリング付き
 */

import { useEffect, useRef } from 'hono/jsx'

interface XEmbedProps {
  /** X投稿のURL (例: https://x.com/username/status/1234567890) */
  tweetUrl: string
  /** 埋め込みの横幅 (デフォルト: 550px) */
  width?: number
}

/**
 * X投稿埋め込みコンポーネント
 */
export function XEmbed({ tweetUrl, width }: XEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // コンポーネントマウント時にX埋め込みウィジェットを生成
  useEffect(() => {
    if (!containerRef.current) return

    // widgets.jsが既に読み込まれているかチェック
    if ((window as any).twttr?.widgets) {
      createEmbed()
    } else {
      // widgets.jsがまだ読み込まれていない場合
      const existingScript = document.querySelector(
        'script[src="https://platform.twitter.com/widgets.js"]'
      ) as HTMLScriptElement | null

      if (existingScript) {
        // スクリプトが既に存在する場合は読み込み完了を待つ
        existingScript.addEventListener('load', createEmbed, { once: true })
      } else {
        // スクリプトを新規作成・追加
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.onload = createEmbed
        document.body.appendChild(script)
      }
    }

    /**
     * X埋め込みを実際に生成する関数
     */
    function createEmbed() {
      // 既存のコンテンツをクリア
      containerRef.current!.innerHTML = ''

      // URLからツイートIDを抽出
      const tweetId = tweetUrl.match(/status\/(\d+)/)?.[1]
      if (!tweetId) {
        // ツイートIDが取得できない場合のフォールバック
        const fallbackLink = document.createElement('a')
        fallbackLink.href = tweetUrl
        fallbackLink.textContent = 'Xで見る'
        fallbackLink.target = '_blank'
        fallbackLink.rel = 'noopener noreferrer'
        fallbackLink.className = 'text-blue-600 hover:text-blue-800'
        containerRef.current!.appendChild(fallbackLink)
        return
      }

      // Twitter埋め込みウィジェットを作成
      ;(window as any).twttr.widgets
        .createTweet(tweetId, containerRef.current, {
          dnt: true,          // Do-Not-Track有効
          theme: 'light',     // ライトテーマ
          align: 'center',    // 中央寄せ
          width: width || '100%',  // 横幅を最大に
        })
        .catch((error: unknown) => {
          console.error('X埋め込みエラー:', error)
          // エラー時のフォールバック表示
          const errorLink = document.createElement('a')
          errorLink.href = tweetUrl
          errorLink.textContent = 'Xで見る'
          errorLink.target = '_blank'
          errorLink.rel = 'noopener noreferrer'
          errorLink.className = 'text-blue-600 hover:text-blue-800'
          containerRef.current!.appendChild(errorLink)
        })
    }
  }, [tweetUrl, width])

  return (
    <div class="w-full">
      <div ref={containerRef} class="w-full" />
    </div>
  )
}