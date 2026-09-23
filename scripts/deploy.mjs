#!/usr/bin/env node
/**
 * ClassicFlow (LitC) — 跨平台 GitHub Pages 現代化安全部署管線
 * 
 * 解決 Windows 環境下 gh-pages npm 套件因經文篇章數量龐大（>1,100 個模組檔案）
 * 導致 spawn ENAMETOOLONG 命令列參數超長溢出崩潰之問題。
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')

function run(cmd, cwd = PROJECT_ROOT) {
  console.log(`\x1b[36m> ${cmd}\x1b[0m`)
  execSync(cmd, { stdio: 'inherit', cwd })
}

async function deploy() {
  console.log('════════════════════════════════════════════════════════════')
  console.log('🚀 經典文脈 ClassicFlow — GitHub Pages 全量自動部署管線')
  console.log('════════════════════════════════════════════════════════════\n')

  // 1. 執行雙重稽核、型別檢驗與建置
  console.log('📦 正在執行全量古文稽核、音韻中繼資料校驗與生產環境構建...')
  run('npm run build', PROJECT_ROOT)

  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('未找到 dist/ 建置產物目錄！')
  }

  // 2. 注入 .nojekyll，防止 GitHub Pages 靜態伺服器略過特殊資源目錄
  const noJekyllPath = path.join(DIST_DIR, '.nojekyll')
  fs.writeFileSync(noJekyllPath, '', 'utf-8')
  console.log('📄 已確保 .nojekyll 標記注入完成。')

  // 3. 在 dist 內建立專屬 gh-pages 分支獨立快照並推送
  console.log('\n🌐 正在將產物安全發布至 GitHub Pages (gh-pages)...')
  
  // 若 dist 內已有 .git 目錄，先進行重置
  const distGit = path.join(DIST_DIR, '.git')
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true })
  }

  run('git init', DIST_DIR)
  run('git config user.name "waatax"', DIST_DIR)
  run('git config user.email "waatax@users.noreply.github.com"', DIST_DIR)
  run('git checkout -B gh-pages', DIST_DIR)
  run('git add -A', DIST_DIR)
  run('git commit -m "deploy: update classicflow gh-pages audio & text review"', DIST_DIR)
  
  // 推送至遠端 gh-pages 分支
  run('git push -f https://github.com/waatax/LitC.git gh-pages', DIST_DIR)

  console.log('\n════════════════════════════════════════════════════════════')
  console.log('🎉 GitHub.io 部署成功！')
  console.log('🔗 線上站點：https://waatax.github.io/LitC/')
  console.log('════════════════════════════════════════════════════════════\n')
}

deploy().catch(err => {
  console.error('\n❌ 部署失敗:', err.message)
  process.exit(1)
})
