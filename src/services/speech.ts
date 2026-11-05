import { ref, reactive } from 'vue'
import { getAudioFileUrl, getAudioFileMeta } from '@/data/audioManifest'

export type SpeechMode = 'canonical' | 'vernacular' | 'bilingual'
export type SpeechRate = 0.5 | 0.75 | 0.8 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | number
export type AudioSourceType = 'file' | 'tts'
export type PlaybackMode = 'sequential' | 'loop-single' | 'loop-all'
export type SleepTimerOption = 0 | 15 | 30 | 45 | 'end-of-chapter'

export interface SpeedPreset {
  rate: number
  label: string
  desc: string
}

export const SPEED_PRESETS: SpeedPreset[] = [
  { rate: 0.5, label: '0.5x', desc: '慢吟審音' },
  { rate: 0.75, label: '0.75x', desc: '雅正涵泳' },
  { rate: 1.0, label: '1.0x', desc: '常速研習' },
  { rate: 1.25, label: '1.25x', desc: '流暢通讀' },
  { rate: 1.5, label: '1.5x', desc: '敏捷複習' },
  { rate: 2.0, label: '2.0x', desc: '極速檢索' },
]

export interface SpeechPlaylistItem {
  passageId: string
  chapterId: string
  canonicalText: string
  vernacularText?: string
  chapterTitle?: string
  workTitle?: string
}

export interface ClassicalRadioStation {
  id: string
  title: string
  subtitle: string
  sealChar: string
  ambientDefault: 'guqin' | 'rain' | 'wind' | 'stream'
  playlist: SpeechPlaylistItem[]
}

export const CLASSICAL_RADIO_STATIONS: ClassicalRadioStation[] = [
  {
    id: 'radio-dao-zen',
    title: '道法自然・先秦哲思靜心電臺',
    subtitle: '老莊玄旨與四書修心名段，適合靜坐、品茗與安頓身心',
    sealChar: '玄',
    ambientDefault: 'guqin',
    playlist: [
      {
        passageId: 'dao-de-jing_ch-1_p-1',
        chapterId: 'dao-de-jing_ch-1',
        workTitle: '道德經',
        chapterTitle: '第一章：道可道',
        canonicalText: '道可道，非常道。名可名，非常名。無名天地之始；有名萬物之母。故常無，欲以觀其妙；常有，欲以觀其徼。此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。',
        vernacularText: '可以用言語表達的道，就不是永恆不變的常道；可以明確命名的名，就不是恆常不變的名。無名是天地的原始開端；有名是化育萬物的根源。常處於無欲之境以體察道的奧妙，常處於有欲之境以觀察萬物的端倪。玄妙而又深遠，正是通往一切奧妙的大門。',
      },
      {
        passageId: 'dao-de-jing_ch-8_p-1',
        chapterId: 'dao-de-jing_ch-8',
        workTitle: '道德經',
        chapterTitle: '第八章：上善若水',
        canonicalText: '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。居善地，心善淵，與善仁，言善信，政善治，事善能，動善時。夫唯不爭，故無尤。',
        vernacularText: '最崇高的善行就像水一樣。水善於滋養萬物而不與萬物相爭，停留在眾人所厭惡的低窪之處，所以最接近於道。正因為不與人爭奪，所以沒有過失與怨尤。',
      },
      {
        passageId: 'da-xue_ch-1_p-1',
        chapterId: 'da-xue_ch-1',
        workTitle: '大學',
        chapterTitle: '大學之道',
        canonicalText: '大學之道，在明明德，在親民，在止於至善。知止而後有定，定而後能靜，靜而後能安，安而後能慮，慮而後能得。物有本末，事有終始，知所先後，則近道矣。',
        vernacularText: '大學的根本宗旨，在於彰顯光明純正的德性，在於親愛並教化百姓，在於達到最完善的境界。知道所當止的目標才能志向堅定，心神寧靜安穩，進而思慮周詳並有所收穫。',
      },
      {
        passageId: 'zhong-yong_ch-1_p-1',
        chapterId: 'zhong-yong_ch-1',
        workTitle: '中庸',
        chapterTitle: '天命之謂性',
        canonicalText: '天命之謂性，率性之謂道，修道之謂教。道也者，不可須臾離也，可離非道也。是故君子戒慎乎其所不睹，恐懼乎其所不聞。莫見乎隱，莫顯乎微，故君子慎其獨也。',
        vernacularText: '上天賦予人的稟賦叫做本性，順從本性行事叫做道，修明並推行道叫做教化。喜怒哀樂未發之時稱為中，發而合乎節度稱為和。致中和，天地各安其位，萬物欣欣向榮。',
      },
      {
        passageId: 'zhuangzi_ch-1_p-1',
        chapterId: 'zhuangzi_ch-1',
        workTitle: '莊子',
        chapterTitle: '逍遙遊',
        canonicalText: '北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也；怒而飛，其翼若垂天之雲。',
        vernacularText: '北方深海有一條大魚名叫鯤，變化為大鳥名叫鵬。當它振翅高飛時，雙翼如同天邊垂掛的雲彩，乘著六月長風直上九萬里高空。',
      },
    ],
  },
  {
    id: 'radio-literary-gems',
    title: '文心千古・傳世古文名篇連播',
    subtitle: '精選《古文觀止》與《論語》不朽篇章，涵泳歷代文人風骨',
    sealChar: '文',
    ambientDefault: 'stream',
    playlist: [
      {
        passageId: 'gu-wen-guan-zhi_ch-57_p-1',
        chapterId: 'gu-wen-guan-zhi_ch-57',
        workTitle: '古文觀止',
        chapterTitle: '桃花源記（陶淵明）',
        canonicalText: '晉太元中，武陵人捕魚為業。緣溪行，忘路之遠近。忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。漁人甚異之，復前行，欲窮其林。',
        vernacularText: '東晉太元年間，武陵郡有位漁人順著溪流划船前行，忽然遇見一片桃花林，兩岸綿延數百步沒有雜樹，芳草鮮美，落花繽紛。',
      },
      {
        passageId: 'gu-wen-guan-zhi_ch-56_p-1',
        chapterId: 'gu-wen-guan-zhi_ch-56',
        workTitle: '古文觀止',
        chapterTitle: '蘭亭集序（王羲之）',
        canonicalText: '永和九年，歲在癸丑，暮春之初，會于會稽山陰之蘭亭，修禊事也。羣賢畢至，少長咸集。此地有崇山峻嶺，茂林脩竹；又有清流激湍，映帶左右，引以為流觴曲水。',
        vernacularText: '永和九年暮春時節，眾賢聚會於會稽山陰的蘭亭。此地有崇山峻嶺、茂林修竹與清流激湍，眾人引水為流觴曲水，暢敘幽情。',
      },
      {
        passageId: 'gu-wen-guan-zhi_ch-134_p-1',
        chapterId: 'gu-wen-guan-zhi_ch-134',
        workTitle: '古文觀止',
        chapterTitle: '岳陽樓記（范仲淹）',
        canonicalText: '嗟夫！予嘗求古仁人之心，或異二者之為，何哉？不以物喜，不以己悲；居廟堂之高則憂其民，處江湖之遠則憂其君。是進亦憂，退亦憂。然則何時而樂耶？其必曰：「先天下之憂而憂，後天下之樂而樂」乎！',
        vernacularText: '古時仁人之心，不因外物好壞或個人得失而喜悲；身處朝廷高位則憂心百姓，退居江湖遠方則憂慮君國，先天下之憂而憂，後天下之樂而樂。',
      },
      {
        passageId: 'gu-wen-guan-zhi_ch-143_p-1',
        chapterId: 'gu-wen-guan-zhi_ch-143',
        workTitle: '古文觀止',
        chapterTitle: '前赤壁賦（蘇軾）',
        canonicalText: '惟江上之清風，與山間之明月，耳得之而為聲，目遇之而成色，取之無禁，用之不竭，是造物者之無盡藏也，而吾與子之所共適。',
        vernacularText: '只有江上的清風與山間的明月，耳朵聽見便成為悅耳之聲，眼睛望見便成為動人之色，這是大自然無窮無盡的寶藏，也是我與你能夠共同享有的清福。',
      },
      {
        passageId: 'lun-yu_ch-1_p-1',
        chapterId: 'lun-yu_ch-1',
        workTitle: '論語',
        chapterTitle: '學而第一',
        canonicalText: '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」',
        vernacularText: '孔子說：「學習知識並按時溫習實踐，不也很令人欣喜嗎？有志同道合的朋友從遠方來，不也很快樂嗎？人家不瞭解自己卻不怨恨，不也是君子嗎？」',
      },
    ],
  },
  {
    id: 'radio-strategy-wisdom',
    title: '帷幄千里・孫子兵法與大局謀略',
    subtitle: '聆聽兵聖孫武與秦丞相李斯宏論，淬鍊全勝格局與決策定力',
    sealChar: '策',
    ambientDefault: 'wind',
    playlist: [
      {
        passageId: 'art-of-war_ch-1_p-1',
        chapterId: 'art-of-war_ch-1',
        workTitle: '孫子兵法',
        chapterTitle: '始計第一',
        canonicalText: '孫子曰：兵者，國之大事，死生之地，存亡之道，不可不察也。故經之以五事，校之以計，而索其情：一曰道，二曰天，三曰地，四曰將，五曰法。',
        vernacularText: '孫子說：軍事是國家的重大事務，關係到人民的生死與國家的存亡，不可不審慎考察。因此必須以道、天、地、將、法五項基本要素加以經略衡量。',
      },
      {
        passageId: 'art-of-war_ch-3_p-1',
        chapterId: 'art-of-war_ch-3',
        workTitle: '孫子兵法',
        chapterTitle: '謀攻第三',
        canonicalText: '是故百戰百勝，非善之善者也；不戰而屈人之兵，善之善者也。故上兵伐謀，其次伐交，其次伐兵，其下攻城。',
        vernacularText: '因此百戰百勝還算不上最高明的用兵；不須交戰便能使敵人屈服，才是高明中的最高境界。上等用兵在於挫敗敵方謀略，其次是瓦解敵方外交同盟。',
      },
      {
        passageId: 'art-of-war_ch-6_p-1',
        chapterId: 'art-of-war_ch-6',
        workTitle: '孫子兵法',
        chapterTitle: '虛實第六',
        canonicalText: '夫兵形象水，水之行避高而趨下，兵之形避實而擊虛。水因地而制流，兵因敵而制勝。故兵無常勢，水無常形，能因敵變化而取勝者，謂之神。',
        vernacularText: '用兵的規律就像水一樣，水流動時避開高處而流向低處，用兵作戰則避開敵人堅實之處而攻擊其空虛薄弱處。能根據敵情變化而取勝的，就叫做用兵如神。',
      },
      {
        passageId: 'jian-zhu-ke-shu_ch-1_p-1',
        chapterId: 'jian-zhu-ke-shu_ch-1',
        workTitle: '諫逐客書',
        chapterTitle: '泰山不讓土壤（李斯）',
        canonicalText: '是以泰山不讓土壤，故能成其大；河海不擇細流，故能就其深；王者不卻眾庶，故能明其德。',
        vernacularText: '因此泰山不排斥任何土壤，所以能成就它的高大；河海不捨棄任何細小水流，所以能成就它的深廣；君王不拒絕天下百姓與賢才，所以能彰顯他的盛德。',
      },
    ],
  },
  {
    id: 'radio-poetry-chant',
    title: '詩酒趁年華・唐詩宋詞元曲雅集',
    subtitle: '吟詠盛唐風骨與兩宋詞境，感受平仄音韻與天地豪情',
    sealChar: '韻',
    ambientDefault: 'rain',
    playlist: [
      {
        passageId: 'poem-jiang-jin-jiu',
        chapterId: 'gu-wen-guan-zhi_ch-143',
        workTitle: '唐詩名篇',
        chapterTitle: '將進酒（李白）',
        canonicalText: '君不見黃河之水天上來，奔流到海不復回。君不見高堂明鏡悲白髮，朝如青絲暮成雪。人生得意須盡歡，莫使金樽空對月。天生我材必有用，千金散盡還復來。',
        vernacularText: '你難道沒看見黃河之水從天上奔騰而來，波濤滾滾直入大海永不回頭？人生順意時應當盡情歡樂，上天造就我的才幹必定有所用處，縱使千金散盡也必能再次獲得。',
      },
      {
        passageId: 'poem-shui-diao-ge-tou',
        chapterId: 'gu-wen-guan-zhi_ch-143',
        workTitle: '宋詞名篇',
        chapterTitle: '水調歌頭・明月幾時有（蘇軾）',
        canonicalText: '人有悲歡離合，月有陰晴圓缺，此事古難全。但願人長久，千里共嬋娟。',
        vernacularText: '人生本就有悲歡離合，月亮也有陰晴圓缺，這樣的事自古以來就難以十全十美。只願彼此平安長久，即便相隔千里也能共享這片美好月光。',
      },
      {
        passageId: 'poem-ding-feng-bo',
        chapterId: 'gu-wen-guan-zhi_ch-143',
        workTitle: '宋詞名篇',
        chapterTitle: '定風波・莫聽穿林打葉聲（蘇軾）',
        canonicalText: '莫聽穿林打葉聲，何妨吟嘯且徐行。竹杖芒鞋輕勝馬，誰怕？一蓑煙雨任平生。回首向來蕭瑟處，歸去，也無風雨也無晴。',
        vernacularText: '不用理會穿過樹林敲打樹葉的風雨聲，不妨一邊吟詠長嘯一邊從容漫步。回頭望向剛才風雨蕭瑟的地方，歸去吧，心中既無所謂風雨，也無所謂天晴。',
      },
      {
        passageId: 'poem-tian-jing-sha',
        chapterId: 'gu-wen-guan-zhi_ch-143',
        workTitle: '元曲名篇',
        chapterTitle: '天淨沙・秋思（馬致遠）',
        canonicalText: '枯藤老樹昏鴉，小橋流水人家，古道西風瘦馬。夕陽西下，斷腸人在天涯。',
        vernacularText: '枯藤纏繞著老樹，黃昏的烏鴉棲息枝頭；小橋下流水潺潺，溪畔有幾戶人家；古老荒涼的道路上，秋風颯颯吹拂著旅人與瘦馬。夕陽西沉，思鄉斷腸的遊子仍在天涯漂泊。',
      },
    ],
  },
]

export interface SpeechState {
  isPlaying: boolean
  isPaused: boolean
  currentPassageId: string | null
  currentText: string
  currentMode: SpeechMode
  currentRate: SpeechRate
  selectedVoiceURI: string
  playlist: SpeechPlaylistItem[]
  playlistIndex: number
  isAutoScroll: boolean
  playbackMode: PlaybackMode
  sleepTimer: SleepTimerOption
  sleepTimerRemainingSeconds: number
  bilingualPhase: 'canonical' | 'vernacular' | null
  isCollapsed: boolean
  isPlaylistDrawerOpen: boolean
  // 高品質實體音檔擴充狀態
  audioSourceType: AudioSourceType
  audioFileAvailable: boolean
  currentTime: number
  duration: number
  bufferedPercent: number
  preferAudioFiles: boolean
}

// 先秦經典音韻校勘辭典（通假字、破音字TTS校正）
const CLASSICAL_TTS_CORRECTIONS: [RegExp, string][] = [
  [/不亦說乎/g, '不亦悅乎'],
  [/秦伯說/g, '秦伯悅'],
  [/民說之/g, '民悅之'],
  [/禮樂/g, '禮嶽'],
  [/處眾人之所惡/g, '處眾人之所務'],
  [/好惡/g, '好務'],
  [/以觀其徼/g, '以觀其叫'],
  [/圖窮而匕首見/g, '圖窮而匕首現'],
  [/風吹草低見牛羊/g, '風吹草低現牛羊'],
  [/北冥有魚/g, '北溟有魚'],
  [/朝聞道/g, '昭聞道'],
  [/發而皆中節/g, '發而皆仲節'],
  [/道千乘之國/g, '道千盛之國'],
  [/萬乘之國/g, '萬盛之國'],
  [/百乘之家/g, '百盛之家'],
  [/為政以德/g, '圍政以德'],
  [/十有五/g, '十又五'],
  [/誨女知之乎/g, '誨汝知之乎'],
  [/女為君子儒/g, '汝為君子儒'],
  [/逝者如斯夫/g, '逝者如斯符'],
  [/其正色邪/g, '其正色耶'],
  [/三飡而反/g, '三飡而返'],
  [/知者樂水/g, '智者要水'],
  [/仁者樂山/g, '仁者要山'],
  [/知者不惑/g, '智者不惑'],
  [/反聽之謂聰/g, '返聽之謂聰'],
  [/便佞/g, '駢佞'],
  [/人不知而不慍/g, '人不知而不運'],
  [/孝弟也者/g, '孝悌也者'],
  [/出則弟/g, '出則悌'],
  [/苟志於仁矣，無惡也/g, '苟志於仁矣，無務也'],
  [/暴虎馮河/g, '暴虎憑河'],
  [/過則勿憚改/g, '過則勿旦改'],
  [/無友不如己者/g, '毋友不如己者'],
  [/數仞之牆/g, '樹仞之牆'],
  [/數罟不入洿池/g, '促罟不入洿池'],
  [/其徐如林/g, '其徐如林'],
  [/天下為公/g, '天下圍公'],
  [/得道者多助/g, '得道者多助'],
]

const initialSavedRate = typeof localStorage !== 'undefined'
  ? parseFloat(localStorage.getItem('litc-speech-rate') || '1.0')
  : 1.0

class SpeechService {
  public state = reactive<SpeechState>({
    isPlaying: false,
    isPaused: false,
    currentPassageId: null,
    currentText: '',
    currentMode: 'canonical',
    currentRate: isNaN(initialSavedRate) ? 1.0 : Math.max(0.5, Math.min(2.5, initialSavedRate)),
    selectedVoiceURI: '',
    playlist: [],
    playlistIndex: -1,
    isAutoScroll: true,
    playbackMode: 'sequential',
    sleepTimer: 0,
    sleepTimerRemainingSeconds: 0,
    bilingualPhase: null,
    isCollapsed: false,
    isPlaylistDrawerOpen: false,
    audioSourceType: 'tts',
    audioFileAvailable: false,
    currentTime: 0,
    duration: 0,
    bufferedPercent: 0,
    preferAudioFiles: true,
  })

  public voices = ref<SpeechSynthesisVoice[]>([])
  public isSupported = ref(false)

  private synth: SpeechSynthesis | null = null
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private audioElement: HTMLAudioElement | null = null
  private prefetchAudio: HTMLAudioElement | null = null
  private prefetchedIndex = -1
  private keepAliveTimer: any = null
  private transitionTimer: any = null
  private sleepIntervalTimer: any = null
  private unlockAudioBound = false

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis
        this.isSupported.value = true
        this.initVoices()
        this.initUnlockListener()
      }
      this.initAudioElement()
      this.initMediaSession()
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return
    this.audioElement = new Audio()
    this.audioElement.preload = 'metadata'

    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.audioElement) return
      this.state.currentTime = this.audioElement.currentTime
      if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
        this.state.duration = this.audioElement.duration
        if (this.state.currentTime / this.audioElement.duration > 0.8) {
          this.preloadNextPlaylistItem()
        }
      }
      this.updateMediaSessionPosition()
    })

    this.audioElement.addEventListener('progress', () => {
      if (!this.audioElement || !this.audioElement.buffered.length || !this.audioElement.duration) return
      try {
        const bufferedEnd = this.audioElement.buffered.end(this.audioElement.buffered.length - 1)
        this.state.bufferedPercent = Math.min(100, Math.round((bufferedEnd / this.audioElement.duration) * 100))
      } catch {
        // ignore buffer errors
      }
    })

    this.audioElement.addEventListener('ended', () => {
      // 雙語模式下，如果剛播完原文，接著播白話
      if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
        this.playBilingualVernacularPhase()
      } else {
        this.onPassageFinished()
      }
    })

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio element error, falling back to TTS:', e)
      if (this.state.isPlaying) {
        this.state.audioSourceType = 'tts'
        this.speakUtterance(this.state.currentText, () => {
          if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
            this.playBilingualVernacularPhase()
          } else {
            this.onPassageFinished()
          }
        })
      }
    })
  }

  private initVoices() {
    if (!this.synth) return

    const updateVoices = () => {
      const allVoices = this.synth!.getVoices()
      const chineseVoices = allVoices.filter(v =>
        v.lang.toLowerCase().includes('zh') ||
        v.lang.toLowerCase().includes('cmn') ||
        v.lang.toLowerCase().includes('yue')
      )

      this.voices.value = chineseVoices.length > 0 ? chineseVoices : allVoices

      if (!this.state.selectedVoiceURI && this.voices.value.length > 0) {
        const preferred =
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-tw')) ||
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-hk')) ||
          this.voices.value.find(v => v.lang.toLowerCase().includes('zh-cn')) ||
          this.voices.value[0]

        if (preferred) {
          this.state.selectedVoiceURI = preferred.voiceURI
        }
      }
    }

    updateVoices()
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices
    }
  }

  private initUnlockListener() {
    if (typeof window === 'undefined' || this.unlockAudioBound) return
    this.unlockAudioBound = true

    const unlockHandler = () => {
      if (this.synth && this.synth.paused) {
        this.synth.resume()
      }
      if (this.audioElement) {
        this.audioElement.load()
      }
      window.removeEventListener('click', unlockHandler)
      window.removeEventListener('touchstart', unlockHandler)
    }

    window.addEventListener('click', unlockHandler, { once: true })
    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true })
  }

  private initMediaSession() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.setActionHandler('play', () => this.resume())
      navigator.mediaSession.setActionHandler('pause', () => this.pause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevPassage())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextPassage())
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime)
        }
      })
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const delta = details.seekOffset || 5
        this.seek(Math.max(0, this.state.currentTime - delta))
      })
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const delta = details.seekOffset || 5
        this.seek(Math.min(this.state.duration, this.state.currentTime + delta))
      })
      navigator.mediaSession.setActionHandler('stop', () => this.stop())
    } catch (e) {
      console.warn('Failed to register MediaSession handlers', e)
    }
  }

  private updateMediaSession() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return
    try {
      const item = this.getCurrentPlaylistItem()
      const titlePrefix = item?.chapterTitle ? `${item.chapterTitle} · ` : ''
      const modeTag = this.state.currentMode === 'canonical' ? '【原文】' : (this.state.currentMode === 'vernacular' ? '【白話】' : '【文白對照】')
      const snippet = this.state.currentText.slice(0, 36) || '經典研習'
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${modeTag} ${titlePrefix}${snippet}`,
        artist: item?.workTitle || '經典文脈 ClassicFlow',
        album: '先秦諸子古典有聲經庫',
        artwork: [
          { src: `${import.meta.env.BASE_URL || '/'}favicon.svg`, sizes: '192x192', type: 'image/svg+xml' },
        ],
      })
      this.updateMediaSessionPlaybackState()
    } catch {
      // ignore
    }
  }

  private updateMediaSessionPlaybackState() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    try {
      if (this.state.isPlaying && !this.state.isPaused) {
        navigator.mediaSession.playbackState = 'playing'
      } else if (this.state.isPaused) {
        navigator.mediaSession.playbackState = 'paused'
      } else {
        navigator.mediaSession.playbackState = 'none'
      }
    } catch {
      // ignore
    }
  }

  private updateMediaSessionPosition() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return
    if (this.state.duration > 0 && !isNaN(this.state.duration)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: this.state.duration,
          playbackRate: this.state.currentRate,
          position: Math.min(this.state.currentTime, this.state.duration),
        })
      } catch {
        // ignore
      }
    }
  }

  /**
   * 古文正音與朗讀字詞優化：去除註腳標號，並針對古音通假破讀進行語音校正
   */
  public sanitizeText(text: string): string {
    if (!text) return ''
    let cleaned = text
      .replace(/\[\d+\]/g, '')
      .replace(/【[^】]+】/g, '')
      .replace(/〔[^〕]+〕/g, '')
      .replace(/（[^）]+）/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    for (const [regex, replacement] of CLASSICAL_TTS_CORRECTIONS) {
      cleaned = cleaned.replace(regex, replacement)
    }
    return cleaned
  }

  public hasAudioFile(passageId: string): boolean {
    return !!getAudioFileMeta(passageId)
  }

  public getCurrentPlaylistItem(): SpeechPlaylistItem | null {
    if (this.state.playlistIndex >= 0 && this.state.playlistIndex < this.state.playlist.length) {
      return this.state.playlist[this.state.playlistIndex]
    }
    return null
  }

  /**
   * 朗讀特定段落（一段對應一段，優先播放高品質實體音檔）
   */
  public speakPassage(
    passageId: string,
    text: string,
    mode: SpeechMode = 'canonical',
    extra?: { chapterTitle?: string; workTitle?: string; vernacularText?: string; canonicalText?: string }
  ) {
    if (this.state.isPlaying && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.pause()
      return
    }

    if (this.state.isPaused && this.state.currentPassageId === passageId && this.state.currentMode === mode) {
      this.resume()
      return
    }

    this.stop()

    const sanitized = this.sanitizeText(text)
    if (!sanitized) return

    this.state.currentPassageId = passageId
    this.state.currentText = sanitized
    this.state.currentMode = mode
    this.state.isPlaying = true
    this.state.isPaused = false
    this.state.currentTime = 0
    this.state.duration = 0
    this.state.bilingualPhase = mode === 'bilingual' ? 'canonical' : null

    // 更新或建置播放清單項目
    const playlistIdx = this.state.playlist.findIndex(item => item.passageId === passageId)
    if (playlistIdx !== -1) {
      this.state.playlistIndex = playlistIdx
    } else {
      this.state.playlist = [{
        passageId,
        chapterId: '',
        canonicalText: extra?.canonicalText || text,
        vernacularText: extra?.vernacularText || (mode === 'vernacular' ? text : undefined),
        chapterTitle: extra?.chapterTitle,
        workTitle: extra?.workTitle,
      }]
      this.state.playlistIndex = 0
    }

    // 播放邏輯
    const currentItem = this.getCurrentPlaylistItem()
    const playCanonical = mode === 'canonical' || mode === 'bilingual'
    const audioUrl = playCanonical ? getAudioFileUrl(passageId) : undefined
    const audioMeta = playCanonical ? getAudioFileMeta(passageId) : undefined

    if (this.state.preferAudioFiles && audioUrl && this.audioElement && playCanonical) {
      this.state.audioSourceType = 'file'
      this.state.audioFileAvailable = true
      if (audioMeta) {
        this.state.duration = audioMeta.duration
      }
      this.playViaAudioElement(audioUrl)
    } else {
      this.state.audioSourceType = 'tts'
      this.state.audioFileAvailable = !!audioUrl
      this.speakUtterance(sanitized, () => {
        if (mode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
          this.playBilingualVernacularPhase()
        } else {
          this.onPassageFinished()
        }
      })
    }

    this.updateMediaSession()

    if (this.state.isAutoScroll) {
      this.scrollToPassage(passageId)
    }
  }

  /**
   * 文白對照雙語導讀階段 2：朗讀白話釋義
   */
  private playBilingualVernacularPhase() {
    const item = this.getCurrentPlaylistItem()
    if (!item || !item.vernacularText) {
      this.state.bilingualPhase = null
      this.onPassageFinished()
      return
    }

    this.state.bilingualPhase = 'vernacular'
    const sanitizedVernacular = this.sanitizeText(item.vernacularText)
    this.state.currentText = `【白話釋義】${sanitizedVernacular}`
    this.state.audioSourceType = 'tts'
    this.state.currentTime = 0
    this.state.duration = 0

    this.updateMediaSession()

    // 留白 600ms，讓使用者沉澱原文韻味後再聽白話
    this.transitionTimer = setTimeout(() => {
      if (this.state.isPlaying && !this.state.isPaused) {
        this.speakUtterance(`白話釋義：${sanitizedVernacular}`, () => {
          this.state.bilingualPhase = null
          this.onPassageFinished()
        })
      }
    }, 600)
  }

  private playViaAudioElement(url: string) {
    if (!this.audioElement) return
    this.audioElement.pause()
    this.audioElement.currentTime = 0
    this.audioElement.src = url
    this.audioElement.playbackRate = this.state.currentRate
    this.audioElement.play().catch(err => {
      console.warn('Audio play failed, fallback to TTS:', err)
      this.state.audioSourceType = 'tts'
      this.speakUtterance(this.state.currentText, () => {
        if (this.state.currentMode === 'bilingual' && this.state.bilingualPhase === 'canonical') {
          this.playBilingualVernacularPhase()
        } else {
          this.onPassageFinished()
        }
      })
    })
  }

  /**
   * 開啟全章逐段連播
   */
  public startChapterPlayback(
    playlist: SpeechPlaylistItem[],
    mode: SpeechMode = 'canonical',
    startIndex: number = 0
  ) {
    if (!playlist || playlist.length === 0) return
    this.stop()

    this.state.playlist = playlist
    this.state.currentMode = mode
    this.state.playlistIndex = Math.max(0, Math.min(startIndex, playlist.length - 1))

    this.playCurrentPlaylistItem()
  }

  /**
   * 啟動知識網絡主題廣播（連續欣賞各知識點之名言與智慧）
   */
  public startKnowledgeRadio(
    items: SpeechPlaylistItem[],
    mode: SpeechMode = 'canonical'
  ) {
    if (!items || items.length === 0) return
    this.startChapterPlayback(items, mode, 0)
  }

  private playCurrentPlaylistItem() {
    if (this.state.playlistIndex < 0 || this.state.playlistIndex >= this.state.playlist.length) {
      this.stop()
      return
    }

    const item = this.state.playlist[this.state.playlistIndex]
    const textToRead = this.state.currentMode === 'vernacular'
      ? (item.vernacularText || item.canonicalText)
      : item.canonicalText

    this.speakPassage(item.passageId, textToRead, this.state.currentMode, {
      chapterTitle: item.chapterTitle,
      workTitle: item.workTitle,
      canonicalText: item.canonicalText,
      vernacularText: item.vernacularText,
    })
  }

  private speakUtterance(text: string, onEnd: () => void) {
    if (!this.synth) return

    this.synth.cancel()
    this.clearKeepAlive()

    const utterance = new SpeechSynthesisUtterance(text)
    this.activeUtterance = utterance

    if (this.state.selectedVoiceURI && this.voices.value.length > 0) {
      const chosen = this.voices.value.find(v => v.voiceURI === this.state.selectedVoiceURI)
      if (chosen) {
        utterance.voice = chosen
        utterance.lang = chosen.lang
      }
    } else {
      utterance.lang = 'zh-TW'
    }

    utterance.rate = this.state.currentRate
    utterance.pitch = 1.0

    utterance.onstart = () => {
      this.state.isPlaying = true
      this.state.isPaused = false
      this.startKeepAlive()
      this.updateMediaSessionPlaybackState()
    }

    utterance.onend = () => {
      this.clearKeepAlive()
      this.activeUtterance = null
      onEnd()
    }

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e)
      this.clearKeepAlive()
      this.activeUtterance = null
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        this.onPassageFinished()
      }
    }

    this.synth.speak(utterance)
  }

  private onPassageFinished() {
    // 1. 單段涵泳（單曲循環）
    if (this.state.playbackMode === 'loop-single') {
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 700)
      return
    }

    // 2. 播完當前篇章定時結束檢查
    if (this.state.sleepTimer === 'end-of-chapter' && this.state.playlistIndex >= this.state.playlist.length - 1) {
      this.stop()
      this.setSleepTimer(0)
      return
    }

    // 3. 順序播放至下一段
    if (this.state.playlist.length > 0 && this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 700)
    } else if (this.state.playbackMode === 'loop-all' && this.state.playlist.length > 0) {
      // 4. 全篇循環模式，回到第一段
      this.state.playlistIndex = 0
      this.transitionTimer = setTimeout(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          this.playCurrentPlaylistItem()
        }
      }, 900)
    } else {
      this.state.isPlaying = false
      this.state.isPaused = false
      this.state.currentPassageId = null
      this.clearKeepAlive()
      this.updateMediaSessionPlaybackState()
    }
  }

  public nextPassage() {
    if (this.state.playlistIndex < this.state.playlist.length - 1) {
      this.state.playlistIndex++
      this.playCurrentPlaylistItem()
    } else if (this.state.playbackMode === 'loop-all' && this.state.playlist.length > 0) {
      this.state.playlistIndex = 0
      this.playCurrentPlaylistItem()
    }
  }

  public prevPassage() {
    if (this.state.playlistIndex > 0) {
      this.state.playlistIndex--
      this.playCurrentPlaylistItem()
    }
  }

  public jumpToPlaylistItem(index: number) {
    if (index >= 0 && index < this.state.playlist.length) {
      this.state.playlistIndex = index
      this.playCurrentPlaylistItem()
    }
  }

  public pause() {
    if (this.state.audioSourceType === 'file' && this.audioElement) {
      this.audioElement.pause()
    } else if (this.synth) {
      this.synth.pause()
    }
    this.state.isPaused = true
    this.clearKeepAlive()
    this.updateMediaSessionPlaybackState()
  }

  public resume() {
    if (this.state.isPaused) {
      if (this.state.audioSourceType === 'file' && this.audioElement) {
        this.audioElement.play()
      } else if (this.synth) {
        this.synth.resume()
      }
      this.state.isPaused = false
      this.state.isPlaying = true
      this.startKeepAlive()
      this.updateMediaSessionPlaybackState()
    } else if (!this.state.isPlaying && this.state.playlist.length > 0) {
      this.playCurrentPlaylistItem()
    }
  }

  public stop() {
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer)
      this.transitionTimer = null
    }
    this.clearKeepAlive()

    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
    }
    if (this.synth) {
      this.synth.cancel()
    }

    this.state.isPlaying = false
    this.state.isPaused = false
    this.state.currentPassageId = null
    this.state.currentTime = 0
    this.state.bilingualPhase = null
    this.activeUtterance = null
    this.updateMediaSessionPlaybackState()
  }

  public seek(seconds: number) {
    if (this.state.audioSourceType === 'file' && this.audioElement && this.state.duration > 0) {
      const targetTime = Math.max(0, Math.min(seconds, this.state.duration))
      this.audioElement.currentTime = targetTime
      this.state.currentTime = targetTime
      this.updateMediaSessionPosition()
    }
  }

  public setRate(rate: SpeechRate) {
    const clamped = Math.max(0.5, Math.min(2.5, Number(rate.toFixed(2))))
    this.state.currentRate = clamped
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('litc-speech-rate', String(clamped))
      } catch {
        // ignore
      }
    }
    if (this.audioElement) {
      this.audioElement.playbackRate = clamped
    }
    if (this.state.isPlaying && !this.state.isPaused) {
      if (this.state.audioSourceType === 'tts') {
        this.playCurrentPlaylistItem()
      }
    }
  }

  public setMode(mode: SpeechMode) {
    if (this.state.currentMode === mode) return
    this.state.currentMode = mode
    if (this.state.isPlaying) {
      this.playCurrentPlaylistItem()
    }
  }

  public setPlaybackMode(mode: PlaybackMode) {
    this.state.playbackMode = mode
  }

  public cyclePlaybackMode() {
    if (this.state.playbackMode === 'sequential') {
      this.state.playbackMode = 'loop-single'
    } else if (this.state.playbackMode === 'loop-single') {
      this.state.playbackMode = 'loop-all'
    } else {
      this.state.playbackMode = 'sequential'
    }
  }

  public setSleepTimer(option: SleepTimerOption) {
    this.state.sleepTimer = option
    if (this.sleepIntervalTimer) {
      clearInterval(this.sleepIntervalTimer)
      this.sleepIntervalTimer = null
    }

    if (typeof option === 'number' && option > 0) {
      this.state.sleepTimerRemainingSeconds = option * 60
      this.sleepIntervalTimer = setInterval(() => {
        if (this.state.sleepTimerRemainingSeconds > 0) {
          this.state.sleepTimerRemainingSeconds--
          if (this.state.sleepTimerRemainingSeconds <= 0) {
            this.stop()
            this.setSleepTimer(0)
          }
        }
      }, 1000)
    } else {
      this.state.sleepTimerRemainingSeconds = 0
    }
  }

  public toggleCollapse() {
    this.state.isCollapsed = !this.state.isCollapsed
  }

  public togglePlaylistDrawer() {
    this.state.isPlaylistDrawerOpen = !this.state.isPlaylistDrawerOpen
  }

  public setVoice(voiceURI: string) {
    this.state.selectedVoiceURI = voiceURI
    if (this.state.isPlaying && !this.state.isPaused && this.state.audioSourceType === 'tts') {
      this.playCurrentPlaylistItem()
    }
  }

  public togglePreferAudioFiles() {
    this.state.preferAudioFiles = !this.state.preferAudioFiles
    if (this.state.isPlaying && !this.state.isPaused) {
      this.playCurrentPlaylistItem()
    }
  }

  public toggleAutoScroll() {
    this.state.isAutoScroll = !this.state.isAutoScroll
  }

  private preloadNextPlaylistItem() {
    const nextIdx = this.state.playlistIndex + 1
    if (nextIdx >= this.state.playlist.length || this.prefetchedIndex === nextIdx) return
    this.prefetchedIndex = nextIdx
    const nextItem = this.state.playlist[nextIdx]
    if (this.state.currentMode === 'canonical' || this.state.currentMode === 'bilingual') {
      const url = getAudioFileUrl(nextItem.passageId)
      if (url && typeof window !== 'undefined') {
        if (!this.prefetchAudio) {
          this.prefetchAudio = new Audio()
          this.prefetchAudio.preload = 'auto'
        }
        this.prefetchAudio.src = url
        this.prefetchAudio.load()
      }
    }
  }

  private scrollToPassage(passageId: string) {
    if (typeof document === 'undefined') return
    requestAnimationFrame(() => {
      const el = document.getElementById(`passage-${passageId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  /**
   * 獨立朗讀純文字（支援題幹、選項、答案解析朗讀）
   */
  public speakText(
    text: string,
    options?: {
      rate?: number
      onStart?: () => void
      onEnd?: () => void
      onError?: (err: any) => void
      isClassical?: boolean
    }
  ) {
    if (!this.synth) return
    this.stop()

    const sanitized = options?.isClassical === false ? text.trim() : this.sanitizeText(text)
    if (!sanitized) return

    this.state.isPlaying = true
    this.state.isPaused = false
    this.state.currentText = sanitized
    this.state.audioSourceType = 'tts'

    const utterance = new SpeechSynthesisUtterance(sanitized)
    this.activeUtterance = utterance

    if (this.state.selectedVoiceURI && this.voices.value.length > 0) {
      const chosen = this.voices.value.find(v => v.voiceURI === this.state.selectedVoiceURI)
      if (chosen) {
        utterance.voice = chosen
        utterance.lang = chosen.lang
      }
    } else {
      utterance.lang = 'zh-TW'
    }

    utterance.rate = options?.rate || this.state.currentRate
    utterance.pitch = 1.0

    utterance.onstart = () => {
      this.state.isPlaying = true
      this.state.isPaused = false
      this.startKeepAlive()
      options?.onStart?.()
    }

    utterance.onend = () => {
      this.clearKeepAlive()
      this.state.isPlaying = false
      this.activeUtterance = null
      options?.onEnd?.()
    }

    utterance.onerror = (e) => {
      this.clearKeepAlive()
      this.state.isPlaying = false
      this.activeUtterance = null
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        options?.onError?.(e)
      }
    }

    this.synth.speak(utterance)
  }

  private startKeepAlive() {
    this.clearKeepAlive()
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.state.isPlaying && !this.state.isPaused && this.state.audioSourceType === 'tts') {
        this.synth.pause()
        this.synth.resume()
      }
    }, 10000)
  }

  private clearKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer)
      this.keepAliveTimer = null
    }
  }
}

export const speechService = new SpeechService()
