// modules/competition.module.js
import { supabase, getCurrentUser } from './auth.module.js';

export async function listSpeechYears() {
  const { data, error } = await supabase
    .from('speech')
    .select('id, year, country, title')
    .order('year', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSpeechPage(year, country) {
  const { data, error } = await supabase
    .from('speech')
    .select('*')
    .eq('year', Number(year))
    .eq('country', country)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveSpeechPage(payload) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');

  const record = {
    year: Number(payload.year),
    country: payload.country,
    title: payload.title?.trim() || `${payload.year} 年度演講專區`,
    subtitle: payload.subtitle?.trim() || '',
    event_date: payload.event_date?.trim() || '',
    location: payload.location?.trim() || '',
    cover_image_url: payload.cover_image_url?.trim() || '',
    gallery_items: payload.gallery_items || [],
    overview_md: payload.overview_md || '',
    committee_md: payload.committee_md || '',
    staff_md: payload.staff_md || '',
    extra_subpages: payload.extra_subpages || [],
    creator_name: payload.creator_name?.trim() || '',
    user_id: user.id
  };

  if (payload.id) {
    const { data, error } = await supabase.from('speech').update(record).eq('id', payload.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('speech').insert(record).select().single();
    if (error) throw error;
    return data;
  }
}

export async function cloneToNextYear(currentRecord) {
  const user = await getCurrentUser();
  if (!user) throw new Error('請先登入');

  const nextYear = Number(currentRecord.year) + 1;
  const existing = await getSpeechPage(nextYear, currentRecord.country);
  if (existing) {
    throw new Error(`${nextYear} 年（${currentRecord.country}）專頁已存在！`);
  }

  const nextPayload = {
    year: nextYear,
    country: currentRecord.country,
    title: currentRecord.title.replace(String(currentRecord.year), String(nextYear)),
    subtitle: currentRecord.subtitle || '',
    event_date: '',
    location: currentRecord.location || '',
    cover_image_url: currentRecord.cover_image_url || '',
    gallery_items: [],
    overview_md: currentRecord.overview_md || '',
    committee_md: currentRecord.committee_md || '',
    staff_md: currentRecord.staff_md || '',
    extra_subpages: currentRecord.extra_subpages || [],
    creator_name: currentRecord.creator_name || '',
    user_id: user.id
  };

  const { data, error } = await supabase.from('speech').insert(nextPayload).select().single();
  if (error) throw error;
  return data;
}
