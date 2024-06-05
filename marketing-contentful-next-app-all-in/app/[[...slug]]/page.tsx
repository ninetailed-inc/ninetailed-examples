import { draftMode } from 'next/headers';

import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { getPages, getPage, getGlobalConfig } from '@/lib/api';

import { setExperiences } from '@/lib/ninetailedServerContext';
import { EDGE_URL_DELIMITER } from '@/lib/constants';
import { decodeExperienceSelections } from '@/lib/middlewareFunctions';

export default async function Page({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const edgeDelimiter = encodeURIComponent(EDGE_URL_DELIMITER);
  const rawSlug = get(params, 'slug', []) as string[];
  const selectedExperiencesSlug = rawSlug[0] || '';
  const computedEdgeProfile = selectedExperiencesSlug.startsWith(edgeDelimiter); // This will be false in contexts where Edge Middleware is not running
  const selectedExperiences = computedEdgeProfile
    ? decodeExperienceSelections(
        selectedExperiencesSlug.split(edgeDelimiter)[1]
      )
    : null;
  const pagePath = computedEdgeProfile
    ? rawSlug.slice(1).join('/')
    : rawSlug.join('/');

  const { isEnabled } = draftMode();
  const [page, config] = await Promise.all([
    getPage({
      preview: isEnabled,
      slug: pagePath === '' ? '/' : pagePath,
    }),
    getGlobalConfig({ preview: isEnabled }),
  ]);

  if (!page) {
    return null;
  }

  setExperiences(selectedExperiences);

  const { sections = [] } = page.fields;
  const { banner, navigation, footer } = config.fields;

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {banner && <BlockRenderer block={banner} />}
        {navigation && <BlockRenderer block={navigation} />}
        <main className="grow">
          {/* eslint-disable-next-line */}
          {/* @ts-ignore */}
          <BlockRenderer block={sections} />
        </main>
        {footer && <BlockRenderer block={footer} />}
      </div>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const { isEnabled } = draftMode();
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const page = await getPage({
    preview: isEnabled,
    slug: slug === '' ? '/' : slug,
  });

  if (!page) {
    return [];
  }

  const { seo } = page.fields;

  return {
    title: seo?.fields.title,
    description: seo?.fields.description,
    robots: {
      follow: !seo?.fields.no_follow ?? false,
      index: !seo?.fields.no_index ?? false,
      googleBot: {
        follow: !seo?.fields.no_follow ?? false,
        index: !seo?.fields.no_index ?? false,
      },
    },
  };
}
