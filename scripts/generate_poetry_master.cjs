// scripts/generate_poetry_master.cjs
// 打造小學生都可以快樂學好的唐詩宋詞元曲全量教材庫
const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const toTraditional = OpenCC.ConverterFactory(...OpenCC.Locale.from.cn);

console.log('正在編纂小學生快樂學古文・唐詩宋詞元曲精選教材庫...');
