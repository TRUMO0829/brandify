import { randomUUID } from 'node:crypto';

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase storage configuration missing');
  return { url, key, bucket: process.env.SUPABASE_STORAGE_BUCKET || 'portfolio' };
}
export async function uploadImage(file) {
  const { url, key, bucket } = config();
  const extension = { 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/jpg': 'jpg' }[file.mimetype];
  const object = `${randomUUID()}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${object}`, {
    method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': file.mimetype }, body: file.buffer,
  });
  if (!response.ok) throw new Error(`Storage upload failed (${response.status})`);
  return `${url}/storage/v1/object/public/${bucket}/${object}`;
}
export async function deleteImage(image) {
  if (!image) return;
  const { url, key, bucket } = config();
  const prefix = `${url}/storage/v1/object/public/${bucket}/`;
  if (!image.startsWith(prefix)) return;
  const object = image.slice(prefix.length);
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${object}`, {
    method: 'DELETE', headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Storage delete failed (${response.status})`);
}
