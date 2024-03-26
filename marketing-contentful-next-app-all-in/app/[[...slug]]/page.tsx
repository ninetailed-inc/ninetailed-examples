import { draftMode } from 'next/headers';

import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { getPage, getGlobalConfig } from '@/lib/api';

import { NinetailedApiClient } from '@ninetailed/experience.js-shared';
import { setExperiences, setProfile } from '@/lib/ninetailedServerContext';
import { EDGE_URL_DELIMITER } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const edgeEncoder = encodeURIComponent(EDGE_URL_DELIMITER);
  const rawSlug = get(params, 'slug', []) as string[];
  const profileIdSlug = rawSlug[0] || '';
  const receivedEdgeProfileId = profileIdSlug.startsWith(edgeEncoder); // This will be false in contexts where Edge Middleware is not running
  const profileId = receivedEdgeProfileId
    ? profileIdSlug.split(edgeEncoder)[1]
    : null;
  const pagePath = receivedEdgeProfileId
    ? rawSlug.slice(1).join('/')
    : rawSlug.join('/');

  const ninetailedApiClient = new NinetailedApiClient({
    clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || '',
    environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || '',
  });

  const { isEnabled } = draftMode();
  const [page, config, ninetailedResponse] = await Promise.all([
    getPage({
      preview: isEnabled,
      slug: pagePath,
    }),
    getGlobalConfig({ preview: isEnabled }),
    profileId
      ? ninetailedApiClient.getProfile(profileId)
      : { profile: null, experiences: [] },
  ]);

  if (!page) {
    return null;
  }

  setProfile(ninetailedResponse.profile);
  setExperiences(ninetailedResponse.experiences);

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
