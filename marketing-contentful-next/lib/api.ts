import { ContentfulClientApi, createClient } from 'contentful';
import {
  IConfig,
  IPage,
  IPageFields,
  IPdp,
  IPdpFields,
  IRedirectFields,
} from '@/types/contentful';
import {
  AudienceEntryLike,
  AudienceMapper,
  ExperienceEntryLike,
  ExperienceMapper,
  // ExperimentEntry,
} from '@ninetailed/experience.js-utils-contentful';
import {
  buildPageEvent,
  GeoLocation,
  NinetailedApiClient,
  NINETAILED_ANONYMOUS_ID_COOKIE,
} from '@ninetailed/experience.js-shared';
import { Ninetailed } from '@ninetailed/experience.js';
import { v4 as uuid } from 'uuid';
import { GetServerSidePropsContext } from 'next';

const contentfulClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_TOKEN ?? '',
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ?? 'master',
});

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN ?? '',
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ?? 'master',
  host: 'preview.contentful.com',
});

const getClient = (preview: boolean): ContentfulClientApi => {
  return preview ? previewClient : contentfulClient;
};

interface IQueryParams {
  preview?: boolean;
}
interface IPagelikeQueryParams extends IQueryParams {
  slug: string;
}

// TODO: Use generics to reduce regular page and PDP page repeititon

const getPageQuery = (pageParams: IPagelikeQueryParams) => {
  return {
    limit: 1,
    include: 10,
    'fields.slug': pageParams.slug,
    content_type: 'page',
  };
};

const getProductDisplayPageQuery = (pageParams: IPagelikeQueryParams) => {
  return {
    limit: 1,
    include: 10,
    'fields.slug': pageParams.slug,
    content_type: 'pdp',
  };
};

export async function getRedirect({ slug, preview }: IPagelikeQueryParams) {
  const query = {
    limit: 1,
    include: 2,
    'fields.from': slug,
    content_type: 'redirect',
  };
  const client = getClient(Boolean(preview));
  const entries = await client.getEntries<IRedirectFields>(query);

  if (!entries.items.length) {
    return null;
  }

  return entries.items[0];
}

export async function getPage(
  pageParams: IPagelikeQueryParams
): Promise<IPage> {
  const query = getPageQuery(pageParams);
  const client = getClient(pageParams.preview as boolean);
  const entries = await client.getEntries<IPageFields>(query);
  const [page] = entries.items as IPage[];
  return page;
}

export async function getPages(QueryParams: IQueryParams): Promise<IPage[]> {
  const query = { content_type: 'page' };
  const client = getClient(QueryParams.preview as boolean);
  const entries = await client.getEntries<IPageFields>(query);
  const pages = entries.items as IPage[];

  return pages || [];
}

export async function getProductPage(
  pageParams: IPagelikeQueryParams
): Promise<IPdp> {
  const query = getProductDisplayPageQuery(pageParams);
  const client = getClient(pageParams.preview as boolean);
  const entries = await client.getEntries<IPdpFields>(query);
  const [pdp] = entries.items as IPdp[];
  return pdp;
}

export async function getProductPages(
  QueryParams: IQueryParams
): Promise<IPdp[]> {
  const query = { content_type: 'pdp' };
  const client = getClient(QueryParams.preview as boolean);
  const entries = await client.getEntries<IPdpFields>(query);
  const pdps = entries.items as IPdp[];

  return pdps || [];
}

export async function getGlobalConfig(QueryParams: IQueryParams) {
  const query = {
    content_type: 'config',
    limit: 1,
    include: 4, // Need at least 4: Config [0] => Nav [1] => NT Experience [2] => NT Variants [3] => Button [4]
  };
  const client = getClient(QueryParams.preview as boolean);
  const entries = await client.getEntries(query);
  return entries.items[0] as IConfig;
}

// For the preview widget
export async function getAllExperiences() {
  const query = {
    content_type: 'nt_experience',
    include: 1,
  };

  const client = getClient(true);

  const entries = await client.getEntries(query);
  const experiences = entries.items as ExperienceEntryLike[];

  const mappedExperiences = (experiences || [])
    .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
    .map((entry) => ExperienceMapper.mapExperience(entry));

  return mappedExperiences;
}

export async function getAllAudiences() {
  const query = {
    content_type: 'nt_audience',
  };

  const client = getClient(true);

  const entries = await client.getEntries(query);
  const audiences = entries.items as AudienceEntryLike[];

  const mappedAudiences = (audiences || [])
    .filter((entry) => AudienceMapper.isAudienceEntry(entry))
    .map((entry) => AudienceMapper.mapAudience(entry));

  return mappedAudiences;
}

type Cookies = { [key: string]: string };

type GetServerSideProfileOptions = {
  ctx: GetServerSidePropsContext;
  url?: string;
  ip?: string;
  location?: GeoLocation;
  preflight?: boolean;
};

export const ninetailedClient = new NinetailedApiClient({
  clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? '',
  environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main',
});

const buildPageEventFromNextContext = (ctx: GetServerSidePropsContext) =>
  buildPageEvent({
    ctx: {
      url: ctx.req.url
        ? new URL(ctx.req.url, 'https://my-domain.com').toString()
        : '',
      locale: '',
      referrer: ctx.req.headers.referer || '',
      userAgent: ctx.req.headers['user-agent'] || '',
    },
    messageId: uuid(),
    timestamp: Date.now(),
    properties: {},
  });

const sendNinetailedProfileRequest = async ({
  ctx,
  ip,
  location,
}: GetServerSideProfileOptions) => {
  const anonymousId = ctx.req.cookies[NINETAILED_ANONYMOUS_ID_COOKIE];

  const pageEvent = buildPageEventFromNextContext(ctx);

  return ninetailedClient.upsertProfile(
    {
      profileId: anonymousId,
      events: [{ ...pageEvent, context: { ...pageEvent.context, location } }],
    },
    { ip, preflight: false }
  );
};

export const sendNinetailedPreflightRequest = async ({
  ctx,
  ip,
  location,
}: GetServerSideProfileOptions) => {
  return sendNinetailedProfileRequest({ ctx, ip, location, preflight: true });
};

export const sendNinetailedPageview = async ({
  ctx,
  ip,
  location,
}: GetServerSideProfileOptions) => {
  return sendNinetailedProfileRequest({ ctx, ip, location, preflight: false });
};

export const ninetailedInstance = new Ninetailed({
  clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? '',
  environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main',
});
