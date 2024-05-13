import type { CustomPageProps } from '@/types/pageProps';
import type { NinetailedProviderProps } from '@ninetailed/experience.js-next';
import type { PropsWithChildren } from 'react';

import dynamic from 'next/dynamic';
import { NinetailedProvider } from '@ninetailed/experience.js-next';
import NinetailedGoogleTagmanagerPlugin from '@ninetailed/experience.js-plugin-google-tagmanager';
import NinetailedInsightsPlugin from '@ninetailed/experience.js-plugin-insights';
import NinetailedSegmentPlugin from '@ninetailed/experience.js-plugin-segment';

/**
 * Dynamic import of the preview plugin ensures it it not part of a production bundle
 */
export function getNinetailedProvider(pageProps: CustomPageProps) {
  const providerProps: NinetailedProviderProps = {
    clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || '',
    environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main',
    componentViewTrackingThreshold: 0,
    plugins: [
      new NinetailedInsightsPlugin(),
      ...(process.env.NEXT_PUBLIC_SEGMENT_ID
        ? [
            new NinetailedSegmentPlugin({
              template: {
                ninetailed_audience_name: '{{ audience.name }}',
              },
            }),
          ]
        : []),
      ...(process.env.NEXT_PUBLIC_GTM_ID
        ? [
            new NinetailedGoogleTagmanagerPlugin({
              template: {
                ninetailed_audience_name: '{{ audience.name }}',
              },
            }),
          ]
        : []),
    ],
  };

  if (!pageProps.ninetailed?.preview) {
    return function StandardNinetailedProvider({
      children,
    }: PropsWithChildren) {
      return (
        <NinetailedProvider {...providerProps}>{children}</NinetailedProvider>
      );
    };
  }

  return dynamic(() =>
    import('@ninetailed/experience.js-plugin-preview').then((mod) => {
      return function NinetailedProviderWithPreviewPlugin({
        children,
      }: PropsWithChildren) {
        providerProps.plugins = [
          new mod.NinetailedPreviewPlugin({
            experiences: pageProps.ninetailed?.preview?.allExperiences || [],
            audiences: pageProps.ninetailed?.preview?.allAudiences || [],
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
          ...(providerProps.plugins || []),
        ];

        console.log(providerProps);
        return (
          <NinetailedProvider {...providerProps}>{children}</NinetailedProvider>
        );
      };
    })
  );
}
