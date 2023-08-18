import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import Script from 'next/script';
import {
  Experience,
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedGoogleTagmanagerPlugin } from '@ninetailed/experience.js-plugin-google-tagmanager';
import { IConfig, IPage } from '@/types/contentful';

import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import '@contentful/live-preview/style.css';
import SettingsProviderWrapper from '@/lib/SettingsProvider';
import Style from '@/components/Style/Style';
import { parseExperiences } from '@/lib/experiences';

import { NinetailedRudderstackPlugin } from '@/plugins/rudderstack';
import { rudderInitialize } from '@/lib/rudderInitialize';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

// FIXME: Re-export this type from utils-contentful
type Audience = {
  name?: string | undefined;
  description?: string | undefined;
  id: string;
};
interface CustomPageProps {
  page: IPage;
  config: IConfig;
  ninetailed?: {
    experiments: ExperienceConfiguration[];
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
          new NinetailedGoogleTagmanagerPlugin(),
          new NinetailedRudderstackPlugin(),
          new NinetailedPreviewPlugin({
            experiences: pageProps.ninetailed?.preview.allExperiences || [],
            audiences: pageProps.ninetailed?.preview.allAudiences || [],
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
          }),
        ]}
        clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
        environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
        experiments={pageProps.ninetailed?.experiments || []}
      >
        <SettingsProviderWrapper config={pageProps.config}>
          <ContentfulLivePreviewProvider locale="en-US">
            {pageProps.config &&
              pageProps.config.fields.styles?.length &&
              pageProps.config.fields.styles.map((styleEntry) => {
                return (
                  <Experience
                    key={styleEntry.sys.id}
                    id={styleEntry.sys.id}
                    {...styleEntry}
                    component={Style}
                    experiences={parseExperiences(styleEntry || [])}
                  />
                );
              })}

            <Script
              id="gtm-base"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${
    process.env.NEXT_PUBLIC_GTM_ID || ''
  }');`,
              }}
            />
            <Script
              id="rudderstack"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `!function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId","getUserId","getUserTraits","getGroupId","getGroupTraits","startSession","endSession"],e.factory=function(t){return function(){e.push([t].concat(Array.prototype.slice.call(arguments)))}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
                e.load("${process.env.NEXT_PUBLIC_RUDDERSTACK_ID || ''}","${
                  process.env.NEXT_PUBLIC_DATAPLANE_URL || ''
                }"),
                e.page()}();`,
              }}
            />
            <Component {...pageProps} />
          </ContentfulLivePreviewProvider>
        </SettingsProviderWrapper>
      </NinetailedProvider>
    </div>
  );
};

export default B2BDemoApp;
