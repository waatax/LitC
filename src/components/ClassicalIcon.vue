<script setup lang="ts">
import { computed } from 'vue'

export type IconName =
  | 'today'
  | 'glimpse'
  | 'library'
  | 'compare'
  | 'wenhai'
  | 'profile'
  | 'quiz'
  | 'search'
  | 'menu'
  | 'close'
  | 'flame'
  | 'audio'
  | 'audio-playing'
  | 'pause'
  | 'play'
  | 'scholar'
  | 'hourglass'
  | 'sparkle'
  | 'heart'
  | 'crown'
  | 'feather'
  | 'scale'
  | 'leaf'
  | 'sword'
  | 'shield'
  | 'compass'
  | 'book-open'
  | 'target'
  | 'lock'
  | 'unlock'
  | 'glass'
  | 'speed'
  | 'refresh'
  | 'game'
  | 'check'
  | 'chevron-down'
  | 'chevron-right'
  | 'arrow-right'
  | 'empty'
  | 'star'
  | 'history'
  | 'quote'
  | 'headphones'
  | 'brush'
  | 'lantern'
  | 'dice'
  | 'copy'
  | 'eye'
  | 'temple'
  | 'scroll'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
    color?: string
    strokeWidth?: number | string
    filled?: boolean
  }>(),
  {
    size: 20,
    color: 'currentColor',
    strokeWidth: 1.7,
    filled: false,
  }
)

const sizePx = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <span
    class="classical-icon-wrap"
    :style="{ width: sizePx, height: sizePx, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }"
    aria-hidden="true"
  >
    <svg
      :width="sizePx"
      :height="sizePx"
      viewBox="0 0 24 24"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="classical-svg"
    >
      <!-- 1. 今日 (晨光朝日映照竹簡) -->
      <template v-if="name === 'today'">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
        <path d="M7 21h10" />
      </template>

      <!-- 2. 驚鴻 (展翅青鳥/飛羽仙思) -->
      <template v-else-if="name === 'glimpse'">
        <path d="M20.24 3.76a6 6 0 0 0-8.49 0L3.5 12.01l.75 3.74 3.74.75 8.25-8.25a6 6 0 0 0 0-8.49z" />
        <path d="M16 8l-6 6" />
        <path d="M17.5 15c-2.5 1-4 3.5-4 5.5 2.5 0 5-1.5 6-3.5" />
      </template>

      <!-- 3. 典籍庫 (線裝古籍卷帙) -->
      <template v-else-if="name === 'library'">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20" />
        <path d="M8 2v20" />
        <path d="M11 7h6M11 11h6M11 15h4" />
      </template>

      <!-- 4. 比較 (雙璧並映 / 衡鑑對照) -->
      <template v-else-if="name === 'compare'">
        <circle cx="8" cy="12" r="5" />
        <circle cx="16" cy="12" r="5" />
        <path d="M12 8v8" stroke-dasharray="1 1.5" />
      </template>

      <!-- 5. 文海 (水墨煙波雲水) -->
      <template v-else-if="name === 'wenhai'">
        <path d="M2 7c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1.5 4-1.5" />
        <path d="M2 13c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1.5 4-1.5" />
        <path d="M2 19c2.5-2 5.5-2 8 0s5.5 2 8 0 4-1.5 4-1.5" />
      </template>

      <!-- 6. 修行/履歷 (研墨方硯與登高臺階) -->
      <template v-else-if="name === 'profile'">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8v.01M12 16v.01" />
        <path d="M8 12h.01M16 12h.01" />
      </template>

      <!-- 7. 古文考驗 (毫端策問/卷軸試策) -->
      <template v-else-if="name === 'quiz'">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6M9 17h4" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
      </template>

      <!-- 8. 搜尋 (探微八卦玉鏡) -->
      <template v-else-if="name === 'search'">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8a3 3 0 0 0-3 3" stroke-width="1.2" />
      </template>

      <!-- 9. 更多 (典雅竹節選單) -->
      <template v-else-if="name === 'menu'">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </template>

      <!-- 10. 關閉 (精雅退避) -->
      <template v-else-if="name === 'close'">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </template>

      <!-- 11. 薪火相傳 (連續修持火炬) -->
      <template v-else-if="name === 'flame'">
        <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18a3.5 3.5 0 0 0 3.5-3.5c0-2-1.5-3.5-2.5-4.5-1-1-1-2.5-1-2.5s-2 2-2 4a2 2 0 0 1-1.5 2.5z" />
        <path d="M12 2c4 4.5 7 8 7 12a7 7 0 1 1-14 0c0-4 3.5-8 7-12z" />
      </template>

      <!-- 12. 雅音金石 (雅正誦讀/鐘磬清音) -->
      <template v-else-if="name === 'audio'">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </template>

      <!-- 13. 誦讀中動態 (音波共鳴) -->
      <template v-else-if="name === 'audio-playing'">
        <line x1="4" y1="10" x2="4" y2="14" />
        <line x1="8" y1="6" x2="8" y2="18" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="16" y1="7" x2="16" y2="17" />
        <line x1="20" y1="11" x2="20" y2="13" />
      </template>

      <!-- 14. 暫停 -->
      <template v-else-if="name === 'pause'">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </template>

      <!-- 15. 播放 -->
      <template v-else-if="name === 'play'">
        <polygon points="6 4 19 12 6 20 6 4" fill="currentColor" />
      </template>

      <!-- 16. 先賢作者 (儒者士人) -->
      <template v-else-if="name === 'scholar'">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        <path d="M10 3h4" />
      </template>

      <!-- 17. 歲月流變 (沙漏/時間) -->
      <template v-else-if="name === 'hourglass'">
        <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </template>

      <!-- 18. 靈光慧思 (四芒玉星) -->
      <template v-else-if="name === 'sparkle'">
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />
      </template>

      <!-- 19. 安頓身心 (澄懷蓮心) -->
      <template v-else-if="name === 'heart'">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </template>

      <!-- 20. 經世治略 (王道之冠/鼎彝) -->
      <template v-else-if="name === 'crown'">
        <path d="m2 6 4 12h12l4-12-6 5-4-7-4 7z" />
        <circle cx="12" cy="4" r="1" fill="currentColor" />
      </template>

      <!-- 21. 文藻風華 (翰墨羽管) -->
      <template v-else-if="name === 'feather'">
        <path d="M20.24 3.76a6 6 0 0 0-8.49 0L3.5 12.01l.75 3.74 3.74.75 8.25-8.25a6 6 0 0 0 0-8.49z" />
        <line x1="16" y1="8" x2="2" y2="22" />
      </template>

      <!-- 22. 法度明斷 (天平權衡) -->
      <template v-else-if="name === 'scale'">
        <path d="M12 3v18M6 8h12M6 8l-3 7h6zm12 0l-3 7h6z" />
        <path d="M9 21h6" />
      </template>

      <!-- 23. 道法自然 (幽蘭清葉) -->
      <template v-else-if="name === 'leaf'">
        <path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z" />
        <path d="M20 4c-5 5-9 10-9 16" />
      </template>

      <!-- 24. 兵學籌謀 (龍泉干戈) -->
      <template v-else-if="name === 'sword'">
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
        <line x1="13" y1="19" x2="19" y2="13" />
        <line x1="16" y1="16" x2="20" y2="20" />
        <line x1="19" y1="21" x2="21" y2="19" />
      </template>

      <!-- 25. 兼愛非攻 (守道堅盾) -->
      <template v-else-if="name === 'shield'">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 7v8" />
        <path d="M9 11h6" />
      </template>

      <!-- 26. 經緯司南 (學習路徑方向) -->
      <template v-else-if="name === 'compass'">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fill-opacity="0.15" />
      </template>

      <!-- 27. 開卷有益 (展開古卷) -->
      <template v-else-if="name === 'book-open'">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </template>

      <!-- 28. 射御立志 (修業目標) -->
      <template v-else-if="name === 'target'">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </template>

      <!-- 29. 鎖定 -->
      <template v-else-if="name === 'lock'">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </template>

      <!-- 30. 解鎖 -->
      <template v-else-if="name === 'unlock'">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 7.7-1.5" />
      </template>

      <!-- 31. 毛玻璃 (琉璃浮影) -->
      <template v-else-if="name === 'glass'">
        <circle cx="12" cy="12" r="9" />
        <path d="M7 12a5 5 0 0 1 5-5" />
        <path d="M12 17a5 5 0 0 0 5-5" stroke-dasharray="2 2" />
      </template>

      <!-- 32. 極速簡約 (迅疾風行) -->
      <template v-else-if="name === 'speed'">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </template>

      <!-- 33. 循環輪轉 (陰陽生息) -->
      <template v-else-if="name === 'refresh'">
        <path d="M21.5 2v6h-6" />
        <path d="M21.34 15.57a9 9 0 1 1-.57-8.38l6.73-5.19" />
      </template>

      <!-- 34. 益智牌陣 (七巧思辨) -->
      <template v-else-if="name === 'game'">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </template>

      <!-- 35. 印可成全 (打勾) -->
      <template v-else-if="name === 'check'">
        <polyline points="20 6 9 17 4 12" />
      </template>

      <!-- 36. 展開下拉箭頭 -->
      <template v-else-if="name === 'chevron-down'">
        <polyline points="6 9 12 15 18 9" />
      </template>

      <!-- 37. 前進箭頭 -->
      <template v-else-if="name === 'chevron-right'">
        <polyline points="9 18 15 12 9 6" />
      </template>

      <!-- 38. 長箭頭 -->
      <template v-else-if="name === 'arrow-right'">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </template>

      <!-- 39. 空白書軸 -->
      <template v-else-if="name === 'empty'">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3 3" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </template>

      <!-- 40. 史策青史 -->
      <template v-else-if="name === 'history'">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </template>

      <!-- 41. 名句引用 -->
      <template v-else-if="name === 'quote'">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8z" />
      </template>

      <!-- 42. 星芒 -->
      <template v-else-if="name === 'star'">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fill-opacity="0.2" />
      </template>

      <!-- 43. 辨音白話 (聆音耳鐸) -->
      <template v-else-if="name === 'headphones'">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </template>

      <!-- 44. 揮毫題跋 (兼毫毛筆) -->
      <template v-else-if="name === 'brush'">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </template>

      <!-- 45. 絳帳心燈 (宮燈心悟) -->
      <template v-else-if="name === 'lantern'">
        <path d="M9 3h6M12 1v2M7 6h10l-2 11H9L7 6z" />
        <line x1="12" y1="9" x2="12" y2="14" />
        <path d="M10 17v3M14 17v3M8 20h8" />
      </template>

      <!-- 46. 博局六博 (隨機漫步) -->
      <template v-else-if="name === 'dice'">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8" r="1.2" fill="currentColor" />
        <circle cx="16" cy="16" r="1.2" fill="currentColor" />
        <circle cx="8" cy="16" r="1.2" fill="currentColor" />
        <circle cx="16" cy="8" r="1.2" fill="currentColor" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </template>

      <!-- 47. 傳拓摹本 (複製摹刻) -->
      <template v-else-if="name === 'copy'">
        <rect x="8" y="8" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </template>

      <!-- 48. 澄觀凝眸 (凝眸沉浸) -->
      <template v-else-if="name === 'eye'">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </template>

      <!-- 49. 文脈道統 (太廟泮宮) -->
      <template v-else-if="name === 'temple'">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        <line x1="2" y1="9" x2="22" y2="9" />
      </template>

      <!-- 50. 竹帛古卷 (經卷書軸) -->
      <template v-else-if="name === 'scroll'">
        <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
        <path d="M6 4v16" />
        <line x1="10" y1="8" x2="16" y2="8" />
        <line x1="10" y1="12" x2="16" y2="12" />
        <line x1="10" y1="16" x2="14" y2="16" />
      </template>
    </svg>
  </span>
</template>

<style scoped>
.classical-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
}
.classical-svg {
  display: block;
  overflow: visible;
  transition: transform var(--duration-fast, 150ms) var(--ease-out, ease);
}
</style>
