import { createClient } from 'contentful';

import {
  AudienceEntryLike,
  AudienceMapper,
  ExperienceEntryLike,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';

import {
  type TypePdpSkeleton,
  type TypeArticleSkeleton,
  type TypePageSkeleton,
  type TypeConfigSkeleton,
  type TypeNt_experienceSkeleton,
  type TypeNt_audienceSkeleton,
} from '../types';

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
  includeContentSourceMaps: true,
});

const getClient = (preview: boolean) => {
  return preview ? previewClient : contentfulClient;
};

interface IQueryParams {
  preview?: boolean;
}
interface IPagelikeQueryParams extends IQueryParams {
  slug: string;
}

type Include = 0 | 1 | 10 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;

// TODO: Use generics to reduce regular page and PDP page repeititon

const getPageQuery = (pageParams: IPagelikeQueryParams) => {
  return {
    limit: 1,
    include: 10 as Include,
    'fields.slug': pageParams.slug,
    content_type: 'page',
  };
};

const getProductDisplayPageQuery = (pageParams: IPagelikeQueryParams) => {
  return {
    limit: 1,
    include: 10 as Include,
    'fields.slug': pageParams.slug,
    content_type: 'pdp',
  };
};

const getArticleQuery = (pageParams: IPagelikeQueryParams) => {
  return {
    limit: 1,
    include: 10 as Include,
    'fields.slug': pageParams.slug,
    content_type: 'article',
  };
};

export async function getPage(pageParams: IPagelikeQueryParams) {
  const query = getPageQuery(pageParams);
  const client = getClient(pageParams.preview as boolean);
  const entries = await client.getEntries<TypePageSkeleton>(query);
  const [page] = entries.items;
  return page;
}

export async function getPages(QueryParams: IQueryParams) {
  const client = getClient(QueryParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
      content_type: 'page',
    });
  const pages = entries.items;

  return pages || [];
}

export async function getProductPage(pageParams: IPagelikeQueryParams) {
  const query = getProductDisplayPageQuery(pageParams);
  const client = getClient(pageParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypePdpSkeleton>(query);
  const [pdp] = entries.items;
  return pdp;
}

export async function getProductPages(QueryParams: IQueryParams) {
  const client = getClient(QueryParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypePdpSkeleton>({
      content_type: 'pdp',
    });
  const pdps = entries.items;

  return pdps || [];
}

export async function getArticle(pageParams: IPagelikeQueryParams) {
  const query = getArticleQuery(pageParams);
  const client = getClient(pageParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypeArticleSkeleton>(
      query
    );
  const [article] = entries.items;
  return article;
}

export async function getArticles(QueryParams: IQueryParams) {
  const client = getClient(QueryParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypeArticleSkeleton>({
      content_type: 'article',
    });
  const articles = entries.items;

  return articles || [];
}

export async function getGlobalConfig(QueryParams: IQueryParams) {
  const query = {
    content_type: 'config',
    limit: 1,
    include: 4 as Include, // Need at least 4: Config [0] => Nav [1] => NT Experience [2] => NT Variants [3] => Button [4]
  };
  const client = getClient(QueryParams.preview as boolean);
  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypeConfigSkeleton>(query);
  return entries.items[0];
}

// For the preview widget

export async function getAllExperiences(QueryParams: IQueryParams) {
  const query = {
    content_type: 'nt_experience',
    include: 1 as Include,
  };

  const client = getClient(QueryParams.preview as boolean);

  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypeNt_experienceSkeleton>(
      query
    );
  const experiences = entries.items as ExperienceEntryLike[];

  const mappedExperiences = (experiences || [])
    .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
    .map((entry) => ExperienceMapper.mapExperience(entry));

  return mappedExperiences;
}

export async function getAllAudiences(QueryParams: IQueryParams) {
  const query = {
    content_type: 'nt_audience',
    include: 0 as Include,
  };

  const client = getClient(QueryParams.preview as boolean);

  const entries =
    await client.withoutUnresolvableLinks.getEntries<TypeNt_audienceSkeleton>(
      query
    );
  const audiences = entries.items as AudienceEntryLike[];

  const mappedAudiences = (audiences || [])
    .filter((entry) => AudienceMapper.isAudienceEntry(entry))
    .map((entry) => AudienceMapper.mapAudience(entry));

  return mappedAudiences;
}
