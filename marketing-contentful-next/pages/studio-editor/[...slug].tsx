import type { GetServerSideProps } from 'next';
import get from 'lodash/get';

import {
  // getAllExperiences,
  // getAllAudiences,
  getFlexibleSection
} from '@/lib/api';

import { FlexibleSection } from '@/components/Studio';

const StudioExperience = ({ flexibleSection }: { flexibleSection: string }) => {
  if (!flexibleSection) {
    return null;
  }

  return <FlexibleSection fields={{ studio: flexibleSection }} />;
};

export const getServerSideProps = (async ({ params }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  // Purposely remove preview widget from Studio canvas
  // Rely on it's presence when viewing the whole page
  // const [flexibleSection, allExperiences, allAudiences] = await Promise.all([
  const [flexibleSection] = await Promise.all([
    getFlexibleSection({
      preview: true,
      slug,
    }),
    // getAllExperiences({ preview: true }),
    // getAllAudiences({ preview: true }),
  ]);

  return {
    props: {
      flexibleSection: JSON.stringify(flexibleSection),
      // ninetailed: {
      //   preview: {
      //     allExperiences,
      //     allAudiences,
      //   },
      // },
    },
  };
}) satisfies GetServerSideProps

export default StudioExperience;
