import { draftMode } from 'next/headers';

import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { getPages, getPage, getGlobalConfig } from '@/lib/api';

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: { slug: string[] | undefined };
}) {
  const { isEnabled } = draftMode();
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [page, config] = await Promise.all([
    getPage({
      preview: isEnabled,
      slug: slug === '' ? '/' : slug,
    }),
    getGlobalConfig({ preview: isEnabled }),
  ]);

  if (!page) {
    return null;
  }

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
