// src/app/api/stream/route.ts
import { NextRequest } from 'next/server';
import { getWebdavFileUrl, getAuthHeader } from '@/lib/nextcloud';

export const runtime = 'nodejs';         // garante streaming em Node
export const dynamic = 'force-dynamic';  // evita cache de build

function log(...args: any[]) {
  console.log('[stream]', ...args); // logs no terminal do Next.js
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path'); // ex: /Videos/tv-do-yuri/videos/cartoons/foo.mp4
  if (!path) {
    log('FALTA path');
    return new Response('Missing "path"', { status: 400 });
  }

  const target = getWebdavFileUrl(path);
  const range = req.headers.get('range'); // bytes=0-

  const headers: Record<string, string> = {
    Authorization: getAuthHeader(),
  };
  if (range) headers.Range = range;

  log(range ? `GET ${target} (Range ${range})` : `GET ${target} (sem Range)`);

  try {
    const upstream = await fetch(target, { method: 'GET', headers });

    const status = upstream.status; // 200 ou 206
    const respHeaders = new Headers();

    // Copia cabeçalhos essenciais para o <video>
    for (const [k, v] of upstream.headers.entries()) {
      if (
        ['content-type', 'content-length', 'accept-ranges', 'content-range', 'etag', 'last-modified', 'date']
          .includes(k.toLowerCase())
      ) {
        respHeaders.set(k, v);
      }
    }
    if (!respHeaders.has('content-type')) respHeaders.set('content-type', 'video/mp4');

    // Evitar cache agressivo
    respHeaders.set('cache-control', 'no-store');

    log('UPSTREAM', status, {
      'content-type': respHeaders.get('content-type'),
      'content-length': respHeaders.get('content-length'),
      'content-range': respHeaders.get('content-range'),
      'accept-ranges': respHeaders.get('accept-ranges'),
    });

    return new Response(upstream.body, { status, headers: respHeaders });
  } catch (err: any) {
    log('ERRO', err?.message || err);
    return new Response('Erro ao buscar vídeo', { status: 502 });
  }
}
