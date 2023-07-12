import { ContentfulClientApi, createClient } from 'contentful';
import { IPage, IPageFields } from '@/types/contentful';
import {
  ExperienceEntryLike,
  ExperienceMapper,
  ExperimentEntry,
} from '@ninetailed/experience.js-utils-contentful';

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_TOKEN ?? '',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN ?? '',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
  host: 'preview.contentful.com',
});

const getClient = (preview: boolean): ContentfulClientApi => {
  return preview ? previewClient : contentfulClient;
};

interface IQueryParams {
  preview?: boolean;
}
interface IPageQueryParams extends IQueryParams {
  slug: string;
}

const getPageQuery = (pageParams: IPageQueryParams) => {
  return {
    limit: 1,
    include: 10,
    'fields.slug': pageParams.slug,
    content_type: 'page',
  };
};

export async function getPage(pageParams: IPageQueryParams): Promise<IPage> {
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

export async function getExperiments(QueryParams: IQueryParams) {
  const query = {
    content_type: 'nt_experience',
    'fields.nt_type': 'nt_experiment',
  };
  const client = getClient(QueryParams.preview as boolean);
  const entries = await client.getEntries(query);
  const experiments = entries.items as ExperimentEntry[];

  const mappedExperiments = (experiments || [])
    .filter((entry) => ExperienceMapper.isExperiment(entry))
    .map((entry) => {
      return ExperienceMapper.mapExperiment(entry);
    });

  return mappedExperiments;
}

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
