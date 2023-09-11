import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import Script from 'next/script';
import {
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedGoogleTagmanagerPlugin } from '@ninetailed/experience.js-plugin-google-tagmanager';
import { LandingPage as ILandingPage } from '@/types/contentstack';
import '@contentstack/live-preview-utils/dist/main.css';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

// FIXME: Re-export this type from utils
type Audience = {
  name?: string | undefined;
  description?: string | undefined;
  id: string;
};
interface CustomPageProps {
  page: ILandingPage;
  ninetailed?: {
    experiments: ExperienceConfiguration[];
    preview: {
      experiences: ExperienceConfiguration[];
      audiences: Audience;
    };
  };
}

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return (
    <div className="app">
      <NinetailedProvider
        preview
        plugins={[
          new NinetailedGoogleTagmanagerPlugin({
            template: {
              ninetailed_audience_name: '{{ audience.name }}',
            },
          }),
          new NinetailedPreviewPlugin({
            // TODO: Pull draft experiences and audiences from Management API
            experiences: pageProps.ninetailed?.preview.experiences || [],
            audiences:
              pageProps.ninetailed?.preview.experiences
                .map((experience) => experience.audience)
                .filter(
                  (
                    audience
                  ): audience is {
                    id: string;
                    name?: string | undefined;
                    description: string | undefined;
                  } => !!audience
                ) || [],
          }),
        ]}
        clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
        environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
        experiments={pageProps.ninetailed?.experiments || []}
        maximumActiveExperiments={10}
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
    </div>
  );
};

export default B2BDemoApp;
