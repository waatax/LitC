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
  if (html.classList.contains('theme-celadon')) {
    return '58, 94, 72' // Sage green ink
  } else if (html.classList.contains('theme-xuan') || html.classList.contains('light-theme')) {
    return '110, 90, 75' // Sepia ink
  } else if (html.classList.contains('theme-cinnabar')) {
    return '201, 169, 110' // Gold ink
  }
  return '232, 224, 212' // Charcoal ink
}

function handleResize(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function spawnParticle(x: number, y: number) {
  const baseColor = getInkColor()
  const pCount = Math.random() * 2 + 1
  for (let i = 0; i < pCount; i++) {
    particles.value.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.2, // slowly float upwards
      size: Math.random() * 30 + 15,
      alpha: Math.random() * 0.25 + 0.1,
      decay: Math.random() * 0.003 + 0.002,
      color: baseColor
    })
  }
}

function handleMouseMove(e: MouseEvent) {
  // Rate limit spawning for performance
  if (Math.random() < 0.2) {
    spawnParticle(e.clientX, e.clientY)
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0 && Math.random() < 0.2) {
    const touch = e.touches[0]
    spawnParticle(touch.clientX, touch.clientY)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  handleResize(canvas)
  window.addEventListener('resize', () => handleResize(canvas))
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })

  // Initialize with some ambient particles floating around
  const baseColor = getInkColor()
  for (let i = 0; i < 15; i++) {
    particles.value.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size: Math.random() * 40 + 20,
      alpha: Math.random() * 0.15 + 0.05,
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
      p.size += 0.05 // expand slightly like dispersing ink

      if (p.alpha <= 0) {
        particles.value.splice(i, 1)
        continue
      }

      ctx!.save()
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`)
      grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.4})`)
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
        y: window.innerHeight + 50, // spawn from bottom
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.6 - 0.2, // float up
        size: Math.random() * 50 + 30,
        alpha: Math.random() * 0.12 + 0.03,
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
  window.removeEventListener('resize', () => {})
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
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

/* Light themes: Xuan and Celadon */
html.theme-xuan .ink-canvas,
html.theme-celadon .ink-canvas,
html.light-theme .ink-canvas {
  mix-blend-mode: multiply;
  opacity: 0.4;
}

/* Dark themes: Charcoal and Cinnabar */
html.theme-charcoal .ink-canvas,
html.theme-cinnabar .ink-canvas,
html:not(.light-theme):not(.theme-xuan):not(.theme-celadon) .ink-canvas {
  mix-blend-mode: screen;
  opacity: 0.15;
}
</style>
