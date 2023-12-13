// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  generate: {
    routes: ["/", "/pricing"],
  },
  image: {
    contentful: {},
  },
  modules: ["@nuxt/image"],
  routeRules: {
    // Demo purposes only!
    "/**": { swr: 5 },
  },
  runtimeConfig: {
    public: {
      ninetailedClientId: "",
      ninetailedEnvironment: "",
      contentfulSpaceId: "",
      contentfulEnvironment: "",
      contentfulDeliveryToken: "",
    },
    contentfulPreviewToken: "",
  },
  ssr: false, // TODO: Show SSG. For some reason, useAsyncData is holding onto fetched page data on route change?
});
