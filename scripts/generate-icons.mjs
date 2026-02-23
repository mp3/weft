import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const svgPath = join(publicDir, 'icon.svg')
const svgBuffer = readFileSync(svgPath)

const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

const maskableIcons = [
  { name: 'icon-maskable-192x192.png', size: 192, padding: 48 },
  { name: 'icon-maskable-512x512.png', size: 512, padding: 128 },
]

async function generateIcon({ name, size }) {
  await sharp(svgBuffer).resize(size, size).png().toFile(join(publicDir, name))
  console.log(`Generated ${name}`)
}

async function generateMaskableIcon({ name, size, padding }) {
  const innerSize = size - padding * 2
  const inner = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    },
  })
    .composite([{ input: inner, top: padding, left: padding }])
    .png()
    .toFile(join(publicDir, name))

  console.log(`Generated ${name}`)
}

async function main() {
  await Promise.all([
    ...icons.map(generateIcon),
    ...maskableIcons.map(generateMaskableIcon),
  ])
  console.log('All icons generated.')
}

main().catch((error) => {
  console.error('Icon generation failed:', error)
  process.exit(1)
})
