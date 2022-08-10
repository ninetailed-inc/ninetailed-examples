import { ContentfulClientApi, createClient } from 'contentful';
import { IPage, IPageFields } from '@/types/contentful';
import {
  ExperienceEntry,
  ExperienceMapper,
  isEntry,
} from '@ninetailed/experience.js-utils-contentful';

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_TOKEN ?? '',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN ?? '',
  host: 'preview.contentful.com',
});

const getClient = (preview: boolean): ContentfulClientApi => {
  return preview ? previewClient : contentfulClient;
};

interface IPageQueryParams {
  slug: string;
  pageContentType: string;
  childPageContentType: string;
  preview?: boolean;
}

const getPageQuery = (pageParams: IPageQueryParams) => {
  return {
    limit: 1,
    include: 10,
    'fields.slug': pageParams.slug,
    content_type: pageParams.pageContentType,
    'fields.content.sys.contentType.sys.id': pageParams.childPageContentType,
  };
};

export async function getPage(pageParams: IPageQueryParams): Promise<IPage> {
  const query = getPageQuery(pageParams);
  const client = getClient(!!pageParams.preview);
  const entries = await client.getEntries<IPageFields>(query);
  const [page] = entries.items as IPage[];
  return page;
}

interface IPagesOfTypeQueryParams {
  pageContentType: string;
  childPageContentType: string;
  preview?: boolean;
}
const getTypesOfPageQuery = (pageParams: IPagesOfTypeQueryParams) => {
  return {
    limit: 100,
    content_type: pageParams.pageContentType,
    'fields.content.sys.contentType.sys.id': pageParams.childPageContentType,
  };
};

export async function getPagesOfType(
  pageParams: IPagesOfTypeQueryParams
): Promise<IPage[]> {
  const query = getTypesOfPageQuery(pageParams);
  const client = getClient(!!pageParams.preview);
  const entries = await client.getEntries<IPageFields>(query);
  const pages = entries.items as IPage[];

  return pages || [];
}

export async function getExperiments() {
  const query = {
    content_type: 'nt_experience',
    'fields.nt_type': 'nt_experiment',
  };
  const client = getClient(false);
  const entries = await client.getEntries(query);
  const experiments = entries.items as ExperienceEntry[];

  return (experiments || []).filter(isEntry).map((entry) => {
    return ExperienceMapper.mapExperiment(entry);
  });
}
