// modules/translator.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { setSavedLang } from './i18n.module.js';

const originalTextMap = new WeakMap();
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'NOSCRIPT', 'SVG']);

function shouldSkipNode(node) {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.classList?.contains('katex') || el.hasAttribute('data-no-translate')) return true;
    el = el.parentElement;
  }
  return false;
}

function collectTextNodes(root = document.body) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let current;
  while ((current = walker.nextNode())) {
    if (!originalTextMap.has(current)) {
      originalTextMap.set(current, current.nodeValue);
    }
    nodes.push(current);
  }
  return nodes;
}

async function translateTextChunk(text, targetLang) {
  const cacheKey = `tr::${targetLang}::${text}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  let translated = text;
  const provider = APP_CONFIG.TRANSLATION_PROVIDER || 'free';

  try {
    if (provider === 'edge' && APP_CONFIG.TRANSLATION_EDGE_URL) {
      const res = await fetch(APP_CONFIG.TRANSLATION_EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });
      const data = await res.json();
      translated = data.translatedText || text;
    } else if (provider === 'local' && APP_CONFIG.TRANSLATION_LOCAL_URL) {
      const res = await fetch(APP_CONFIG.TRANSLATION_LOCAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'auto', target: targetLang.split('-')[0] })
      });
      const data = await res.json();
      translated = data.translatedText || text;
    } else {
      // 免後端免費 API（MyMemory）
      const sourceLang = APP_CONFIG.DEFAULT_POST_LANG || 'zh-TW';
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.responseData?.translatedText && data.responseStatus === 200) {
        translated = data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.warn('翻譯略過錯誤:', err);
  }

  sessionStorage.setItem(cacheKey, translated);
  return translated;
}

async function translateLongString(text, targetLang) {
  if (text.length <= 420) return translateTextChunk(text, targetLang);
  const parts = text.match(/[^。！？.!?\n]+[。！？.!?\n]?/g) || [text];
  const chunks = [];
  let buf = '';
  for (const part of parts) {
    if ((buf + part).length > 400) {
      if (buf) chunks.push(buf);
      buf = part;
    } else {
      buf += part;
    }
  }
  if (buf) chunks.push(buf);

  const results = [];
  for (const c of chunks) {
    results.push(await translateTextChunk(c, targetLang));
  }
  return results.join('');
}

export async function translatePage(targetLang, onProgress = () => {}) {
  setSavedLang(targetLang);
  const nodes = collectTextNodes(document.body);

  // 切回預設語系時秒速還原原文
  if (targetLang === APP_CONFIG.DEFAULT_UI_LANG) {
    for (const node of nodes) {
      const orig = originalTextMap.get(node);
      if (orig !== undefined) node.nodeValue = orig;
    }
    onProgress('done');
    return;
  }

  onProgress('translating');
  const BATCH_SIZE = 5;
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (node) => {
        const orig = originalTextMap.get(node) || node.nodeValue;
        const trimmed = orig.trim();
        if (!trimmed || /^[0-9\s\-_/:.,()[\]#]+$/.test(trimmed)) return;
        const translated = await translateLongString(trimmed, targetLang);
        node.nodeValue = orig.replace(trimmed, translated);
      })
    );
  }
  onProgress('done');
}
