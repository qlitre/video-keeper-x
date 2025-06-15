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
   - アーティストマスター管理機能

2. **検索機能**
   - メタ情報を活用した動画検索
   - 会場、日時、バンド名、曲名による絞り込み
   - ページング機能付きの効率的な表示

3. **認証・認可**
   - 現在は個人利用のため全ページで認証が必要
   - Honoミドルウェアによる一元的な認証管理
   - 未認証ユーザーは自動的にログインページにリダイレクト

4. **管理機能**
   - アーティスト新規登録
   - 動画データのページング表示
   - レスポンシブデザイン対応

### 技術スタック
- **フレームワーク**: HonoX (Hono full-stack framework)
- **ランタイム**: Cloudflare Workers
- **認証**: Supabase
- **データベース**: Cloudflare D1（SQLite）
- **スタイリング**: TailwindCSS v4
- **ビルドツール**: Vite
- **言語**: TypeScript
- **コード整形**: Prettier

### 実装状況
- ✅ 基本的なCRUD機能
- ✅ ページング機能
- ✅ 検索機能
- ✅ 認証ミドルウェア
- ✅ レスポンシブデザイン
- ✅ コード整形環境
- ⏸️ X（Twitter）アカウント連携（一時保留）

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
- 認証されていないユーザーはアクセス不可（全ページ認証必須）
- Honoミドルウェアによる統一的な認証チェック
- Supabaseによるセッション管理

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
- `app/routes/_middleware.ts` - Authentication middleware
- `app/middleware/auth.ts` - Authentication logic
- `app/islands/` - Client-side interactive components
- `app/components/` - Reusable server components
- `app/db.ts` - Database operations
- `app/settings.ts` - Application configuration
- `wrangler.jsonc` - Cloudflare Workers configuration
- `.prettierrc` - Code formatting configuration

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

# Code formatting
yarn format

# Format check
yarn format:check
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
- Authentication middleware automatically applied to all routes (except `/login`, `/logout`)
- Pagination component shared across pages
- Database operations centralized in `app/db.ts`

## Development Guidelines

### File Structure
- Ignore `node_modules/` directory when browsing or analyzing code
- Focus on application code in `app/` directory
- Configuration files are in project root
- Built files are in `dist/` (ignore during development)

### Code Analysis Scope
When reviewing or working with this codebase:
- **Focus on**: `app/routes/`, `app/islands/`, `app/components/`, `app/middleware/`
- **Configuration**: Root-level config files (package.json, wrangler.jsonc, etc.)
- **Ignore**: `node_modules/`, `dist/`, `.wrangler/`, build artifacts

## Current Status

### Implemented Features
- ✅ **Authentication System**: Hono middleware-based authentication
- ✅ **Database Operations**: Centralized in `app/db.ts` with pagination support
- ✅ **Video Management**: CRUD operations for videos with metadata
- ✅ **Artist Management**: Master data management for artists
- ✅ **Search Functionality**: Full-text search across videos
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Responsive Design**: Mobile and desktop optimized
- ✅ **Code Quality**: Prettier formatting, TypeScript strict mode
- ✅ **Component Architecture**: Reusable pagination and header components

### Test Data
- 101 dummy video records available for testing pagination functionality
- 6 artist records for testing artist management

### Development Notes
- Authentication is required for all pages (personal use configuration)
- X account integration is temporarily on hold
- All code formatted with Prettier configuration
- Middleware-based authentication eliminates code duplication
