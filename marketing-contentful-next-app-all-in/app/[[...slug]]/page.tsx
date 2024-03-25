import { cookies, draftMode } from 'next/headers';

import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { getPages, getPage, getGlobalConfig } from '@/lib/api';

import {
  NinetailedApiClient,
  buildPageEvent,
} from '@ninetailed/experience.js-shared';
import { v4 as uuid } from 'uuid';
import { headers } from 'next/headers';
import { setExperiences, setProfile } from '@/lib/ninetailedServerContext';
import RefreshRoute from '@/components/Client/RefreshRoute';
import { NINETAILED_ANONYMOUS_ID_COOKIE } from '@ninetailed/experience.js-shared';
import { setNinetailedId } from 'app/actions';

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const pagePath = slug === '' ? '/' : slug;

  const headersList = headers();
  const referer = headersList.get('referer');
  const userAgent = headersList.get('user-agent');

  const cookieProfileId = cookies().get(NINETAILED_ANONYMOUS_ID_COOKIE);

  const ninetailedApiClient = new NinetailedApiClient({
    clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || '',
    environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || '',
  });

  const pageEvent = buildPageEvent({
    ctx: {
      url: new URL(slug, 'https://b2b.demo.ninetailed.io').toString(),
      locale: 'en-US', // FIXME: Hardcoded
      referrer: referer || '',
      userAgent: userAgent || '',
    },
    messageId: uuid(),
    timestamp: Date.now(),
    properties: {},
    // TODO: Proxy over the user location in a location object
    // See Vercel middleware implementation on feature/vercel-edge-middleware branch
  });

  const { isEnabled } = draftMode();
  const [page, config, ninetailedResponse] = await Promise.all([
    getPage({
      preview: isEnabled,
      slug: pagePath,
    }),
    getGlobalConfig({ preview: isEnabled }),
    ninetailedApiClient.upsertProfile({
      profileId: process.env.DEMO_NINETAILED_ID, // TODO: Read profile ID from cookies. This is static right now for a demo
      events: [pageEvent],
    }),
  ]);

  if (!page) {
    return null;
  }

  setProfile(ninetailedResponse.profile);
  if (!cookieProfileId) {
    // TODO: Set profile ID into cookie. This could be done in a server action, route handler, or middleware
    // One of the latter two makes the most sense
  }
  setExperiences(ninetailedResponse.experiences);

  const { sections = [] } = page.fields;
  const { banner, navigation, footer } = config.fields;

  return (
    <>
      <RefreshRoute />
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

export async function generateStaticParams() {
  const pages = await getPages({ preview: false });
  const paths = pages
    .filter((page) => {
      return page.fields.slug !== '/';
    })
    .map((page) => {
      return {
        slug: page.fields.slug.split('/'),
      };
    });
  return [...paths, { slug: [''] }];
}

// TODO: Construct and export metadata from the page function rather than duplicate fetch call
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
