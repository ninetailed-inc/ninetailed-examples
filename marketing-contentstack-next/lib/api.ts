import * as contentstack from 'contentstack';
import ContentstackLivePreview from '@contentstack/live-preview-utils';
import { addEditableTags } from '@contentstack/utils';

import { ExperienceMapper } from '@ninetailed/experience.js-utils';
import { EmbeddedItem } from '@contentstack/utils/dist/types/Models/embedded-object';

type GetEntry = {
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetExperiment = {
  referenceFieldPath?: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryByWhereQuery = {
  contentTypeUid: string;
  fieldName: string;
  fieldValue: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || '',
  branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH || '',
  live_preview: {
    management_token:
      process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN || '',
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_ENABLE_LIVE_PREVIEW === 'true',
    host: 'api.contentstack.io',
  },
});

// eslint-disable-next-line
ContentstackLivePreview.init({
  // eslint-disable-next-line
  //@ts-ignore
  stackSdk: Stack,
  stackDetails: {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || '',
  },
  clientUrlParams: {
    protocol: 'https',
    host: 'app.contentstack.com',
    port: 443,
  },
  ssr: false,
});

// eslint-disable-next-line
export const onEntryChange = ContentstackLivePreview.onEntryChange;

// TODO: Here and throughout this file, provide better typing on CS Delivery API return values
// eslint-disable-next-line
function getEntriesOfTypeQuery<T = any>({
  contentTypeUid,
}: GetEntry): Promise<T> {
  return new Promise((resolve, reject) => {
    const query = Stack.ContentType(contentTypeUid).Query();
    query
      .toJSON()
      .find()
      .then(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

async function getEntryByWhereQuery({
  contentTypeUid,
  fieldName,
  fieldValue,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByWhereQuery) {
  const entryQuery = Stack.ContentType(contentTypeUid).Query();
  if (referenceFieldPath) {
    entryQuery.includeReference(referenceFieldPath).toJSON();
  }
  try {
    const result = await entryQuery.where(fieldName, fieldValue).find();
    jsonRtePath &&
      contentstack.Utils.jsonToHTML({
        entry: result,
        paths: jsonRtePath,
      });

    if (result?.[0]?.[0]) {
      addEditableTags(result[0][0] as EmbeddedItem, contentTypeUid, true);
    }
    return result[0];
  } catch (err) {
    console.log('getEntryByUrl Error:', err);
    throw err;
  }
}

function getAllExperiencesQuery({
  referenceFieldPath = [],
  jsonRtePath,
}: GetExperiment): Promise<any> {
  return new Promise((resolve, reject) => {
    const landingPageQuery = Stack.ContentType('nt_experience').Query();
    landingPageQuery
      .includeReference(['nt_audience', 'nt_variants', ...referenceFieldPath])
      .toJSON();
    const data = landingPageQuery.find();
    data.then(
      (result) => {
        jsonRtePath &&
          contentstack.Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
          });
        resolve(result);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
}

export const getAllLandingPages = async () => {
  const response = await getEntriesOfTypeQuery({
    contentTypeUid: 'landing_page',
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  return response[0];
};

export const getLandingPage = async (entryUrl: string) => {
  const response = await getEntryByWhereQuery({
    contentTypeUid: 'landing_page',
    fieldName: 'url',
    fieldValue: entryUrl,
    referenceFieldPath: [
      'sections.hero.nt_experiences.nt_audience',
      'sections.cta.nt_experiences.nt_audience',
      'nt_modular_blocks_experiences.nt_experience_block.nt_variants',
      'nt_modular_blocks_experiences.nt_experience_block.nt_experience',
    ],
    jsonRtePath: [
      'sections.hero.headline',
      'sections.hero.subline',
      'nt_modular_blocks_experiences.nt_experience_block.nt_variants.hero.headline',
      'nt_modular_blocks_experiences.nt_experience_block.nt_variants.hero.subline',
      'sections.cta.headline',
      'sections.cta.subline',
      'nt_modular_blocks_experiences.nt_experience_block.nt_variants.cta.headline',
      'nt_modular_blocks_experiences.nt_experience_block.nt_variants.cta.subline',
      //
      // 'sections.pricing_plans.headline',
      // 'sections.pricing_plans.subline',
      // 'sections.pricing_plans.price',
      // 'sections.pricing_plans.discounted_price',
      // 'sections.pricing_plans.description',
      // 'sections.pricing_plans.display_title',
      // 'sections.nt_experiences.nt_variants.headline',
      // 'sections.nt_experiences.nt_variants.subline',
      // 'sections.nt_experiences.nt_variants.pricing_plans.headline',
      // 'sections.nt_experiences.nt_variants.pricing_plans.subline',
      // 'sections.nt_experiences.nt_variants.pricing_plans.price',
      // 'sections.nt_experiences.nt_variants.pricing_plans.discounted_price',
      // 'sections.nt_experiences.nt_variants.pricing_plans.description',
      // 'sections.nt_experiences.nt_variants.pricing_plans.display_title',
    ],
  });
  return response[0];
};

export const getConfigEntry = async () => {
  const response = await getEntryByWhereQuery({
    fieldName: 'title',
    fieldValue: 'Global Configuration',
    contentTypeUid: 'config',
    referenceFieldPath: [
      'banner',
      'banner.nt_experiences.nt_variants',
      'banner.nt_experiences.nt_audience',
      'navigation.navigation_items.page_reference',
      //'navigation.nt_experiences.nt_variants.navigation_items.page_reference',
      'footer.footer_links.page_reference',
    ],
    jsonRtePath: [
      'banner.text',
      'banner.nt_experiences.nt_variants.text',
      'footer.copyright',
    ],
  });
  return response[0];
};

export const getAllExperiences = async () => {
  const response = await getAllExperiencesQuery({
    jsonRtePath: [
      'nt_variants.text',
      'nt_variants.copyright',
      'nt_variants.headline',
      'nt_variants.subline',
      'nt_variants.pricing_plans.headline',
      'nt_variants.pricing_plans.subline',
      'nt_variants.pricing_plans.price',
      'nt_variants.pricing_plans.discounted_price',
      'nt_variants.pricing_plans.description',
      'nt_variants.pricing_plans.display_title',
    ],
  });

  // TODO: Turn into reusable function
  const mappedExperiences = (response[0] || [])
    .map((experience: any) => {
      return {
        name: experience.nt_name,
        type: experience.nt_type,
        config: experience.nt_config,
        ...(experience.nt_audience.length
          ? {
              audience: {
                id: experience.nt_audience[0].nt_audience_id,
                name: experience.nt_audience[0].title,
              },
            }
          : {}),
        id: experience.uid,
        variants: experience.nt_variants?.map((variant: any) => {
          return {
            id: variant.uid,
            ...variant,
          };
        }),
      };
    })
    .filter(ExperienceMapper.isExperienceEntry)
    .map(ExperienceMapper.mapExperience);

  return mappedExperiences;
};
