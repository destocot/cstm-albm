import { RELEASE_DOT_COLORS } from '@/lib/colors'
import type { SlotOption } from '@/lib/data'

function loadImageCors(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new globalThis.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export async function downloadAlbumImage(artistName: string, tracks: SlotOption[]) {
  const W = 600
  const PAD = 32
  const ROW_H = 32
  const IMG_SIZE = 20
  const HEADER_H = 80
  const H = PAD + HEADER_H + tracks.length * ROW_H + PAD

  const uniqueCovers = [...new Set(tracks.map((t) => t.releaseCover).filter(Boolean))] as string[]
  const coverMap = new Map<string, HTMLImageElement | null>()
  await Promise.all(
    uniqueCovers.map(async (url) => {
      coverMap.set(url, await loadImageCors(url))
    }),
  )

  const canvas = document.createElement('canvas')
  canvas.width = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')!
  ctx.scale(2, 2)

  ctx.fillStyle = '#080810'
  ctx.fillRect(0, 0, W, H)

  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 300)
  grd.addColorStop(0, 'rgba(79,70,229,0.15)')
  grd.addColorStop(1, 'rgba(79,70,229,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  await document.fonts.load('bold 22px Syne')
  await document.fonts.load('13px Syne')

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px Syne, system-ui'
  ctx.fillText(`Your ${artistName} Album`, PAD, PAD + 26)

  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, PAD + HEADER_H - 16)
  ctx.lineTo(W - PAD, PAD + HEADER_H - 16)
  ctx.stroke()

  tracks.forEach((track, i) => {
    const rowTop = PAD + HEADER_H + i * ROW_H
    const centerY = rowTop + ROW_H / 2
    const textY = centerY + 4
    const dot = RELEASE_DOT_COLORS[track.releaseTitle] ?? '#6b7280'
    const img = track.releaseCover ? coverMap.get(track.releaseCover) : null

    if (img) {
      const imgX = PAD
      const imgY = centerY - IMG_SIZE / 2
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imgX, imgY, IMG_SIZE, IMG_SIZE, 3)
      ctx.clip()
      ctx.globalAlpha = 0.85
      ctx.drawImage(img, imgX, imgY, IMG_SIZE, IMG_SIZE)
      ctx.globalAlpha = 1
      ctx.restore()
    } else {
      ctx.fillStyle = dot
      ctx.beginPath()
      ctx.arc(PAD + 7, centerY, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '11px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(String(track.trackNumber).padStart(2, '0'), PAD + IMG_SIZE + 8, textY)

    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '13px Syne, system-ui'
    ctx.fillText(track.title, PAD + IMG_SIZE + 30, textY)

    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '11px Syne, system-ui'
    ctx.textAlign = 'right'
    ctx.fillText(track.releaseTitle, W - PAD, textY)
    ctx.textAlign = 'left'

    if (i < tracks.length - 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, rowTop + ROW_H)
      ctx.lineTo(W - PAD, rowTop + ROW_H)
      ctx.stroke()
    }
  })

  const slug = artistName.toLowerCase().replaceAll(' ', '-')
  const link = document.createElement('a')
  link.download = `my-${slug}-album.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
