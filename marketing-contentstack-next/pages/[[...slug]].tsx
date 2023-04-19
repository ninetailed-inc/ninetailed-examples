import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getAllExperiments,
  getAllLandingPages,
  getLandingPage,
} from '@/lib/api';
import { PAGE_CONTENT_TYPES } from '@/lib/constants';

function Page({ slug, page, ninetailed }) {
  const { banner, navigation, sections, footer } = page;

  return (
    <>
      {/* <h1>Howdy! You hit the {slug} page.</h1>
      <pre>{JSON.stringify(page, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(ninetailed.experiments, null, 2)}</pre> */}
      <NextSeo
        title={page.seo.meta_title}
        description={page.seo.meta_description}
        nofollow={!page.seo.enable_link_following as boolean}
        noindex={!page.seo.enable_search_indexing as boolean}
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
}

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = '/' + rawSlug.join('/');
  const [page, experiments] = await Promise.all([
    getLandingPage(slug),
    getAllExperiments(),
  ]);

  return {
    props: {
      slug,
      page,
      ninetailed: { experiments },
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllLandingPages();

  const paths = pages
    .filter((page) => {
      return page.url !== '/';
    })
    .map((page) => {
      return {
        params: { slug: page.url.replace(/^\/+/g, '').split('/') },
      };
    });

  return {
    paths: [...paths, { params: { slug: [''] } }],
    fallback: false,
  };
};

export default Page;
