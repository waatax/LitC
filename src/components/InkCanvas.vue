<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface InkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  decay: number
  color: string
}

let animationId: number | null = null
const particles = ref<InkParticle[]>([])

function getInkColor() {
  const html = document.documentElement
  if (
    html.classList.contains('theme-celadon') ||
    html.classList.contains('theme-xuan') ||
    html.classList.contains('light-theme') ||
    html.classList.contains('theme-light')
  ) {
    // 青藍色 (Cyan-Blue) for light pages
    return '14, 165, 233'
  }
  // 螢光天空藍 (Neon Sky Blue) for dark pages
  return '0, 229, 255'
}

function handleResize(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function spawnParticle(x: number, y: number, isClick = false) {
  const baseColor = getInkColor()
  const pCount = isClick ? Math.floor(Math.random() * 6 + 6) : (Math.random() * 2 + 1)
  for (let i = 0; i < pCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = isClick ? (Math.random() * 3.5 + 1.2) : (Math.random() * 1.5)
    particles.value.push({
      x,
      y,
      vx: isClick ? Math.cos(angle) * speed : (Math.random() - 0.5) * 1.5,
      vy: isClick ? Math.sin(angle) * speed : ((Math.random() - 0.5) * 1.5 - 0.2),
      size: isClick ? Math.random() * 35 + 20 : (Math.random() * 30 + 15),
      alpha: isClick ? Math.random() * 0.45 + 0.35 : (Math.random() * 0.3 + 0.15),
      decay: isClick ? Math.random() * 0.006 + 0.004 : (Math.random() * 0.003 + 0.002),
      color: baseColor
    })
  }
}

function handleMouseMove(e: MouseEvent) {
  if (Math.random() < 0.25) {
    spawnParticle(e.clientX, e.clientY, false)
  }
}

function handleMouseDown(e: MouseEvent) {
  spawnParticle(e.clientX, e.clientY, true)
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0 && Math.random() < 0.25) {
    const touch = e.touches[0]
    spawnParticle(touch.clientX, touch.clientY, false)
  }
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i]
      spawnParticle(touch.clientX, touch.clientY, true)
    }
  }
}

let resizeHandler: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  handleResize(canvas)
  resizeHandler = () => handleResize(canvas)
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })

  // Initialize with ambient particles
  const baseColor = getInkColor()
  for (let i = 0; i < 15; i++) {
    particles.value.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size: Math.random() * 40 + 20,
      alpha: Math.random() * 0.25 + 0.1,
      decay: Math.random() * 0.001 + 0.001,
      color: baseColor
    })
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  function animate() {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

    // Update and draw particles
    for (let i = particles.value.length - 1; i >= 0; i--) {
      const p = particles.value[i]
      p.x += p.vx
      p.y += p.vy
      p.alpha -= p.decay
      p.size += 0.08

      if (p.alpha <= 0) {
        particles.value.splice(i, 1)
        continue
      }

      ctx!.save()
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`)
      grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.45})`)
      grad.addColorStop(1, `rgba(${p.color}, 0)`)
      ctx!.fillStyle = grad
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.restore()
    }

    // Occasional ambient particle spawn
    if (particles.value.length < 25 && Math.random() < 0.02) {
      particles.value.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 50 + 30,
        alpha: Math.random() * 0.2 + 0.08,
        decay: Math.random() * 0.0015 + 0.0008,
        color: getInkColor()
      })
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchstart', handleTouchStart)
})
</script>

<template>
  <div class="ink-canvas-container">
    <canvas ref="canvasRef" class="ink-canvas" />
    <svg style="position: absolute; width: 0; height: 0; pointer-events: none;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.ink-canvas-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ink-canvas {
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: url(#ink-bleed); /* Apply the paper ink-bleed filter! */
}

/* Light themes: Xuan and Celadon (青藍色 Cyan Blue) */
html.theme-xuan .ink-canvas,
html.theme-celadon .ink-canvas,
html.theme-light .ink-canvas,
html.light-theme .ink-canvas {
  mix-blend-mode: multiply;
  opacity: 0.75;
}

/* Dark themes: Charcoal and Cinnabar (螢光天空藍 Neon Sky Blue) */
html.theme-charcoal .ink-canvas,
html.theme-cinnabar .ink-canvas,
html.theme-dark .ink-canvas,
html:not(.light-theme):not(.theme-xuan):not(.theme-celadon):not(.theme-light) .ink-canvas {
  mix-blend-mode: screen;
  opacity: 0.6;
}
</style>

