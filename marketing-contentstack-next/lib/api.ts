import * as contentstack from 'contentstack';

import getConfig from 'next/config';

import {
  ExperienceMapper,
  ExperimentEntry,
  isEntry,
} from '@ninetailed/experience.js-utils-contentful';

type GetEntry = {
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
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

function getLandingPageByUrlQuery({
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByUrl) {
  return new Promise((resolve, reject) => {
    const landingPageQuery = Stack.ContentType('landing_page').Query();
    if (referenceFieldPath)
      landingPageQuery.includeReference(referenceFieldPath);
    landingPageQuery.toJSON();
    const data = landingPageQuery.where('url', `${entryUrl}`).find();
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

export const getAllLandingPages = async () => {
  const response = await getEntriesOfTypeQuery({
    contentTypeUid: 'landing_page',
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  return response[0];
};

export const getLandingPage = async (entryUrl: string) => {
  const response = await getLandingPageByUrlQuery({
    contentTypeUid: 'landing_page',
    entryUrl,
    referenceFieldPath: [
      'banner',
      'navigation',
      'navigation.navigation_items.page_reference',
      'sections',
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

// export async function getExperiments() {
//   const query = {
//     content_type: 'nt_experience',
//     'fields.nt_type': 'nt_experiment',
//   };
//   const client = getClient(false);
//   const entries = await client.getEntries(query);
//   const experiments = entries.items as ExperimentEntry[];

//   const mappedExperiments = (experiments || []).filter(isEntry).map((entry) => {
//     return ExperienceMapper.mapExperiment(entry);
//   });

//   return mappedExperiments;
// }
