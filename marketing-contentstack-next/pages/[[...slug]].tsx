import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getAllExperiments,
  getAllLandingPages,
  getLandingPage,
} from '@/lib/api';

import { onEntryChange } from '@/lib/api';

// For live preview
async function updateData(url: string) {
  const page = await getLandingPage(url);
  return {
    page,
  };
}

function Page({ page: pageData, ninetailed }) {
  // const [pageData, setPageData] = useState(page);

  const { url, banner, navigation, sections, footer } = pageData;

  // useEffect(() => {
  //   onEntryChange(async () => {
  //     const newData = await updateData(url);
  //     setPageData(newData.page);
  //   });
  // }, [url]);

  return (
    <>
      <NextSeo
        title={pageData.seo.meta_title}
        description={pageData.seo.meta_description}
        nofollow={!pageData.seo.enable_link_following as boolean}
        noindex={!pageData.seo.enable_search_indexing as boolean}
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
