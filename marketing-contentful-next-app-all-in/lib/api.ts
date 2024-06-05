import { ContentfulClientApi, createClient } from 'contentful';
import {
  IConfig,
  IPage,
  IPageFields,
  IPdp,
  IPdpFields,
} from '@/types/contentful';
// import {
//   AudienceEntryLike,
//   AudienceMapper,
//   ExperienceEntryLike,
//   ExperienceMapper,
//   // ExperimentEntry,
// } from '@ninetailed/experience.js-utils-contentful';

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
// export async function getAllExperiences() {
//   const query = {
//     content_type: 'nt_experience',
//     include: 1,
//   };

//   const client = getClient(true);

//   const entries = await client.getEntries(query);
//   const experiences = entries.items as ExperienceEntryLike[];

//   const mappedExperiences = (experiences || [])
//     .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
//     .map((entry) => ExperienceMapper.mapExperience(entry));

//   return mappedExperiences;
// }

// export async function getAllAudiences() {
//   const query = {
//     content_type: 'nt_audience',
//   };

//   const client = getClient(true);

//   const entries = await client.getEntries(query);
//   const audiences = entries.items as AudienceEntryLike[];

//   const mappedAudiences = (audiences || [])
//     .filter((entry) => AudienceMapper.isAudienceEntry(entry))
//     .map((entry) => AudienceMapper.mapAudience(entry))
//     .map((entry) => {
//       return { ...entry, name: entry?.name ?? '' };
//     });

//   return mappedAudiences;
// }
