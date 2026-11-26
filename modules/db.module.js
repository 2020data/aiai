// modules/db.module.js
import { supabase, getCurrentUser } from './auth.module.js';

const STORAGE_BUCKET = 'uploads';

export async function listPosts({ category = '', subcategory = '' } = {}) {
  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  if (subcategory) query = query.eq('subcategory', subcategory);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getPostById(id) {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function uploadFileToStorage(file, folder = 'files') {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入後再上傳檔案');

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${user.id}/${folder}/${safeName}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function createPost(payload) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入後再新增文章');

  const record = {
    title: payload.title?.trim() || '未命名典藏',
    category: payload.category || 'cat_a',
    subcategory: payload.subcategory?.trim() || '未分類',
    format: payload.format || 'markdown',
    original_lang: payload.original_lang || 'zh-TW',
    raw_text: payload.raw_text || '',
    file_url: payload.file_url || '',
    cover_image_url: payload.cover_image_url || '',
    creator_name: payload.creator_name?.trim() || '',
    translations: payload.translations || {},
    user_id: user.id,
    author_email: user.email || ''
  };

  const { data, error } = await supabase.from('posts').insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function updatePostCategory(id, category, subcategory = '未分類') {
  const { data, error } = await supabase
    .from('posts')
    .update({ category, subcategory: subcategory.trim() || '未分類' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

function extractStoragePath(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function deletePost(post) {
  const pathsToRemove = [
    extractStoragePath(post.file_url),
    extractStoragePath(post.cover_image_url)
  ].filter(Boolean);

  if (pathsToRemove.length > 0) {
    await supabase.storage.from(STORAGE_BUCKET).remove(pathsToRemove);
  }

  const { error } = await supabase.from('posts').delete().eq('id', post.id);
  if (error) throw error;
}
