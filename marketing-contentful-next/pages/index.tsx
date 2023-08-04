import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPage,
  getExperiments,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
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

export const getStaticProps: GetStaticProps = async ({ draftMode }) => {
  const [page, config, experiments, allExperiences, allAudiences] =
    await Promise.all([
      getPage({
        preview: draftMode,
        slug: '/',
      }),
      getGlobalConfig({ preview: draftMode }),
      getExperiments({ preview: draftMode }),
      getAllExperiences(),
      getAllAudiences(),
    ]);
  return {
    props: {
      page,
      config,
      ninetailed: {
        experiments: experiments,
        preview: {
          allExperiences,
          allAudiences,
        },
      },
    },
    revalidate: 5,
  };
};

export default Page;
