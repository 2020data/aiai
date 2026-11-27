// components/notebooklm-panel.js
import { APP_CONFIG } from '../config/app.config.js';

const getUrl = () => APP_CONFIG.NOTEBOOKLM_URL || 'https://notebook.google.com/notebook/95895d7e-3847-4bb0-88da-4daf332eed31';

function openPopup(url) {
  const w = Math.min(1360, Math.floor(window.screen.availWidth * 0.9));
  const h = Math.min(900, Math.floor(window.screen.availHeight * 0.9));
  const left = Math.floor((window.screen.availWidth - w) / 2);
  const top = Math.floor((window.screen.availHeight - h) / 2);
  window.open(url, 'NotebookLMWindow', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
}

function createStageHTML(url, { isOverlay = false } = {}) {
  return `
    <div class="nlm-stage-box hairline-box bg-[#FCFBF8] flex flex-col w-full h-full overflow-hidden">
      <!-- 頂部精簡控制列 -->
      <div class="px-4 py-2.5 border-b border-[#D8D3C8] bg-[#EFECE6] flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="font-mono-index text-xs text-[#2E4F3E]">[NOTEBOOKLM]</span>
          <span class="font-serif-editorial text-sm font-semibold truncate">AI 知識庫互動視窗</span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" data-nlm-popup class="editorial-btn-outline !py-1 !px-2.5 !text-xs">
            獨立視窗開啟
          </button>
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="editorial-btn-outline !py-1 !px-2.5 !text-xs no-underline">
            新分頁 ↗
          </a>
          ${
            isOverlay
              ? `<a href="./notebooklm.html" class="editorial-btn-outline !py-1 !px-2.5 !text-xs no-underline">開啟獨立頁</a>
                 <button type="button" data-nlm-close class="editorial-btn !py-1 !px-3 !text-xs">關閉 ✕</button>`
              : `<button type="button" data-nlm-fullscreen class="editorial-btn !py-1 !px-3 !text-xs">全螢幕</button>`
          }
        </div>
      </div>

      <!-- 若 Google 安全政策阻擋 iframe 時的備援提示條 -->
      <div class="px-4 py-1.5 border-b border-[#D8D3C8] bg-[#F6F4EF] text-[11px] text-zinc-600 flex flex-wrap items-center justify-between gap-2">
        <span>若下方大框因 Google 安全防護顯示空白或拒絕連線，請點擊右側「獨立視窗開啟」直接使用。</span>
        <span class="font-mono-index text-[10px] text-zinc-400 truncate max-w-xs">${url}</span>
      </div>

      <!-- 完整大框 iframe -->
      <div class="flex-1 w-full min-h-[600px] bg-white">
        <iframe
          src="${url}"
          title="NotebookLM 互動視窗"
          class="w-full h-full border-0"
          allow="clipboard-read; clipboard-write; microphone; fullscreen"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  `;
}

function bindStageEvents(root, url, { onClose } = {}) {
  root.querySelector('[data-nlm-popup]')?.addEventListener('click', () => openPopup(url));

  root.querySelector('[data-nlm-close]')?.addEventListener('click', () => {
    onClose?.();
  });

  root.querySelector('[data-nlm-fullscreen]')?.addEventListener('click', async () => {
    const box = root.querySelector('.nlm-stage-box');
    if (!document.fullscreenElement) {
      await box?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  });
}

/**
 * 方式 1：點擊按鈕後，直接在目前頁面上展開滿版大框（覆蓋層）
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
  overlay.innerHTML = `<div class="w-full max-w-[1600px] h-[92vh]">${createStageHTML(url, { isOverlay: true })}</div>`;

  const close = () => overlay.classList.add('hidden');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  bindStageEvents(overlay, url, { onClose: close });
  document.body.appendChild(overlay);
}

/**
 * 方式 2：直接嵌在內頁的指定區塊，或作為獨立頁主內容
 */
export function mountNotebookLMInline(targetEl, { heightClass = 'h-[calc(100vh-170px)] min-h-[640px]' } = {}) {
  if (!targetEl) return;
  const url = getUrl();
  targetEl.innerHTML = `<div class="w-full ${heightClass}">${createStageHTML(url, { isOverlay: false })}</div>`;
  bindStageEvents(targetEl, url);
}
