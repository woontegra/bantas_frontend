/**
 * next/image varsayılan yükleyicisi yalnızca next.config.js remotePatterns’taki
 * hostlara izin verir. Aksi URL’lerde unoptimized kullan (500’ü önler).
 */
export function shouldUnoptimizeRemoteImage(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("/")) return false;
  try {
    const u = new URL(src);
    return u.hostname !== "images.unsplash.com";
  } catch {
    return true;
  }
}
