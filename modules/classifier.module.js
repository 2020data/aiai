// modules/classifier.module.js
import { CATEGORIES } from '../config/categories.config.js';

export function classifyContent(title = '', rawText = '') {
  const haystack = `${title}\n${rawText}`.toLowerCase();
  let bestCategory = CATEGORIES[0];
  let bestScore = -1;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords || []) {
      const k = kw.toLowerCase();
      if (haystack.includes(k)) {
        // 標題命中加權較高
        score += title.toLowerCase().includes(k) ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  // 偵測最適合的子分類
  let detectedSub = '未分類';
  if (bestCategory.subcategories && bestCategory.subcategories.length > 0) {
    for (const sub of bestCategory.subcategories) {
      if (sub === '未分類') continue;
      const tokens = sub.split(/[與及・·/\s]+/).filter((t) => t.length >= 2);
      if (tokens.some((t) => haystack.includes(t.toLowerCase()))) {
        detectedSub = sub;
        break;
      }
    }
    if (detectedSub === '未分類' && bestScore > 0) {
      detectedSub = bestCategory.subcategories[0];
    }
  }

  return {
    category: bestCategory.id,
    subcategory: detectedSub,
    confidence: bestScore > 0 ? bestScore : 0
  };
}
