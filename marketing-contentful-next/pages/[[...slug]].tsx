import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';
import { useRouter } from 'next/router';

import { BlockRenderer } from '@/components/Renderer';
import {
  getPages,
  getPage,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
  getRedirect,
} from '@/lib/api';
import { IConfig, IPage, IRedirect } from '@/types/contentful';
import { parseExperiences } from '@/lib/experiences';
import { Experience } from '@ninetailed/experience.js-next';
import { useEffect } from 'react';

const Redirect = (redirect: IRedirect) => {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(router.asPath, 'https://example.com');

    if (
      redirect.fields.from !== redirect.fields.to &&
      url.pathname === redirect.fields.from
    ) {
      void router.replace(redirect.fields.to);
    }
  }, [router, redirect]);

  return null;
};

const RedirectExperience: React.FC<{ redirect: IRedirect }> = ({
  redirect,
}) => {
  const parsedExperiences = parseExperiences(redirect);

  return (
    <Experience
      {...redirect}
      id={redirect.sys.id}
      experiences={parsedExperiences}
      component={Redirect}
    />
  );
};

const Page = ({
  page,
  redirect,
  config,
}: {
  page: IPage;
  redirect: IRedirect | null;
  config: IConfig;
}) => {
  if (!page) {
    return null;
  }

  const { seo, sections = [] } = page.fields;
  const { banner, navigation, footer } = config.fields;

  return (
    <>
      {redirect && <RedirectExperience redirect={redirect} />}
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
  const [page, redirect, config, allExperiences, allAudiences] =
    await Promise.all([
      getPage({
        preview: draftMode,
        slug: slug === '' ? '/' : slug,
      }),
      getRedirect({ preview: draftMode, slug: slug === '' ? '/' : slug }),
      getGlobalConfig({ preview: draftMode }),
      getAllExperiences(),
      getAllAudiences(),
    ]);
  return {
    props: {
      page,
      redirect,
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
