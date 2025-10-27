export function mapVideoUrl(localUrl: string): string {
  if (/^https?:\/\//i.test(localUrl) || localUrl.startsWith('/api/stream')) return localUrl;
  if (localUrl.startsWith('/videos/')) {
    const base = process.env.NEXT_PUBLIC_NC_BASE_PATH || '/Videos/tv-do-yuri/public';
    const path = `${base}${localUrl}`; // vira /Videos/.../videos/...
    return `/api/stream?path=${encodeURIComponent(path)}`;
  }
  return localUrl;
}
