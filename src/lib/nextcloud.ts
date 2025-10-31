// src/lib/nextcloud.ts
export function getWebdavFileUrl(filePath: string) {
  const base = process.env.NEXTCLOUD_BASE_URL!;
  const user = process.env.NEXTCLOUD_USERNAME!;
  const norm = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${base}/remote.php/dav/files/${encodeURIComponent(user)}${norm}`;
}

export function getAuthHeader() {
  const user = process.env.NEXTCLOUD_USERNAME!;
  const pass = process.env.NEXTCLOUD_APP_PASSWORD!;
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  return `Basic ${token}`;
}
