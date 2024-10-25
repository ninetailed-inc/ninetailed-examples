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
import { TypePage } from '@/types/TypePage';
import { TypeConfig } from '../types';

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
  page: TypePage<'WITHOUT_UNRESOLVABLE_LINKS'>;
  config: TypeConfig<'WITHOUT_UNRESOLVABLE_LINKS'>;
  ninetailed?: {
    preview: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
}

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
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
          ...(pageProps.ninetailed?.preview
            ? [
                new NinetailedPreviewPlugin({
                  experiences:
                    pageProps.ninetailed?.preview.allExperiences || [],
                  audiences: pageProps.ninetailed?.preview.allAudiences || [],
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
        <SettingsProviderWrapper config={pageProps.config}>
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
