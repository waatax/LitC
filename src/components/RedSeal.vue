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
  // If 4 characters, arrange them standard seal script order (top-right, bottom-right, top-left, bottom-left)
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
    >
      <defs>
        <!-- Paper/Ink distress filter for organic stamp feel -->
        <filter id="seal-distress" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          
          <!-- Combine with a dirt/texture mask -->
          <feComponentTransfer in="noise" result="brightNoise">
            <feFuncR type="linear" slope="1.5" />
            <feFuncG type="linear" slope="1.5" />
            <feFuncB type="linear" slope="1.5" />
          </feComponentTransfer>
          <feBlend mode="multiply" in="displaced" in2="brightNoise" />
        </filter>
      </defs>

      <g filter="url(#seal-distress)">
        <!-- Outer border (thick, distressed) -->
        <rect 
          :x="borderPadding" 
          :y="borderPadding" 
          :width="innerSize" 
          :height="innerSize" 
          fill="none" 
          stroke="#b22222" 
          stroke-width="5" 
          rx="2"
        />
        <!-- Inner thin border for classic double-frame style -->
        <rect 
          :x="borderPadding + 4" 
          :y="borderPadding + 4" 
          :width="innerSize - 8" 
          :height="innerSize - 8" 
          fill="none" 
          stroke="#b22222" 
          stroke-width="1.5" 
          rx="1"
          opacity="0.95"
        />

        <!-- Stamp Text -->
        <!-- 1 character layout -->
        <text
          v-if="textLength === 1"
          x="50"
          y="68"
          class="seal-text-1"
          fill="#b22222"
          text-anchor="middle"
        >{{ text }}</text>

        <!-- 2 character layout -->
        <g v-else-if="textLength === 2" class="seal-text-2" fill="#b22222">
          <text x="32" y="65" text-anchor="middle">{{ characters[0] }}</text>
          <text x="68" y="65" text-anchor="middle">{{ characters[1] }}</text>
        </g>

        <!-- 3 or 4 character layout (arranged in a 2x2 grid) -->
        <g v-else class="seal-text-4" fill="#b22222">
          <!-- Top right -->
          <text x="70" y="44" text-anchor="middle">{{ characters[1] }}</text>
          <!-- Bottom right -->
          <text x="70" y="80" text-anchor="middle">{{ characters[3] || '印' }}</text>
          <!-- Top left -->
          <text x="30" y="44" text-anchor="middle">{{ characters[0] }}</text>
          <!-- Bottom left -->
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
  transform: rotate(-6deg);
  opacity: 0.95;
  transition: transform 0.3s ease;
}

.red-seal-wrapper:hover {
  transform: scale(1.08) rotate(-2deg);
}

.red-seal-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(178, 34, 34, 0.15));
}

/* Classical typography styles for seals */
text {
  font-family: 'Noto Serif TC', 'KaiTi', 'BiauKai', 'DFKai-SB', serif;
  font-weight: 900;
}

.seal-text-1 {
  font-size: 50px;
}

.seal-text-2 text {
  font-size: 40px;
}

.seal-text-4 text {
  font-size: 32px;
}
</style>
