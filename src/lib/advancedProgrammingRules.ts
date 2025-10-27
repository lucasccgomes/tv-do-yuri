import { Video, PlaylistItem, AppSettings } from '@/types';
import { getVideoProgress } from '@/lib/settingsManager';

// ===== Config padrão =====
const BLOCK_MINUTES_DEFAULT = 20; // corte padrão de 20 min

// ===== Normalização de categorias (resolve ts(2367)) =====
// Seu projeto usa algo como: "cartoon" | "educational_clip" | possivelmente "ad".
// Vamos criar guards que aceitam AMBOS os esquemas.
type VideoCategoryLike = Video['category'];

function isShow(v: Video): boolean {
  const c = String(v.category) as VideoCategoryLike | string;
  return c === 'show' || c === 'cartoon';
}
function isEducational(v: Video): boolean {
  const c = String(v.category) as VideoCategoryLike | string;
  return c === 'educational' || c === 'educational_clip';
}
function isCommercial(v: Video): boolean {
  const c = String(v.category) as VideoCategoryLike | string;
  return c === 'commercial' || c === 'ad';
}

// ===== Helpers de série/ordenação =====
function getSeriesKey(v: Video): string {
  // Prioriza seriesId se existir; fallback: prefixo do id até o primeiro "-"
  const anyV = v as any;
  if (anyV.seriesId) return String(anyV.seriesId);
  const idx = v.id.indexOf('-');
  return idx > 0 ? v.id.slice(0, idx) : v.id; // "veg-001" => "veg"
}

function getEpisodeOrderValue(v: Video): number | string {
  const anyV = v as any;
  if (anyV.episodeNumber != null) return Number(anyV.episodeNumber);
  return v.id;
}

function sortEpisodesForSeries(episodes: Video[]): Video[] {
  return [...episodes].sort((a, b) => {
    const av = getEpisodeOrderValue(a);
    const bv = getEpisodeOrderValue(b);
    if (typeof av === 'number' && typeof bv === 'number') return av - bv;
    return String(av).localeCompare(String(bv), undefined, { numeric: true });
  });
}

// seleciona comercial/clipe educativo aleatório
function pickInterstitial(educationalClips: Video[], commercials: Video[]): Video | null {
  const pool = [
    ...educationalClips.filter(isEducational),
    ...commercials.filter(isCommercial),
  ];
  if (pool.length === 0) return null;
  const i = Math.floor(Math.random() * pool.length);
  return pool[i];
}

// encontra o próximo episódio (a partir de um vídeo base) respeitando sequência da série
function nextEpisodeAfter(current: Video, allShows: Video[]): Video | null {
  const seriesKey = getSeriesKey(current);
  const episodes = sortEpisodesForSeries(allShows.filter(v => getSeriesKey(v) === seriesKey));
  const idx = episodes.findIndex(v => v.id === current.id);
  if (idx < 0) return null;
  return episodes[idx + 1] ?? null;
}

// escolhe próxima série para alternar (evita repetir a última)
function pickNextShow(shows: Video[], lastSeriesUsed: string | null): Video | null {
  if (shows.length === 0) return null;
  if (!lastSeriesUsed) return shows[0];
  const candidates = shows.filter(v => getSeriesKey(v) !== lastSeriesUsed);
  return (candidates[0] ?? shows[0]) || null;
}

// ======= Função principal =======

/**
 * Gera a playlist do dia com corte dinâmico de episódios longos em blocos.
 * - Blocos de até 20 minutos (padrão) ou `settings.maxContinuousPerShowMinutes`, o que for menor.
 * - Insere 1 comercial/clipe educativo após cada bloco de desenho.
 * - Não repete novo bloco do MESMO episódio no mesmo dia (continua em outro dia).
 * - Respeita sequência por ID/episodeNumber dentro da série.
 *
 * @param allVideos  Lista completa (shows + comerciais/clipes)
 * @param settings   AppSettings (usa allowVideoResumption, maxContinuousPerShowMinutes, respectSequenceById?)
 * @param maxItems   Máximo de itens (PlaylistItem) para hoje (desenhos+intersticiais juntos)
 */
export function generateDailyPlaylist(
  allVideos: Video[],
  settings: AppSettings,
  maxItems: number = 12
): PlaylistItem[] {
  // Separa por categoria (usando os guards acima)
  const shows = allVideos.filter(isShow);
  const educationalClips = allVideos.filter(isEducational);
  const commercials = allVideos.filter(isCommercial);

  // Caso seu AppSettings NÃO tenha respectSequenceById, caímos no default = true
  const respectSequenceById: boolean =
    (settings as any).respectSequenceById ?? true;

  const playlist: PlaylistItem[] = [];
  let lastSeriesUsed: string | null = null;

  // Calcula o tamanho de bloco (em segundos)
  const maxBlockMinutes = Math.min(
    Math.max((settings as any).maxContinuousPerShowMinutes || BLOCK_MINUTES_DEFAULT, 1),
    60 // segurança
  );
  const blockSeconds = maxBlockMinutes * 60;

  // Função auxiliar para montar um bloco (segmento) a partir de um video "show"
  const makeShowBlock = (video: Video): PlaylistItem | null => {
    let startAt = 0;

    if ((settings as any).allowVideoResumption) {
      const saved = getVideoProgress(video.id);
      if (typeof saved === 'number') startAt = saved;
      else if (typeof (saved as any)?.position === 'number') startAt = (saved as any).position;
    }

    if (startAt >= video.duration) {
      // episódio já finalizado → tentar próximo da série
      if (respectSequenceById) {
        const nextEp = nextEpisodeAfter(video, shows);
        if (nextEp) return makeShowBlock(nextEp);
      }
      return null;
    }

    const remaining = Math.max(0, video.duration - startAt);
    const endAt = startAt + Math.min(blockSeconds, remaining);

    // IMPORTANTE: PlaylistItem exige reason → sempre preencha
    const block: PlaylistItem = {
      video,
      startAt,
      endAt,
      reason: 'show_block' as any, // caso seu tipo seja union, ajuste o literal; o `as any` evita ts(2741)
    };
    return block;
  };

  // Evitamos repetir a mesma série no mesmo dia
  const seriesSeenToday = new Set<string>();

  // Constrói programação alternando séries diferentes e inserindo intersticiais
  while (playlist.length < maxItems) {
    // Preferimos séries que AINDA NÃO passaram hoje; senão, usamos qualquer uma
    const candidateList =
      shows.filter(v => !seriesSeenToday.has(getSeriesKey(v))) || shows;

    const nextShow =
      pickNextShow(candidateList, lastSeriesUsed) ??
      pickNextShow(shows, lastSeriesUsed);

    if (!nextShow) break;

    // Se respeitar sequência, garanta que estamos no episódio correto (considerando progresso)
    let showForToday: Video = nextShow;
    if (respectSequenceById) {
      const saved = (settings as any).allowVideoResumption ? getVideoProgress(nextShow.id) : undefined;
      const savedNum =
        typeof saved === 'number' ? saved :
        typeof (saved as any)?.position === 'number' ? (saved as any).position : 0;

      if (savedNum >= nextShow.duration) {
        const nextEp = nextEpisodeAfter(nextShow, shows);
        if (nextEp) showForToday = nextEp;
      }
    }

    const block = makeShowBlock(showForToday);
    if (!block) {
      seriesSeenToday.add(getSeriesKey(nextShow));
      continue;
    }

    // Adiciona bloco de desenho
    playlist.push(block);
    lastSeriesUsed = getSeriesKey(block.video);
    seriesSeenToday.add(lastSeriesUsed);

    if (playlist.length >= maxItems) break;

    // Insere um intersticial (comercial/clipe educativo)
    const inter = pickInterstitial(educationalClips, commercials);
    if (inter) {
      playlist.push({
        video: inter,
        reason: 'interstitial' as any, // idem: tipagem flexível para seu union
      } as PlaylistItem);
    }

    if (playlist.length >= maxItems) break;
  }

  return playlist;
}
