# CLAUDE.md
必ず日本語で解答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## アプリケーション要件

### 機能概要
Video Keeper X - Xに投稿された動画URLを保存・管理するアプリケーション

### 主要機能
1. **動画URL保存機能**
   - Xに投稿された動画URLをD1データベースに保存
   - メタ情報付きで保存（会場、日時、バンド名、曲名など）
   - 投稿者のXアカウントIDも同時に保存

2. **検索機能**
   - メタ情報を活用した動画検索
   - 会場、日時、バンド名、曲名による絞り込み

3. **認証・認可**
   - X（Twitter）アカウントでの認証連携
   - 認証されたユーザーのみが投稿可能
   - 初期段階では開発者のみが投稿可能（登録機能なし）

### 技術スタック
- **認証**: Supabase（将来的にFirebaseへの移行も検討）
- **データベース**: Cloudflare D1（SQLite）
- **認証プロバイダー**: X（Twitter）OAuth

### データベース設計（想定）
```sql
-- artists マスターテーブル
CREATE TABLE artists (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  name_kana TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- videos テーブル
CREATE TABLE videos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  video_url TEXT NOT NULL,
  x_account_id TEXT NOT NULL,
  artist_id TEXT,
  venue TEXT,
  event_date DATE,
  song_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- 初期データ例
INSERT INTO artists (id, name, name_kana) VALUES 
  ('01234567-89ab-cdef-0123-456789abcdef', '柴田聡子', 'シバタサトコ'),
  ('fedcba98-7654-3210-fedc-ba9876543210', 'kanekoayano', 'カネコアヤノ'),
  ('abcdef01-2345-6789-abcd-ef0123456789', '前野健太', 'マエノケンタ');
```

### セキュリティ要件
- 認証されていないユーザーはアクセス不可
- 開発者アカウントのホワイトリスト制御
- XアカウントIDの適切な管理

## Project Overview

This is a Cloudflare Workers application built with HonoX (Hono framework for full-stack development) and TailwindCSS. The project follows a file-based routing system and supports server-side rendering with client-side hydration through "islands" architecture.

## Architecture

- **Framework**: HonoX (full-stack Hono framework)
- **Runtime**: Cloudflare Workers
- **Build**: Vite with dual-mode builds (client + server)
- **Styling**: TailwindCSS v4 with Vite plugin
- **TypeScript**: Strict mode enabled with DOM and ESNext libs
- **JSX**: Uses Hono's JSX runtime (`hono/jsx`)

### Key Files
- `app/server.ts` - Server entry point using HonoX
- `app/client.ts` - Client hydration entry point  
- `app/routes/` - File-based routing (pages)
- `app/islands/` - Client-side interactive components
- `wrangler.jsonc` - Cloudflare Workers configuration

## Development Commands

```bash
# Start development server
yarn dev

# Build for production (client + server)
yarn build

# Preview with Cloudflare Workers runtime
yarn preview

# Deploy to Cloudflare Workers
yarn deploy
```

## Build Process

The build uses a dual-pass process:
1. `vite build --mode client` - Builds client-side assets
2. `vite build` - Builds server-side code for Workers

Both outputs are combined in the `dist/` directory for deployment.

## Routing & Components

- Routes are created using `createRoute()` from `honox/factory`
- Islands (client components) are imported and used in routes for interactivity
- Server-side rendering with selective client hydration

## Development Guidelines

### File Structure
- Ignore `node_modules/` directory when browsing or analyzing code
- Focus on application code in `app/` directory
- Configuration files are in project root
- Built files are in `dist/` (ignore during development)

### Code Analysis Scope
When reviewing or working with this codebase:
- **Focus on**: `app/routes/`, `app/islands/`, `app/components/`
- **Configuration**: Root-level config files (package.json, wrangler.jsonc, etc.)
- **Ignore**: `node_modules/`, `dist/`, `.wrangler/`, build artifacts
