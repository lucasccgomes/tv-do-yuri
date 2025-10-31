// src/app/api/stream/route.ts
import { NextRequest } from 'next/server';
import { getWebdavFileUrl, getAuthHeader } from '@/lib/nextcloud';

export const runtime = 'nodejs'; // garante streaming no server

function log(...args: any[]) {
  // Logs do servidor:
  console.log('[stream]', ...args);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path'); // ex: /Videos/tv-do-yuri/videos/cartoons/bluey01.mp4
  if (!path) {
    log('FALTA path');
    return new Response('Missing "path"', { status: 400 });
  }

  const target = getWebdavFileUrl(path);
  const range = req.headers.get('range'); // ex: bytes=0-

  const headers: Record<string, string> = {
    Authorization: getAuthHeader(),
  };

  // Passa o Range à requisição do Nextcloud se houver
  if (range) {
    headers.Range = range;
    log('Requisitando com Range:', range, '->', target);
  } else {
    log('Requisitando sem Range ->', target);
  }

  try {
    const upstream = await fetch(target, {
      method: 'GET',
      headers,
    });

    // Copiar status e cabeçalhos relevantes (para vídeo)
    const status = upstream.status;
    const respHeaders = new Headers();

    // Headers importantes para o player HTML5:
    for (const [k, v] of upstream.headers.entries()) {
      // whitelist de cabeçalhos
      if (
        ['content-type', 'content-length', 'accept-ranges', 'content-range', 'etag', 'last-modified', 'date'].includes(
          k.toLowerCase(),
        )
      ) {
        respHeaders.set(k, v);
      }
    }

    // Se não veio content-type, define vídeo genérico
    if (!respHeaders.has('content-type')) {
      respHeaders.set('content-type', 'video/mp4');
    }

    log('Resposta upstream', status, {
      'content-type': respHeaders.get('content-type'),
      'content-length': respHeaders.get('content-length'),
      'content-range': respHeaders.get('content-range'),
      'accept-ranges': respHeaders.get('accept-ranges'),
    });

    // Stream do body
    return new Response(upstream.body, {
      status,
      headers: respHeaders,
    });
  } catch (err: any) {
    log('ERRO ao buscar video:', err?.message || err);
    return new Response('Erro ao buscar vídeo', { status: 502 });
  }
}
