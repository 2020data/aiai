// modules/sanitizer.module.js
// 包裝 DOMPurify 進行 HTML 安全消毒，防範 XSS

export function sanitizeHTML(dirtyHtml = '') {
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(dirtyHtml, {
      ADD_TAGS: ['iframe', 'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'annotation'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel', 'style', 'class', 'xmlns', 'encoding']
    });
  }
  // 備援純文字跳脫
  const div = document.createElement('div');
  div.textContent = dirtyHtml;
  return div.innerHTML;
}

export function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
