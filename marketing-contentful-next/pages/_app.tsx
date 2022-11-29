import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import {
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { HubspotProvider } from '@aaronhayes/react-use-hubspot-form';
import { IPage } from '@/types/contentful';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

interface CustomPageProps {
  page: IPage;
  ninetailed?: {
    experiments: ExperienceConfiguration[];
  };
}

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return (
    <div className="app">
      <HubspotProvider>
        <NinetailedProvider
          preview
          plugins={[
            NinetailedPreviewPlugin({
              clientId:
                process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_CLIENT_ID ?? '',
              secret:
                process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_SECRET ?? '',
              environment:
                process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main',
            }),
          ]}
          clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
          environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
          experiments={pageProps.ninetailed?.experiments || []}
        >
          <Component {...pageProps} />
        </NinetailedProvider>
      </HubspotProvider>
    </div>
  );
};

export default B2BDemoApp;
