'use client';

import NinetailedGoogleTagmanagerPlugin from '@ninetailed/experience.js-plugin-google-tagmanager';
import NinetailedInsightsPlugin from '@ninetailed/experience.js-plugin-insights';
import { NinetailedProvider } from '@ninetailed/experience.js-react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || ''}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || ''}
      //TODO: Add SSR plugin: it directs the Insight plugin to look in cookies, not in localStorage, for the correct ID
      plugins={[
        new NinetailedGoogleTagmanagerPlugin(),
        new NinetailedInsightsPlugin(),
      ]}
    >
      {children}
    </NinetailedProvider>
  );
}
