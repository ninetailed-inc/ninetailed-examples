import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import Script from 'next/script';
import {
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPrivacyPlugin } from '@ninetailed/experience.js-plugin-privacy';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedGoogleTagmanagerPlugin } from '@ninetailed/experience.js-plugin-google-tagmanager';
import { HubspotProvider } from '@aaronhayes/react-use-hubspot-form';
import { IPage } from '@/types/contentful';

// Live preview
import '@contentful/live-preview/style.css';
import { ContentfulLivePreview } from '@contentful/live-preview';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

interface CustomPageProps {
  page: IPage;
  ninetailed?: {
    experiments: ExperienceConfiguration[];
    preview: {
      allExperiences: ExperienceConfiguration[];
    };
  };
}

// eslint-disable-next-line
ContentfulLivePreview.init();

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return (
    <div className="app">
      <HubspotProvider>
        <NinetailedProvider
          preview
          plugins={[
            new NinetailedGoogleTagmanagerPlugin(),
            new NinetailedPreviewPlugin({
              experiences: pageProps.ninetailed?.preview.allExperiences || [],
            }),
          ]}
          clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
          environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
          experiments={pageProps.ninetailed?.experiments || []}
        >
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
          <Component {...pageProps} />
        </NinetailedProvider>
      </HubspotProvider>
    </div>
  );
};

export default B2BDemoApp;
