// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  //TODO: Dynamic generation
  generate: {
    routes: ["/", "/pricing"],
  },
  image: {
    contentful: {},
  },
  modules: ["@nuxt/image"],
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
});
