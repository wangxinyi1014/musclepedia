// 构建后将 data / images / videos 复制到 dist，供静态部署（GitHub Pages 等）使用
import { cpSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

for (const dir of ['data', 'images', 'videos']) {
  const src = resolve(root, dir)
  const dst = resolve(dist, dir)
  if (!existsSync(src)) {
    console.error(`[copy-assets] 源目录不存在: ${src}`)
    process.exit(1)
  }
  mkdirSync(dst, { recursive: true })
  cpSync(src, dst, { recursive: true })
  console.log(`[copy-assets] ${dir} -> dist/${dir}`)
}
