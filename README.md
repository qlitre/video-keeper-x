# Video Keeper X

Xに投稿された動画URLを保存・管理するWebアプリケーション

## 概要

Video Keeper XはX（旧Twitter）に投稿された動画URLを効率的に保存・管理するためのアプリケーションです。動画にはアーティスト名、会場、日時、曲名などのメタ情報を付与でき、検索機能により目的の動画を素早く見つけることができます。

## 主な機能

- **動画URL保存**: X投稿の動画URLをメタ情報と共に保存
- **検索機能**: アーティスト名、曲名、会場名による高速検索
- **ページング**: 大量の動画データを効率的に表示
- **レスポンシブデザイン**: PC・モバイル対応

## 技術スタック

- **フレームワーク**: [HonoX](https://github.com/honojs/honox) (Hono full-stack framework)
- **ランタイム**: Cloudflare Workers
- **データベース**: Cloudflare D1 (SQLite)
- **認証**: Supabase
- **スタイリング**: TailwindCSS v4
- **ビルドツール**: Vite
- **言語**: TypeScript

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 開発メモ

- 現在は個人利用のため全ページで認証が必要