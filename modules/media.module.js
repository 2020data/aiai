// modules/media.module.js
import { APP_CONFIG } from '../config/app.config.js';
import { uploadFileToStorage } from './db.module.js';

// 內建精選免費藝廊質感封面圖庫（Unsplash 無版權高質感攝影）
export const CURATED_GALLERY_IMAGES = [
  {
    label: '當代建築光影',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '極簡美術館長廊',
    url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '古典書架與紙頁',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '幾何混凝土結構',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '演講廳與舞台光束',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: '溫潤紙張肌理',
    url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80'
  }
];

export async function uploadImage(file) {
  // 若有填寫免費 ImgBB API Key，優先上傳至 ImgBB
  if (APP_CONFIG.IMGBB_API_KEY && APP_CONFIG.IMGBB_API_KEY.trim()) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(APP_CONFIG.IMGBB_API_KEY.trim())}`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (json?.success && json?.data?.url) {
      return json.data.url;
    }
    throw new Error('ImgBB 圖片上傳失敗');
  }

  // 未填寫 ImgBB Key 時自動無縫退回 Supabase Storage
  const { publicUrl } = await uploadFileToStorage(file, 'images');
  return publicUrl;
}
