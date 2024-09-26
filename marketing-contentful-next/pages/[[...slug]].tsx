import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import superjson from 'superjson';

import { useContentfulLiveUpdates } from '@contentful/live-preview/react';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPages,
  getPage,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
} from '@/lib/api';
import { TypePageWithoutUnresolvableLinksResponse } from '@/types/TypePage';
import { TypeConfigWithoutUnresolvableLinksResponse } from '@/types/TypeConfig';

const Page = ({
  page: safePage,
  config: safeConfig,
}: {
  page: string;
  config: string;
}) => {
  const initialPage =
    superjson.parse<TypePageWithoutUnresolvableLinksResponse>(safePage);
  const initialConfig =
    superjson.parse<TypeConfigWithoutUnresolvableLinksResponse>(safeConfig);

  const page = useContentfulLiveUpdates(initialPage);
  const config = useContentfulLiveUpdates(initialConfig);

  if (!page) {
    return null;
  }

  const { seo, sections = [] } = page.fields;
  const { banner, navigation, footer } = config.fields;

  return (
    <>
      <NextSeo
        title={seo?.fields.title}
        description={seo?.fields.description}
        nofollow={seo?.fields.no_follow as boolean}
        noindex={seo?.fields.no_index as boolean}
      />
      <div className="w-full h-full flex flex-col">
        {banner && <BlockRenderer block={banner} />}
        {navigation && <BlockRenderer block={navigation} />}
        <main className="grow">
          <BlockRenderer block={sections} />
        </main>
        {footer && <BlockRenderer block={footer} />}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [page, config, allExperiences, allAudiences] = await Promise.all([
    getPage({
      preview: draftMode,
      slug: slug === '' ? '/' : slug,
    }),
    getGlobalConfig({ preview: draftMode }),
    getAllExperiences({ preview: draftMode }),
    getAllAudiences({ preview: draftMode }),
  ]);
  return {
    props: {
      page: superjson.stringify(page),
      config: superjson.stringify(config),
      ninetailed: {
        preview: {
          allExperiences: superjson.stringify(allExperiences),
          allAudiences: superjson.stringify(allAudiences),
        },
      },
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getPages({ preview: false });

  const paths = pages
    .filter((page) => {
      return page.fields.slug !== '/';
    })
    .map((page) => {
      return {
        params: { slug: page.fields.slug.split('/') },
      };
    });
  return {
    paths: [...paths, { params: { slug: [''] } }],
    fallback: false,
  };
};

export default Page;
