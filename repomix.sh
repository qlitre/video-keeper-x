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
  