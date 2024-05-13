import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import Script from 'next/script';
import {
  Experience,
  ExperienceConfiguration,
} from '@ninetailed/experience.js-next';
import { IConfig, IPage } from '@/types/contentful';

import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import '@contentful/live-preview/style.css';
import SettingsProviderWrapper from '@/lib/SettingsProvider';
import Style from '@/components/Style/Style';
import { parseExperiences } from '@/lib/experiences';
import { getNinetailedProvider } from '@/lib/getNinetailedProvider';

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
  page: IPage;
  config: IConfig;
  ninetailed?: {
    preview?: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
}

const B2BDemoApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  const NinetailedProvider = getNinetailedProvider(pageProps);

  return (
    <div className="app">
      <NinetailedProvider>
        <SettingsProviderWrapper config={pageProps.config}>
          <ContentfulLivePreviewProvider locale="en-US">
            {/* Injected style example*/}
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
            {process.env.NEXT_PUBLIC_GTM_ID ? (
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
            ) : (
              ''
            )}
            {process.env.NEXT_PUBLIC_SEGMENT_ID ? (
              <Script
                id="segment"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `!function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${process.env.NEXT_PUBLIC_SEGMENT_ID}";;analytics.SNIPPET_VERSION="5.2.0";
                  analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_ID}");
                  analytics.page();
                  }}();`,
                }}
              />
            ) : (
              ''
            )}
            <Component {...pageProps} />
          </ContentfulLivePreviewProvider>
        </SettingsProviderWrapper>
      </NinetailedProvider>
    </div>
  );
};

export default B2BDemoApp;
