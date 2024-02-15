import {
  buildPageEvent,
  GeoLocation,
  NinetailedRequestContext,
  NinetailedApiClient,
  NINETAILED_ANONYMOUS_ID_COOKIE,
} from '@ninetailed/experience.js-shared';
import { parse as parseLanguage } from 'accept-language-parser';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { v4 as uuid } from 'uuid';

type GetServerSideProfileOptions = {
  ctx: NinetailedRequestContext;
  cookies: RequestCookies;
  clientId: string;
  environment?: string;
  url?: string;
  ip?: string;
  location?: GeoLocation;
};

export const fetchEdgeProfile = async ({
  ctx,
  cookies,
  clientId,
  environment,
  url,
  ip,
  location,
}: GetServerSideProfileOptions) => {
  const apiClient = new NinetailedApiClient({ clientId, environment, url });
  const ninetailedId = cookies.get(NINETAILED_ANONYMOUS_ID_COOKIE)?.value;

  const pageEvent = buildPageEvent({
    ctx,
    messageId: uuid(),
    timestamp: Date.now(),
    properties: {},
  });

  return apiClient.upsertProfile(
    {
      profileId: ninetailedId,
      events: [{ ...pageEvent, context: { ...pageEvent.context, location } }],
    },
    { ip, preflight: true }
  );
};

const getLocale = (request: Request): string => {
  const languageHeader = request.headers.get('Accept-Language');
  const languages = parseLanguage(languageHeader || '');

  const locale = languages
    .map((language) => {
      return `${language.code}${language.region ? `-${language.region}` : ''}`;
    })
    .join(',');

  return locale;
};

export const buildNinetailedEdgeRequestContext = (
  request: Request
): NinetailedRequestContext => {
  return {
    url: request.url,
    locale: getLocale(request),
    referrer: request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
  };
};

// export type CachedFetcherProps = {
//   context: ExecutionContext;
//   defaultTtl: number;
// };
// export class CachedFetcher {
//   private readonly context: ExecutionContext;

//   private readonly defaultTtl: number;

//   constructor({ context, defaultTtl }: CachedFetcherProps) {
//     this.context = context;
//     this.defaultTtl = defaultTtl;
//   }

//   async fetch(request: Request, ttl?: number): Promise<Response> {
//     const cacheTtl = ttl ?? this.defaultTtl;

//     const cache = caches.default;
//     const cachedResponse = await cache.match(request.url);

//     if (!cachedResponse) {
//       console.log(`cache miss ${request.url}`);
//       return CachedFetcher.fetchAndCacheResponse(request);
//     }
//     console.log(`cache hit ${request.url}`);

//     const cacheTimestamp = cachedResponse.headers.get('Cache-Timestamp');
//     const cacheAge = (Date.now() - Number(cacheTimestamp)) / 1000;
//     const stale = !cacheTimestamp || cacheAge > cacheTtl;

//     console.log(
//       `cache age: ${cacheAge} | ttl: ${cacheTtl} | stale: ${stale.toString()}`
//     );

//     if (stale) {
//       this.context.waitUntil(CachedFetcher.fetchAndCacheResponse(request));
//     }

//     return cachedResponse;
//   }

//   private static fetchAndCacheResponse = async (
//     request: Request
//   ): Promise<Response> => {
//     const cache = caches.default;
//     const response = await fetch(request);
//     const clonedResponse = response.clone();
//     const responseToCache = new Response(clonedResponse.body, clonedResponse);
//     // add a timestamp header to the response to be used for cache revalidation
//     responseToCache.headers.append('Cache-Timestamp', String(Date.now()));
//     responseToCache.headers.set(
//       'Cache-Control',
//       `s-maxage=${60 * 60 * 24 * 365}`
//     );
//     await cache.put(request.url, responseToCache);
//     console.log(`caching ${request.url}`);
//     return response;
//   };
// }
