import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { Compressed, compress, decompress } from 'compress-json';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPages,
  getPage,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
} from '@/lib/api';
import { IPage } from '@/types/contentful';

const Page = ({ compressedPage }: { compressedPage: Compressed }) => {
  if (!compressedPage) {
    return null;
  }

  const page = decompress(compressedPage) as IPage;

  const { seo, banner, navigation, sections = [], footer } = page.fields;

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
    getAllExperiences(),
    getAllAudiences(),
  ]);

  // Reducing static build size with compressed payload
  const compressedPage = compress(page);

  return {
    props: {
      compressedPage,
      config,
      ninetailed: {
        preview: {
          allExperiences,
          allAudiences,
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
