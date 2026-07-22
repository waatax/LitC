import fs from 'fs';
import path from 'path';

const inputPath = path.resolve('scratch/batch_caigentan_ch5_2.json');
const outputPath = path.resolve('scratch/translated_caigentan_ch5_2.json');

const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const outputData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

let errors = [];

// 1. Verify all keys from input are present in output
const inputKeys = inputData.map(p => p.passageId);
const outputKeys = Object.keys(outputData);

console.log(`Input keys count: ${inputKeys.length}`);
console.log(`Output keys count: ${outputKeys.length}`);

for (const key of inputKeys) {
  if (!outputData[key]) {
    errors.push(`Missing key: ${key}`);
  } else {
    const item = outputData[key];
    if (!item.translation || typeof item.translation !== 'string' || item.translation.trim() === '') {
      errors.push(`Empty or invalid translation for key: ${key}`);
    }
    if (!item.analysis || typeof item.analysis !== 'string' || item.analysis.trim() === '') {
      errors.push(`Empty or invalid analysis for key: ${key}`);
    }
    
    // 2. Check for English characters in translations and analyses (excluding standard pinyin/references if appropriate, but generally none should exist)
    const englishPattern = /[a-zA-Z]{4,}/; // check for words with 4 or more english letters
    if (englishPattern.test(item.translation)) {
      errors.push(`English character detected in translation for key: ${key} -> "${item.translation}"`);
    }
    if (englishPattern.test(item.analysis)) {
      errors.push(`English character detected in analysis for key: ${key} -> "${item.analysis}"`);
    }
    
    // 3. Check for typical placeholder patterns
    const placeholders = ['用白話說：', '此句釋義提示', '解析：本段須放在前後文一併理解', '待補充', 'placeholder'];
    for (const ph of placeholders) {
      if (item.translation.includes(ph)) {
        errors.push(`Placeholder "${ph}" detected in translation for key: ${key}`);
      }
      if (item.analysis.includes(ph)) {
        errors.push(`Placeholder "${ph}" detected in analysis for key: ${key}`);
      }
    }
  }
}

for (const key of outputKeys) {
  if (!inputKeys.includes(key)) {
    errors.push(`Unexpected extra key in output: ${key}`);
  }
}

if (errors.length === 0) {
  console.log("All checks passed successfully! JSON file is valid and complete.");
} else {
  console.error("Verification failed with the following errors:");
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
}
