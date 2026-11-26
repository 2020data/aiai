// modules/parser.module.js
// 統一多格式解析分派器：Markdown + KaTeX / LaTeX / DOCX (Mammoth) / PDF / PPTX
import { sanitizeHTML, escapeHTML } from './sanitizer.module.js';

function renderLatexInMarkdown(text) {
  if (!window.katex) return text;
  const placeholders = [];

  // 先保護區塊公式 $$...$$
  let processed = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, expr) => {
    try {
      const rendered = window.katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
      placeholders.push(rendered);
      return `@@KATEX_BLOCK_${placeholders.length - 1}@@`;
    } catch {
      return _m;
    }
  });

  // 再保護行內公式 $...$
  processed = processed.replace(/(?<!\$)\$(?!\$)([^\n$]+?)(?<!\$)\$(?!\$)/g, (_m, expr) => {
    try {
      const rendered = window.katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
      placeholders.push(rendered);
      return `@@KATEX_INLINE_${placeholders.length - 1}@@`;
    } catch {
      return _m;
    }
  });

  return { processed, placeholders };
}

export function renderMarkdownWithMath(rawText = '') {
  const { processed, placeholders } = renderLatexInMarkdown(rawText || '');
  let html = window.marked ? window.marked.parse(processed, { breaks: true, gfm: true }) : `<pre>${escapeHTML(processed)}</pre>`;

  placeholders.forEach((rendered, idx) => {
    html = html
      .replace(`@@KATEX_BLOCK_${idx}@@`, rendered)
      .replace(`@@KATEX_INLINE_${idx}@@`, rendered);
  });

  return sanitizeHTML(html);
}

export async function renderPostContent(post) {
  const format = (post.format || 'markdown').toLowerCase();

  if (format === 'markdown' || format === 'latex') {
    return renderMarkdownWithMath(post.raw_text || '');
  }

  if (format === 'pdf' && post.file_url) {
    const safeUrl = escapeHTML(post.file_url);
    return sanitizeHTML(`
      <div class="space-y-4">
        ${post.raw_text ? `<div class="mb-4">${renderMarkdownWithMath(post.raw_text)}</div>` : ''}
        <div class="hairline-box p-2">
          <iframe src="${safeUrl}" class="w-full h-[78vh] border-0" title="PDF Viewer"></iframe>
        </div>
        <p class="text-sm text-zinc-600">
          若瀏覽器未自動預覽，請 <a href="${safeUrl}" target="_blank" rel="noopener" class="underline font-medium">點此開啟原始 PDF 檔案</a>。
        </p>
      </div>
    `);
  }

  if (format === 'docx' && post.file_url) {
    try {
      const res = await fetch(post.file_url);
      const arrayBuffer = await res.arrayBuffer();
      if (window.mammoth) {
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        const noteHtml = post.raw_text ? `<div class="mb-6">${renderMarkdownWithMath(post.raw_text)}</div>` : '';
        return sanitizeHTML(noteHtml + result.value);
      }
    } catch (err) {
      console.error('DOCX 解析失敗:', err);
    }
    const safeUrl = escapeHTML(post.file_url);
    return sanitizeHTML(`<p>無法於瀏覽器內直接解析此 Word 檔案，請 <a href="${safeUrl}" target="_blank" rel="noopener" class="underline">點此下載檢視</a>。</p>`);
  }

  if (format === 'pptx' && post.file_url) {
    const encoded = encodeURIComponent(post.file_url);
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
    const safeFileUrl = escapeHTML(post.file_url);
    return sanitizeHTML(`
      <div class="space-y-4">
        ${post.raw_text ? `<div class="mb-4">${renderMarkdownWithMath(post.raw_text)}</div>` : ''}
        <div class="hairline-box p-2">
          <iframe src="${viewerUrl}" class="w-full h-[72vh] border-0" allowfullscreen title="PPTX Viewer"></iframe>
        </div>
        <p class="text-sm text-zinc-600">
          <a href="${safeFileUrl}" target="_blank" rel="noopener" class="underline">下載原始簡報檔 (.pptx)</a>
        </p>
      </div>
    `);
  }

  return renderMarkdownWithMath(post.raw_text || '（尚無內文）');
}
