import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_PREFIXES = [
  '/Videos/tv-do-yuri/public/videos',
  '/Videos/tv-do-yuri/public/commercials',
];

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Env ausente: ${name}`);
  }
  return v;
}

function isAllowedPath(path: string) {
  return ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'));
}

/**
 * Encoda um caminho PRESERVANDO as barras.
 * Ex.: "/a pasta/um vídeo.mp4" -> "/a%20pasta/um%20vídeo.mp4"
 */
function encodePathPreservingSlashes(input: string): string {
  return input
    .split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join('/');
}

function davUrlsFor(rawPath: string) {
  const base = requireEnv('NEXTCLOUD_BASE_URL');
  const user = requireEnv('NEXTCLOUD_USERNAME');

  // O URLSearchParams já te entrega "path" decodificado (com espaços).
  // Precisamos re-encodar corretamente para a URL.
  const encodedPath = encodePathPreservingSlashes(rawPath);

  // 1) Padrão moderno (com /files/<user>)
  const davFiles = `${base}/remote.php/dav/files/${encodeURIComponent(user)}${encodedPath}`;
  // 2) Compat (antigo)
  const webdav = `${base}/remote.php/webdav${encodedPath}`;
  return [davFiles, webdav];
}

function copyHeaders(resp: Response) {
  const out = new Headers();
  for (const n of [
    'content-type',
    'content-length',
    'content-range',
    'accept-ranges',
    'etag',
    'last-modified',
  ]) {
    const v = resp.headers.get(n);
    if (v) out.set(n, v);
  }
  out.set('cache-control', 'public, max-age=0');
  return out;
}

function authHeaders() {
  const user = requireEnv('NEXTCLOUD_USERNAME');
  const pass = requireEnv('NEXTCLOUD_APP_PASSWORD');
  return {
    authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
  };
}

async function fetchWithRange(url: string, range?: string) {
  const headers: Record<string, string> = authHeaders();
  if (range) headers['range'] = range;
  return fetch(url, { method: 'GET', headers });
}

export async function GET(req: Request) {
  const started = Date.now();

  try {
    const u = new URL(req.url);
    const path = u.searchParams.get('path');
    const range = req.headers.get('range') || undefined;

    console.log('[STREAM][GET] hit', { path, range });

    if (!path || !path.startsWith('/')) {
      return NextResponse.json(
        { error: 'Missing or invalid "path" (deve começar com /)' },
        { status: 400 }
      );
    }
    if (!isAllowedPath(path)) {
      return NextResponse.json({ error: 'Path não permitido', path }, { status: 403 });
    }

    const candidates = davUrlsFor(path);
    let lastBody: string | undefined;
    for (const [idx, url] of candidates.entries()) {
      try {
        console.log(`[STREAM] tentando DAV[${idx}]:`, url);
        const resp = await fetchWithRange(url, range);

        if (resp.ok || resp.status === 206) {
          const hdrs = copyHeaders(resp);
          hdrs.set('x-proxy-hit', `dav-${idx}`);
          console.log('[STREAM] OK', { status: resp.status, ms: Date.now() - started, used: idx });
          return new NextResponse(resp.body, { status: resp.status, headers: hdrs });
        } else {
          lastBody = await resp.text().catch(() => undefined);
          console.warn('[STREAM] Falha', { status: resp.status, idx, body: lastBody?.slice(0, 200) });
        }
      } catch (e: any) {
        console.error('[STREAM] Erro fetch', { idx, msg: e?.message || String(e) });
      }
    }

    return NextResponse.json(
      { error: 'Upstream DAV falhou', detail: lastBody?.slice(0, 200) || 'sem corpo', tried: candidates },
      { status: 502 }
    );
  } catch (err: any) {
    console.error('[STREAM][GET] erro', err?.message || err);
    return NextResponse.json({ error: 'Stream error', detail: String(err?.message || err) }, { status: 500 });
  }
}

export async function HEAD(req: Request) {
  try {
    const u = new URL(req.url);
    const path = u.searchParams.get('path');
    console.log('[STREAM][HEAD] hit', { path });

    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ error: 'Missing or invalid "path"' }, { status: 400 });
    }
    if (!isAllowedPath(path)) {
      return NextResponse.json({ error: 'Path não permitido', path }, { status: 403 });
    }

    const [davFiles, webdav] = davUrlsFor(path);
    const auth = authHeaders();

    for (const [idx, url] of [davFiles, webdav].entries()) {
      const resp = await fetch(url, { method: 'HEAD', headers: auth });
      if (resp.ok) {
        const hdrs = copyHeaders(resp);
        hdrs.set('x-proxy-hit', `head-${idx}`);
        return new NextResponse(null, { status: resp.status, headers: hdrs });
      }
    }

    return NextResponse.json({ error: 'HEAD upstream falhou', path }, { status: 502 });
  } catch (err: any) {
    console.error('[STREAM][HEAD] erro', err?.message || err);
    return NextResponse.json({ error: 'HEAD error', detail: String(err?.message || err) }, { status: 500 });
  }
}
