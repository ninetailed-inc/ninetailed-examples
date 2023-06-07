import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getAllExperiences,
  getAllExperiments,
  getAllLandingPages,
  getLandingPage,
} from '@/lib/api';
import { ILandingPage } from '@/types/contentstack';

function Page({ page: pageData }: { page: ILandingPage }) {
  const { seo, banner, navigation, sections, footer } = pageData;

  return (
    <>
      <NextSeo
        title={seo?.meta_title}
        description={seo?.meta_description}
        nofollow={!seo?.enable_link_following || true}
        noindex={!seo?.enable_search_indexing || true}
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = '/' + rawSlug.join('/');
  const [page, experiments, experiences] = await Promise.all([
    getLandingPage(slug),
    getAllExperiments(),
    getAllExperiences(),
  ]);

  return {
    props: {
      page,
      ninetailed: {
        experiments,
        preview: {
          experiences,
        },
      },
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllLandingPages();

  const paths = pages
    .filter((page: any) => {
      return page.url !== '/';
    })
    .map((page: any) => {
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
