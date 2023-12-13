// This takes the Vue plugin and does two things:
// 1. Loads Ninetailed client-side only due to this file's suffix
// 2. Tracks each page view by watching the route
// Because this Nuxt plugin is only client-side, you may want to ensure:
// 1. That you only access injected values (`ninetailed` and `profile`) in process.client to prevent missing injections warning
// 2. To only render injected values in <ClientOnly> components to prevent hydration mismatch warnings
// Not doing so will result in warnings, but everything will still function so long as you handle undefined cases on the server

import { defineNuxtPlugin } from "nuxt/app";
import { VueNinetailed, NinetailedKey } from "../vuePlugins/ninetailed";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  nuxtApp.vueApp.use(VueNinetailed, {
    clientId: config.public.ninetailedClientId,
    environment: config.public.ninetailedEnvironment,
  });

  const ninetailedInstance = inject(NinetailedKey);

  if (ninetailedInstance) {
    const { page } = ninetailedInstance;
    watch(
      () => route.fullPath,
      () => {
        page();
      },
      { immediate: true }
    );
  }
});
