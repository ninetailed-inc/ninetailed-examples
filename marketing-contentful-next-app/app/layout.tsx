import React from 'react';
import '@/styles/globals.css';

import '@contentful/live-preview/style.css';
import Providers from '@/components/Client/Providers';
import TrackPage from '@/components/Client/TrackPage';
import { getAllAudiences, getAllExperiences } from '@/lib/api';
import { Favicon } from '@/components/Favicon';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allExperiences, allAudiences] = await Promise.all([
    getAllExperiences(),
    getAllAudiences(),
  ]);

  return (
    <html lang="en">
      <head>
        <Favicon />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <noscript>
            <iframe
              title="GTM"
              src={`https://www.googletagmanager.com/ns.html?id=${
                process.env.NEXT_PUBLIC_GTM_ID || ''
              }`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        ) : (
          ''
        )}
        <Providers ninetailed={{ preview: { allExperiences, allAudiences } }}>
          <TrackPage />
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
