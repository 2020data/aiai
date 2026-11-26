// modules/share.module.js
import { icon } from './icons.module.js';

export function renderShareBar(container, title = document.title, url = window.location.href) {
  if (!container) return;
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  container.innerHTML = `
    <div class="flex flex-wrap items-center gap-2 text-xs" data-no-translate>
      <span class="text-zinc-500 flex items-center gap-1 mr-1">${icon('share')} 分享典藏</span>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" rel="noopener"
         class="editorial-btn-outline !py-1 !px-2.5 !text-xs">Facebook</a>
      <button type="button" data-share="ig"
         class="editorial-btn-outline !py-1 !px-2.5 !text-xs">Instagram</button>
      <a href="https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}" target="_blank" rel="noopener"
         class="editorial-btn-outline !py-1 !px-2.5 !text-xs">WhatsApp</a>
      <a href="https://social-plugins.line.me/lineit/share?url=${encUrl}" target="_blank" rel="noopener"
         class="editorial-btn-outline !py-1 !px-2.5 !text-xs">LINE</a>
      <button type="button" data-share="copy"
         class="editorial-btn-outline !py-1 !px-2.5 !text-xs">${icon('link')} 複製連結</button>
      <span id="share-toast" class="text-emerald-800 ml-1 hidden">已複製連結</span>
    </div>
  `;

  const toast = container.querySelector('#share-toast');
  const copyLink = async (msg) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2400);
    } catch {
      window.prompt('請複製以下連結：', url);
    }
  };

  container.querySelector('[data-share="copy"]')?.addEventListener('click', () => copyLink('已複製連結'));
  container.querySelector('[data-share="ig"]')?.addEventListener('click', () => {
    copyLink('已複製連結，可直接貼上至 Instagram 限時動態或簡介');
  });
}
