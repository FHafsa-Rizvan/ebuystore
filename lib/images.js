// Helpers for product photos stored in the Supabase "product-images" bucket.
//
// Every photo is saved twice:
//   <id>.jpg          full size (product page)      e.g. 3f2a....jpg
//   thumbs/<id>.jpg   small version (shop cards)    about 400px wide, 20-30 KB
// Only the full-size URL is stored in the database. The small one is worked out from it.

export const BUCKET = "product-images";
export const THUMB_FOLDER = "thumbs";
export const FULL_MAX = 1200;
export const THUMB_MAX = 400;
// Photo names never change, so browsers may keep them for a year (saves bandwidth).
export const CACHE_SECONDS = "31536000";

// Path of a photo inside the bucket, from its public URL
export function storagePathFromUrl(url) {
  if (!url) return null;
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i >= 0 ? decodeURIComponent(url.slice(i + marker.length)) : null;
}

// Path of the small version of a photo, from the full photo's path
export function thumbPath(path) {
  return `${THUMB_FOLDER}/${String(path).split("/").pop()}`;
}

// URL of the small version. Photos that are not in the bucket (or already small) are returned as they are.
export function thumbUrl(url) {
  if (!url || !url.includes(`/${BUCKET}/`)) return url;
  const path = storagePathFromUrl(url);
  if (!path || path.startsWith(`${THUMB_FOLDER}/`)) return url;
  const cut = url.lastIndexOf("/");
  return `${url.slice(0, cut)}/${THUMB_FOLDER}/${url.slice(cut + 1)}`;
}

// Both files (full + small) for each path, for deleting
export function withThumbs(paths) {
  return paths.flatMap((p) => [p, thumbPath(p)]);
}

// Shrinks a photo in the browser. Phone photos are often 5 MB or more.
export async function resizeImage(file, max = FULL_MAX, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new Error("Could not process this image. Try a JPG or PNG photo.");
  return blob;
}
