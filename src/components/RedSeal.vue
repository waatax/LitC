<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  size?: number
  animate?: boolean
}>(), {
  size: 64,
  animate: true
})

const textLength = computed(() => props.text.length)
const characters = computed(() => {
  if (textLength.value === 1) {
    return [props.text]
  }
  if (textLength.value === 2) {
    return [props.text[0], props.text[1]]
  }
  // 4 characters: standard seal script order (top-right, bottom-right, top-left, bottom-left)
  if (textLength.value === 4) {
    return [props.text[2], props.text[0], props.text[3], props.text[1]]
  }
  return props.text.split('').slice(0, 4)
})

const viewSize = 100
const borderPadding = 8
const innerSize = viewSize - borderPadding * 2
</script>

<template>
  <div 
    class="red-seal-wrapper"
    :class="{ 'seal-stamped-animation': animate }"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg 
      class="red-seal-svg"
      :viewBox="`0 0 ${viewSize} ${viewSize}`"
      xmlns="http://www.w3.org/2000/svg"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
    >
      <g class="seal-stamp-group">
        <!-- Outer border (crisp double frame) -->
        <rect 
          :x="borderPadding" 
          :y="borderPadding" 
          :width="innerSize" 
          :height="innerSize" 
          fill="rgba(178, 34, 34, 0.06)" 
          stroke="#b22222" 
          stroke-width="4.5" 
          rx="3"
        />
        <!-- Inner thin frame for classic double-border seal -->
        <rect 
          :x="borderPadding + 4" 
          :y="borderPadding + 4" 
          :width="innerSize - 8" 
          :height="innerSize - 8" 
          fill="none" 
          stroke="#b22222" 
          stroke-width="1.5" 
          rx="2"
        />

        <!-- Corner decorative stamp marks -->
        <circle cx="12" cy="12" r="1" fill="#b22222" />
        <circle cx="88" cy="12" r="1" fill="#b22222" />
        <circle cx="12" cy="88" r="1" fill="#b22222" />
        <circle cx="88" cy="88" r="1" fill="#b22222" />

        <!-- Stamp Text -->
        <!-- 1 character layout -->
        <text
          v-if="textLength === 1"
          x="50"
          y="68"
          class="seal-text-1"
          fill="#c82323"
          text-anchor="middle"
        >{{ text }}</text>

        <!-- 2 character layout -->
        <g v-else-if="textLength === 2" class="seal-text-2" fill="#c82323">
          <text x="32" y="66" text-anchor="middle">{{ characters[0] }}</text>
          <text x="68" y="66" text-anchor="middle">{{ characters[1] }}</text>
        </g>

        <!-- 3 or 4 character layout (arranged in a 2x2 grid) -->
        <g v-else class="seal-text-4" fill="#c82323">
          <text x="70" y="44" text-anchor="middle">{{ characters[1] }}</text>
          <text x="70" y="80" text-anchor="middle">{{ characters[3] || '印' }}</text>
          <text x="30" y="44" text-anchor="middle">{{ characters[0] }}</text>
          <text x="30" y="80" text-anchor="middle">{{ characters[2] }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.red-seal-wrapper {
  display: inline-block;
  user-select: none;
  transform: rotate(-4deg);
  opacity: 0.98;
  transition: transform 0.3s ease, filter 0.3s ease;
  vertical-align: middle;
}

.red-seal-wrapper:hover {
  transform: scale(1.08) rotate(0deg);
}

.red-seal-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 6px rgba(178, 34, 34, 0.25));
}

/* Crisp Seal Script & Xiaozhuan Font Stack */
text {
  font-family: '篆書', 'Xiaozhuan', 'SealScript', 'Noto Serif TC', 'KaiTi', 'DFKai-SB', serif;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.seal-text-1 {
  font-size: 52px;
}

.seal-text-2 text {
  font-size: 42px;
}

.seal-text-4 text {
  font-size: 34px;
}

.seal-stamped-animation {
  animation: stamp-pop 0.4s var(--ease-out, ease-out);
}

@keyframes stamp-pop {
  0% {
    transform: scale(1.4) rotate(-10deg);
    opacity: 0.4;
  }
  100% {
    transform: scale(1) rotate(-4deg);
    opacity: 0.98;
  }
}
</style>
