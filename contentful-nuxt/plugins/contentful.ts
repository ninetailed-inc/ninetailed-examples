import contentful, { createClient } from "contentful";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // TODO: Expand with preview client toggle
  const createClientFunc =
    process.env.NODE_ENV === "development"
      ? createClient
      : contentful.createClient;
  const client = createClientFunc({
    space: config.public.contentfulSpaceId,
    accessToken: config.public.contentfulDeliveryToken,
    environment: config.public.contentfulEnvironment,
  });

  nuxtApp.provide("contentfulClient", client);
});
