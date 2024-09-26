import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import {
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedGoogleTagmanagerPlugin } from '@ninetailed/experience.js-plugin-google-tagmanager';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import SettingsProviderWrapper from '@/lib/SettingsProvider';
import NinetailedSegmentPlugin from '@ninetailed/experience.js-plugin-segment';
import { ThirdPartyScripts } from '@/components/ThirdPartyScripts';
import { TypeConfig } from '../types';

import superjson from 'superjson';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

// FIXME: Re-export this type from utils-contentful
type Audience = {
  name: string;
  description?: string | undefined;
  id: string;
};

interface CustomPageProps {
  config: string;
  ninetailed: {
    preview: {
      allExperiences: string;
      allAudiences: string;
    };
  };
}

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  const {
    config: safeConfig,
    ninetailed: {
      preview: {
        allExperiences: safeAllExperiences,
        allAudiences: safeAllAudiences,
      },
    },
  } = pageProps;

  const config =
    superjson.parse<TypeConfig<'WITHOUT_UNRESOLVABLE_LINKS'>>(safeConfig);
  const allExperiences =
    superjson.parse<ExperienceConfiguration[]>(safeAllExperiences);
  const allAudiences = superjson.parse<Audience[]>(safeAllAudiences);

  return (
    <div className="app">
      <NinetailedProvider
        plugins={[
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
          ...(allAudiences && allExperiences
            ? [
                new NinetailedPreviewPlugin({
                  experiences: allExperiences || [],
                  audiences: allAudiences || [],
                  onOpenExperienceEditor: (experience) => {
                    if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
                      window.open(
                        `https://app.contentful.com/spaces/${
                          process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                        }/environments/${
                          process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ||
                          'master'
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
                          process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ||
                          'master'
                        }/entries/${audience.id}`,
                        '_blank'
                      );
                    }
                  },
                }),
              ]
            : []),
        ]}
        clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
        environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
        componentViewTrackingThreshold={0} // Default = 2000
      >
        <SettingsProviderWrapper config={config}>
          <ContentfulLivePreviewProvider locale="en-US">
            <ThirdPartyScripts />
            <Component {...pageProps} />
          </ContentfulLivePreviewProvider>
        </SettingsProviderWrapper>
      </NinetailedProvider>
    </div>
  );
};

export default B2BDemoApp;
