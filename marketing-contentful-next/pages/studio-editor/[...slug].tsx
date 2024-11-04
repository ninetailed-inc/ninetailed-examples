import { GetStaticPaths, GetStaticProps } from 'next';
import get from 'lodash/get';

import {
  getAllExperiences,
  getAllAudiences,
  getFlexibleSection,
  getFlexibleSections,
} from '@/lib/api';

import { FlexibleSection } from '@/components/Studio';

const StudioExperience = ({ flexibleSection }: { flexibleSection: string }) => {
  if (!flexibleSection) {
    return null;
  }

  return <FlexibleSection fields={{ studio: flexibleSection }} />;
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [flexibleSection, allExperiences, allAudiences] = await Promise.all([
    getFlexibleSection({
      preview: true,
      slug,
    }),
    getAllExperiences({ preview: draftMode }),
    getAllAudiences({ preview: draftMode }),
  ]);

  return {
    props: {
      flexibleSection: JSON.stringify(flexibleSection),
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
  const studioExperiences = await getFlexibleSections({ preview: false });

  const paths = studioExperiences
    .filter((studioExperience) => {
      return studioExperience.fields.slug !== '/';
    })
    .map((studioExperience) => {
      return {
        params: { slug: studioExperience.fields.slug.split('/') },
      };
    });

  return {
    paths: paths,
    fallback: false,
  };
};

export default StudioExperience;
