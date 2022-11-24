import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NinetailedProvider } from "@ninetailed/experience.js-next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || ""}
    >
      <Component {...pageProps} />
    </NinetailedProvider>
  );
}
