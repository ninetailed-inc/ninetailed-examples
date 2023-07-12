import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPages,
  getPage,
  getExperiments,
  getAllExperiences,
} from '@/lib/api';
import { IPage } from '@/types/contentful';

const Page = ({ page }: { page: IPage }) => {
  if (!page) {
    return null;
  }

  const { seo, banner, navigation, sections = [], footer } = page.fields;

  return (
    <>
      <NextSeo
        title={page.fields.seo?.fields.title}
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
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [page, experiments, allExperiences] = await Promise.all([
    getPage({
      preview: draftMode,
      slug: slug === '' ? '/' : slug,
    }),
    getExperiments({ preview: draftMode }),
    getAllExperiences(),
  ]);
  return {
    props: {
      page,
      ninetailed: {
        experiments: experiments,
        preview: {
          allExperiences,
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
