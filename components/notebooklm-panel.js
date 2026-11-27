// components/notebooklm-panel.js
import { APP_CONFIG } from '../config/app.config.js';

const getUrl = () =>
  APP_CONFIG.NOTEBOOKLM_URL || 'https://notebooklm.google.com/notebook/95895d7e-3847-4bb0-88da-4daf332eed31';

const QUICK_PROMPTS = [
  '請整理這份知識庫的核心重點與脈絡',
  '列出裡面提到的關鍵概念、方法或推導步驟',
  '針對初學者，用淺顯的方式摘要主要內容',
  '幫我列出 5 個值得深入延伸討論的問題'
];

function openPopup(url) {
  const w = Math.min(1360, Math.floor(window.screen.availWidth * 0.9));
  const h = Math.min(900, Math.floor(window.screen.availHeight * 0.9));
  const left = Math.floor((window.screen.availWidth - w) / 2);
  const top = Math.floor((window.screen.availHeight - h) / 2);
  const win = window.open(
    url,
    'NotebookLMWindow',
    `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
  if (win) win.focus();
}

function createStageHTML(url, { isOverlay = false } = {}) {
  const promptButtons = QUICK_PROMPTS.map(
    (text, idx) => `
      <button
        type="button"
        data-copy-prompt="${idx}"
        class="text-left p-4 border border-[#D8D3C8] bg-white/75 hover:border-[#18181B] transition text-xs leading-relaxed"
      >
        <span class="font-mono-index text-[#2E4F3E] block mb-1">PROMPT 0${idx + 1} · 點擊複製</span>
        <span class="text-[#18181B]">${text}</span>
      </button>
    `
  ).join('');

  return `
    <div class="nlm-stage-box hairline-box bg-[#FCFBF8] flex flex-col w-full h-full overflow-hidden">
      <!-- 頂部控制列 -->
      <div class="px-4 py-2.5 border-b border-[#D8D3C8] bg-[#EFECE6] flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="font-mono-index text-xs text-[#2E4F3E]">[NOTEBOOKLM]</span>
          <span class="font-serif-editorial text-sm font-semibold truncate">AI 知識庫互動專區</span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${
            isOverlay
              ? `<a href="./notebooklm.html" class="editorial-btn-outline !py-1 !px-2.5 !text-xs no-underline">開啟獨立頁</a>
                 <button type="button" data-nlm-close class="editorial-btn !py-1 !px-3 !text-xs">關閉 ✕</button>`
              : ''
          }
        </div>
      </div>

      <!-- 大框主內容：啟動卡片 + 快捷提問 -->
      <div class="flex-1 overflow-y-auto bg-[#F6F4EF] p-6 sm:p-12 flex items-center justify-center">
        <div class="w-full max-w-3xl space-y-8">
          <header class="pb-6 hairline-b">
            <div class="font-mono-index text-xs text-[#2E4F3E] mb-2">EXTERNAL KNOWLEDGE WORKSPACE</div>
            <h2 class="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#18181B] mb-3">
              NotebookLM 典藏知識庫互動
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              因 Google 安全政策限制第三方網頁內嵌登入視窗，請點擊下方按鈕以獨立視窗或新分頁開啟 NotebookLM，即可完整進行 AI 問答與語音摘要。
            </p>
          </header>

          <!-- 主要啟動按鈕 -->
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" data-nlm-popup class="editorial-btn !py-3 !px-6 text-sm">
              啟動 NotebookLM 互動視窗
            </button>
            <a
              href="${url}"
              target="_blank"
              rel="noopener noreferrer"
              class="editorial-btn-outline !py-3 !px-5 text-sm no-underline"
            >
              於新分頁開啟 ↗
            </a>
          </div>

          <!-- 快捷提問區 -->
          <section class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h3 class="font-serif-editorial text-lg font-semibold text-[#18181B]">常用提問（點擊一鍵複製）</h3>
              <span data-copy-toast class="font-mono-index text-xs text-[#2E4F3E] opacity-0 transition-opacity">
                已複製到剪貼簿
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${promptButtons}
            </div>
          </section>

          <footer class="pt-4 border-t border-[#D8D3C8] font-mono-index text-[11px] text-zinc-500 break-all">
            TARGET: ${url}
          </footer>
        </div>
      </div>
    </div>
  `;
}

function bindStageEvents(root, url, { onClose } = {}) {
  root.querySelector('[data-nlm-popup]')?.addEventListener('click', () => openPopup(url));
  root.querySelector('[data-nlm-close]')?.addEventListener('click', () => onClose?.());

  const toast = root.querySelector('[data-copy-toast]');
  root.querySelectorAll('[data-copy-prompt]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = QUICK_PROMPTS[Number(btn.dataset.copyPrompt)];
      if (!text) return;
      await navigator.clipboard?.writeText(text);
      if (toast) {
        toast.classList.remove('opacity-0');
        setTimeout(() => toast.classList.add('opacity-0'), 1600);
      }
    });
  });
}

/**
 * 方式 1：點擊導覽列按鈕後，在目前頁面上展開完整大框面板
 */
export function openNotebookLMOverlay() {
  const existing = document.getElementById('nlm-page-overlay');
  if (existing) {
    existing.classList.remove('hidden');
    return;
  }

  const url = getUrl();
  const overlay = document.createElement('div');
  overlay.id = 'nlm-page-overlay';
  overlay.className = 'fixed inset-0 z-50 bg-[#18181B]/60 backdrop-blur-[2px] p-3 sm:p-6 flex items-center justify-center';
  overlay.innerHTML = `<div class="w-full max-w-[1200px] h-[86vh]">${createStageHTML(url, { isOverlay: true })}</div>`;

  const close = () => overlay.classList.add('hidden');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  bindStageEvents(overlay, url, { onClose: close });
  document.body.appendChild(overlay);
}

/**
 * 方式 2：直接嵌在內頁容器或獨立頁 notebooklm.html
 */
export function mountNotebookLMInline(targetEl, { heightClass = 'min-h-[640px]' } = {}) {
  if (!targetEl) return;
  const url = getUrl();
  targetEl.innerHTML = `<div class="w-full ${heightClass}">${createStageHTML(url, { isOverlay: false })}</div>`;
  bindStageEvents(targetEl, url);
}
