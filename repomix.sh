#!/bin/bash

# repomix.sh - HonoX/Cloudflare Workers プロジェクトのアーキテクチャ解析用スクリプト

echo "🔍 Repomixでプロジェクトアーキテクチャを解析中..."

repomix \
  --include="**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.json,**/*.jsonc,**/*.md,**/*.css" \
  --ignore="node_modules/**,dist/**,.wrangler/**,yarn.lock,package-lock.json" \
  --style=plain \
  --output=repomix-output.txt \
  --output-show-line-numbers \
  --verbose

echo "✅ 解析完了！"
echo "📁 出力ファイル: repomix-output.txt"
echo ""
echo "💡 使用方法:"
echo "   このファイルをAIに渡して、以下の観点で分析を依頼してください："
echo "   - HonoXフレームワークの使用方法"
echo "   - ファイルベースルーティングの構造"
echo "   - Islandsアーキテクチャの実装"
echo "   - Cloudflare Workers向けの設定"
echo "   - TailwindCSS v4の統合"