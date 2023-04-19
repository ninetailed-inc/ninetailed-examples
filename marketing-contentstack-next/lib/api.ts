import * as contentstack from 'contentstack';

import getConfig from 'next/config';

import {
  ExperienceMapper,
  ExperimentEntry,
} from '@ninetailed/experience.js-utils';

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
  fieldValue: string | undefined;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || '',
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || '',
});

function getEntriesOfTypeQuery({
  contentTypeUid,
  referenceFieldPath,
  jsonRtePath,
}: GetEntry) {
  return new Promise((resolve, reject) => {
    const query = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) query.includeReference(referenceFieldPath);
    query
      .toJSON()
      .find()
      .then(
        (result) => {
          jsonRtePath &&
            contentstack.Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
            });
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function getEntryByWhereQuery({
  contentTypeUid,
  fieldName,
  fieldValue,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByWhereQuery) {
  return new Promise((resolve, reject) => {
    const landingPageQuery = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath)
      landingPageQuery.includeReference(referenceFieldPath);
    landingPageQuery.toJSON();
    const data = landingPageQuery.where(fieldName, fieldValue).find();
    data.then(
      (result) => {
        jsonRtePath &&
          contentstack.Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
          });
        resolve(result[0]);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
}

function getExperimentsQuery({
  referenceFieldPath = [],
  jsonRtePath,
}: GetExperiment) {
  return new Promise((resolve, reject) => {
    const landingPageQuery = Stack.ContentType('nt_experience').Query();
    landingPageQuery.includeReference([
      'nt_audience',
      'nt_variants',
      ...referenceFieldPath,
    ]);
    landingPageQuery.toJSON();
    const data = landingPageQuery.where('nt_type', 'nt_experiment').find();
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
      'banner',
      'navigation.navigation_items.page_reference',
      // 'navigation.nt_experiences_manual.nt_variants.navigation_items.page_reference', // TODO: Does this work?
      'sections.pricing_plans',
      'sections.nt_experiences_manual.nt_variants',
      'sections.nt_experiences_manual.nt_audience',
      'footer.footer_links.page_reference',
    ],
    jsonRtePath: [
      'banner.text',
      'footer.copyright',
      'sections.headline',
      'sections.subline',
      'sections.pricing_plans.headline',
      'sections.pricing_plans.subline',
      'sections.pricing_plans.price',
      'sections.pricing_plans.discounted_price',
      'sections.pricing_plans.description',
      'sections.pricing_plans.display_title',
      'sections.nt_experiences_manual.nt_variants.headline',
      'sections.nt_experiences_manual.nt_variants.subline',
    ],
  });
  return response[0];
};

// If we need to fetch experiences sequentially
export const getExperience = async (entryUrl: string) => {
  const response = await getEntryByWhereQuery({
    contentTypeUid: 'landing_page',
    fieldName: 'url',
    fieldValue: entryUrl,
    referenceFieldPath: [
      'banner',
      'navigation',
      'navigation.navigation_items.page_reference',
      'sections.pricing_plans',
      'footer',
      'footer.footer_links.page_reference',
    ],
    jsonRtePath: [
      'banner.text',
      'footer.copyright',
      'sections.headline',
      'sections.subline',
      'sections.pricing_plans.headline',
      'sections.pricing_plans.subline',
      'sections.pricing_plans.price',
      'sections.pricing_plans.discounted_price',
      'sections.pricing_plans.description',
      'sections.pricing_plans.display_title',
    ],
  });
  return response[0];
};

export const getAllExperiments = async () => {
  const response = await getExperimentsQuery({
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

  const mappedExperiments = (response[0] || [])
    .map((experiment) => {
      return {
        name: experiment.nt_name,
        type: experiment.nt_type,
        config: experiment.nt_config,
        audience: {
          id: experiment.nt_audience[0].nt_audience_id,
        },
        id: experiment.uid,
        variants: experiment.nt_variants?.map((variant) => {
          return {
            id: variant.uid,
            ...variant,
          };
        }),
      };
    })
    .filter(ExperienceMapper.isExperimentEntry)
    .map(ExperienceMapper.mapExperiment)
    // FIXME: Description undefined bug
    .map(({ description, ...experimentAttrs }) => {
      return experimentAttrs;
    });

  return mappedExperiments;
};
