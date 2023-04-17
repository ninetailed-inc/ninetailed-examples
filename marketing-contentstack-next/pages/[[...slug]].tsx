import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPagesOfType,
  getPage,
  getExperiments,
  getAllLandingPages,
  getLandingPage,
} from '@/lib/api';
import { PAGE_CONTENT_TYPES } from '@/lib/constants';
import { IPage } from '@/types/contentful';

function Page(props) {
  return (
    <>
      <h1>Howdy! You hit the {props.slug} page.</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      {/* <NextSeo
        title={page.fields.seo?.fields.title || page.fields.title}
        description={page.fields.seo?.fields.description}
        nofollow={page.fields.seo?.fields.no_follow as boolean}
        noindex={page.fields.seo?.fields.no_index as boolean}
      />
      <div className="w-full h-full flex flex-col">
        {banner && <BlockRenderer block={banner} />}
        {navigation && <BlockRenderer block={navigation} />}
        <main className="grow">
          <BlockRenderer block={sections} />
        </main>
        {footer && <BlockRenderer block={footer} />}
      </div> */}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = '/' + rawSlug.join('/');
  const page = await getLandingPage(slug);
  // TODO: Get Experiments
  //   getPage({
  //     preview,
  //     slug: slug === '' ? '/' : slug,
  //     pageContentType: PAGE_CONTENT_TYPES.PAGE,
  //     childPageContentType: PAGE_CONTENT_TYPES.LANDING_PAGE,
  //   }),
  //   getExperiments(),
  // ]);
  return {
    props: {
      slug,
      page,
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

  // TODO: Make dynamic by fetching from CMS
  return {
    paths: [...paths, { params: { slug: [''] } }],
    fallback: false,
  };
};

export default Page;
