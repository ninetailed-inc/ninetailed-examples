'use client';

import NinetailedGoogleTagmanagerPlugin from '@ninetailed/experience.js-plugin-google-tagmanager';
import NinetailedInsightsPlugin from '@ninetailed/experience.js-plugin-insights';
import NinetailedSsrPlugin from '@ninetailed/experience.js-plugin-ssr';
import { NinetailedProvider } from '@ninetailed/experience.js-react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || ''}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || ''}
      plugins={[
        new NinetailedGoogleTagmanagerPlugin(),
        new NinetailedInsightsPlugin(),
        // SSR plugin directs the Insight plugin to look in cookies, not in localStorage, for the correct ID
        new NinetailedSsrPlugin(),
      ]}
    >
      {children}
    </NinetailedProvider>
  );
}
