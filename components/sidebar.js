// components/sidebar.js
import { APP_CONFIG } from '../config/app.config.js';
import { getAllCategories } from '../config/categories.config.js';
import { getCurrentUser } from '../modules/auth.module.js';
import { listPosts, updatePostCategory } from '../modules/db.module.js';
import { listSpeechYears } from '../modules/competition.module.js';
import { classifyContent } from '../modules/classifier.module.js';
import { t } from '../modules/i18n.module.js';
import { icon } from '../modules/icons.module.js';

export async function mountSidebar({ activeCat = '', activeSub = '' } = {}) {
  const mount = document.getElementById('sidebar-root');
  if (!mount) return;

  mount.innerHTML = `<div class="hairline-box p-4 text-xs text-zinc-500">載入目錄中...</div>`;

  let posts = [];
  let speechRows = [];
  let user = null;

  try {
    [posts, speechRows, user] = await Promise.all([
      listPosts(),
      listSpeechYears().catch(() => []),
      getCurrentUser()
    ]);
  } catch (err) {
    console.warn('側邊欄資料讀取失敗:', err);
  }

  // 1. 歷年演講專區（第一順位：TW 與 MY 年度展開）
  const countryBlocks = APP_CONFIG.COUNTRIES.map((c) => {
    const years = speechRows.filter((r) => r.country === c.code);
    const yearButtons = years.length
      ? years
          .map(
            (r) => `
            <a href="./competition.html?year=${r.year}&country=${r.country}"
               class="inline-block font-mono-index text-xs px-2 py-0.5 border border-[#D8D3C8] bg-[#F6F4EF] hover:border-[#18181B] transition">
              ${r.year}
            </a>`
          )
          .join('')
      : `<span class="text-[11px] text-zinc-400">尚無年度資料</span>`;

    return `
      <div class="mb-2.5">
        <div class="text-xs font-medium text-zinc-700 mb-1">${c.label}</div>
        <div class="flex flex-wrap gap-1.5">${yearButtons}</div>
      </div>
    `;
  }).join('');

  // 2. 動態展開 CATEGORIES（類別 A / B / C 及未來擴充類別）
  const categories = getAllCategories();
  const categoryTrees = categories
    .map((cat) => {
      const catPosts = posts.filter((p) => p.category === cat.id);
      const subCountMap = {};
      for (const p of catPosts) {
        const sub = p.subcategory || '未分類';
        subCountMap[sub] = (subCountMap[sub] || 0) + 1;
      }

      const subListHtml = Object.entries(subCountMap)
        .map(([sub, count]) => {
          const isCurrent = activeCat === cat.id && activeSub === sub;
          return `
            <li>
              <a href="./index.html?cat=${encodeURIComponent(cat.id)}&sub=${encodeURIComponent(sub)}"
                 class="flex items-center justify-between py-1 px-2 text-xs transition ${
                   isCurrent ? 'bg-[#EDE9E0] font-semibold text-[#18181B]' : 'text-zinc-600 hover:bg-[#F6F4EF]'
                 }">
                <span>${sub}</span>
                <span class="font-mono-index text-[11px] text-zinc-400">${count}</span>
              </a>
            </li>`;
        })
        .join('');

      return `
        <div class="py-3 hairline-t">
          <a href="./index.html?cat=${encodeURIComponent(cat.id)}"
             class="flex items-center justify-between text-sm font-semibold mb-1.5 hover:opacity-80"
             style="color: ${cat.color};">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 inline-block" style="background-color: ${cat.color};"></span>
              ${cat.label}
            </span>
            <span class="font-mono-index text-xs text-zinc-500">${catPosts.length}</span>
          </a>
          <ul class="space-y-0.5 pl-3 border-l border-[#D8D3C8]">
            ${subListHtml || '<li class="text-[11px] text-zinc-400 py-0.5 pl-1">尚無文章</li>'}
          </ul>
        </div>
      `;
    })
    .join('');

  mount.innerHTML = `
    <aside class="hairline-box p-4 space-y-2">
      <!-- 第一順位：歷年演講專區 -->
      <div class="pb-3">
        <a href="./competition.html" class="flex items-center justify-between text-sm font-semibold text-[#2E4F3E] mb-2">
          <span class="flex items-center gap-1.5">${icon('calendar')} ${t('speechArchive')}</span>
          <span class="font-mono-index text-[11px]">→</span>
        </a>
        ${countryBlocks}
      </div>

      <!-- 動態類別 A / B / C 樹狀目錄 -->
      ${categoryTrees}

      <!-- 已登入作者工具：一鍵自動分類我的文章 -->
      ${
        user
          ? `
          <div class="pt-3 hairline-t">
            <button id="sidebar-auto-classify" type="button" class="editorial-btn-outline w-full !text-xs">
              ${icon('tag')} ${t('autoClassifyMine')}
            </button>
            <p id="sidebar-classify-msg" class="text-[11px] text-zinc-500 mt-1.5 hidden"></p>
          </div>`
          : ''
      }
    </aside>
  `;

  mount.querySelector('#sidebar-auto-classify')?.addEventListener('click', async () => {
    const msgEl = mount.querySelector('#sidebar-classify-msg');
    msgEl.classList.remove('hidden');
    msgEl.textContent = '正在分析並更新您的文章分類...';
    try {
      const myPosts = posts.filter((p) => p.user_id === user.id);
      let updated = 0;
      for (const p of myPosts) {
        const res = classifyContent(p.title, p.raw_text);
        if (res.category !== p.category || res.subcategory !== p.subcategory) {
          await updatePostCategory(p.id, res.category, res.subcategory);
          updated++;
        }
      }
      msgEl.textContent = `已完成！共更新 ${updated} 篇文章分類。`;
      if (updated > 0) setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      msgEl.textContent = `分類失敗：${err.message}`;
    }
  });
}
