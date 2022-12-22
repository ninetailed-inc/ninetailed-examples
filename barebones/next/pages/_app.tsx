import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NinetailedProvider } from "@ninetailed/experience.js-next";
import { NinetailedPreviewPlugin } from "@ninetailed/experience.js-plugin-preview";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || ""}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || "main"}
      plugins={[
        NinetailedPreviewPlugin({
          clientId:
            process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_CLIENT_ID ?? "",
          secret: process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_SECRET ?? "",
          environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? "main",
          ui: { opener: { hide: false } },
        }),
      ]}
    >
      <Component {...pageProps} />
    </NinetailedProvider>
  );
}
