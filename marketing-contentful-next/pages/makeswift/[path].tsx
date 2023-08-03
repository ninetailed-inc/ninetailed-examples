import '@/lib/makeswift/register-components';

import { Makeswift } from '@makeswift/runtime/next';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import {
  Page as MakeswiftPage,
  PageProps as MakeswiftPageProps,
} from '@makeswift/runtime/next';
import {
  getAllAudiences,
  getAllExperiences,
  getExperiments,
  getGlobalConfig,
} from '@/lib/api';
import { ExperienceConfiguration } from '@ninetailed/experience.js-next';
import { IConfig } from '@/types/contentful';

type ParsedUrlQuery = { path?: string };

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<ParsedUrlQuery>
> {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY || '');
  const pages = await makeswift.getPages();
  console.log('pages', pages);
  const paths = pages.map((page) => {
    return {
      params: {
        path: page.path.replace('/makeswift/', ''),
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

type Audience = {
  name?: string | undefined;
  description?: string | undefined;
  id: string;
};

type Props = MakeswiftPageProps & {
  config: IConfig;
  ninetailed?: {
    experiments: ExperienceConfiguration[];
    preview: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
};

export async function getStaticProps(
  ctx: GetStaticPropsContext<ParsedUrlQuery>
): Promise<GetStaticPropsResult<Props>> {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY || '');
  const path = `makeswift/${ctx.params?.path || ''}`;
  const snapshot = await makeswift.getPageSnapshot(path, {
    preview: ctx.draftMode,
  });

  if (snapshot == null) return { notFound: true };

  const [config, experiments, allExperiences, allAudiences] = await Promise.all(
    [
      getGlobalConfig({ preview: ctx.draftMode }),
      getExperiments({ preview: ctx.draftMode }),
      getAllExperiences(),
      getAllAudiences(),
    ]
  );

  return {
    props: {
      snapshot,
      config,
      ninetailed: {
        experiments: experiments,
        preview: {
          allExperiences,
          allAudiences,
        },
      },
    },
  };
}

export default function Page({ snapshot }: Props) {
  return <MakeswiftPage snapshot={snapshot} />;
}
