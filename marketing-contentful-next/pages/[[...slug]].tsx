import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { JSDOM } from 'jsdom';

import { BlockRenderer } from '@/components/Renderer';
import {
  // getPages,
  getPage,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
  getRedirect,
  sendNinetailedPreflightRequest,
  sendNinetailedPageview,
  ninetailedInstance,
} from '@/lib/api';
import { IConfig, IPage, IRedirect } from '@/types/contentful';
import { parseExperiences } from '@/lib/experiences';
import { Experience, Profile } from '@ninetailed/experience.js-next';
import { createElement, useEffect } from 'react';
import { Ninetailed } from '@ninetailed/experience.js';

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
      {/* this is still needed cause of client side navigation */}
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

const handleRedirect = (
  redirect: IRedirect | null,
  slug: string,
  profileExperiences?: { experienceId: string; variantIndex: number }[]
) => {
  if (!redirect || !profileExperiences || profileExperiences.length === 0) {
    return null;
  }

  console.log('redirect', redirect);

  const url = new URL(slug, 'https://example.com');
  const parsedRedirectExperiences = parseExperiences(redirect);

  if (parsedRedirectExperiences.length === 0) {
    return null;
  }

  const experience = parsedRedirectExperiences.find((experience) =>
    profileExperiences.some(
      (profileExperience) => profileExperience.experienceId === experience.id
    )
  );

  if (!experience) {
    return null;
  }

  const selectedProfileExperience = profileExperiences.find(
    (profileExperience) => profileExperience.experienceId === experience.id
  );

  if (!selectedProfileExperience) {
    return null;
  }

  const variants = [
    experience.components[0].baseline,
    ...experience.components[0].variants,
  ];

  if (variants.length === 0) {
    return null;
  }

  const variant = variants[
    selectedProfileExperience.variantIndex
  ] as unknown as IRedirect;

  if (!variant) {
    return null;
  }

  // in this case we're in the baseline
  if (!variant.fields.from || !variant.fields.to) {
    return null;
  }

  const shouldRedirect =
    variant.fields.from !== variant.fields.to &&
    url.pathname === variant.fields.from;

  if (!shouldRedirect) {
    return null;
  }

  return {
    redirect: {
      destination: variant.fields.to,
      permanent: false,
    },
    experience,
    variant,
    variantIndex: selectedProfileExperience.variantIndex,
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params, preview } = context;

  // const acceptHeaders = context.req.headers.accept || '';
  // const isPageRequest = acceptHeaders.includes('text/html');

  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [
    page,
    redirect,
    config,
    allExperiences,
    allAudiences,
    ninetailedProfile,
  ] = await Promise.all([
    getPage({
      preview,
      slug: slug === '' ? '/' : slug,
    }),
    getRedirect({ preview, slug: slug === '' ? '/' : slug }),
    getGlobalConfig({ preview }),
    getAllExperiences(),
    getAllAudiences(),
    sendNinetailedPreflightRequest({
      ctx: context,
    }),
  ]);

  const redirectObj = handleRedirect(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    redirect,
    slug,
    ninetailedProfile?.experiences
  );

  if (redirectObj) {
    const { document } = new JSDOM(``, {}).window;

    await Promise.all([
      ninetailedInstance.trackComponentView({
        experience: redirectObj.experience,
        element: document.createElement('div'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        variant: redirectObj.variant,
        variantIndex: redirectObj.variantIndex,
      }),
      // This could be done in a backgeound process, need to check how this works in nextjs
      sendNinetailedPageview({ ctx: context }),
    ]);

    return {
      redirect: redirectObj.redirect,
    };
  }

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
  };
};

// export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
//   const rawSlug = get(params, 'slug', []) as string[];
//   const slug = rawSlug.join('/');
//   const [page, redirect, config, allExperiences, allAudiences] =
//     await Promise.all([
//       getPage({
//         preview: draftMode,
//         slug: slug === '' ? '/' : slug,
//       }),
//       getRedirect({ preview: draftMode, slug: slug === '' ? '/' : slug }),
//       getGlobalConfig({ preview: draftMode }),
//       getAllExperiences(),
//       getAllAudiences(),
//     ]);
//   return {
//     props: {
//       page,
//       redirect,
//       config,
//       ninetailed: {
//         preview: {
//           allExperiences,
//           allAudiences,
//         },
//       },
//     },
//     revalidate: 5,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const pages = await getPages({ preview: false });

//   const paths = pages
//     .filter((page) => {
//       return page.fields.slug !== '/';
//     })
//     .map((page) => {
//       return {
//         params: { slug: page.fields.slug.split('/') },
//       };
//     });
//   return {
//     paths: [...paths, { params: { slug: [''] } }],
//     fallback: false,
//   };
// };

export default Page;
