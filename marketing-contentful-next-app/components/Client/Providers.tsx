'use client';

import { ExperienceConfiguration } from '@ninetailed/experience.js-next';
import NinetailedGoogleTagmanagerPlugin from '@ninetailed/experience.js-plugin-google-tagmanager';
import NinetailedInsightsPlugin from '@ninetailed/experience.js-plugin-insights';
import NinetailedPreviewPlugin from '@ninetailed/experience.js-plugin-preview';
import { NinetailedProvider } from '@ninetailed/experience.js-react';

type Audience = {
  id: string;
  name: string;
  description?: string | undefined;
};

export default function Providers({
  ninetailed,
  children,
}: {
  ninetailed?: {
    preview: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
  children: React.ReactNode;
}) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || ''}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || ''}
      plugins={[
        new NinetailedInsightsPlugin(),
        new NinetailedGoogleTagmanagerPlugin(),
        new NinetailedPreviewPlugin({
          experiences: ninetailed?.preview.allExperiences || [],
          audiences: ninetailed?.preview.allAudiences || [],
          onOpenExperienceEditor: (experience) => {
            if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
              window.open(
                `https://app.contentful.com/spaces/${
                  process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                }/environments/${
                  process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
                }/entries/${experience.id}`,
                '_blank'
              );
            }
          },
          onOpenAudienceEditor: (audience) => {
            if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
              window.open(
                `https://app.contentful.com/spaces/${
                  process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                }/environments/${
                  process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
                }/entries/${audience.id}`,
                '_blank'
              );
            }
          },
        }),
      ]}
    >
      {children}
    </NinetailedProvider>
  );
}
