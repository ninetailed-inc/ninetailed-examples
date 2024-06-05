// This takes the Vue plugin and does two things:
// 1. Loads Ninetailed client-side only due to this file's suffix
// 2. Tracks each page view by watching the route
// Because this Nuxt plugin is only client-side, you may want to ensure:
// 1. That you only access injected values (`ninetailed` and `profile`) in process.client to prevent missing injections warning
// 2. To only render injected values in <ClientOnly> components to prevent hydration mismatch warnings
// Not doing so will result in warnings, but everything will still function so long as you handle undefined cases on the server

import { defineNuxtPlugin } from "nuxt/app";
import { VueNinetailed, NinetailedKey } from "../vuePlugins/ninetailed";
import { NinetailedGoogleTagmanagerPlugin } from "@ninetailed/experience.js-plugin-google-tagmanager";
import { NinetailedInsightsPlugin } from "@ninetailed/experience.js-plugin-insights";
// import { NinetailedPreviewPlugin } from "@ninetailed/experience.js-plugin-preview";

import {
  ExperienceMapper,
  type ExperienceEntryLike,
  type AudienceEntryLike,
  AudienceMapper,
} from "@ninetailed/experience.js-utils-contentful";

export default defineNuxtPlugin({
  name: "ninetailed",
  async setup(nuxtApp) {
    const config = useRuntimeConfig();

    const { $contentfulClient } = useNuxtApp();

    const experienceData = await $contentfulClient.getEntries({
      content_type: "nt_experience",
      include: 1,
    });

    const experiences = experienceData.items as ExperienceEntryLike[];

    const mappedExperiences = (experiences || [])
      .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
      .map((entry) => ExperienceMapper.mapExperience(entry));

    const audienceData = await $contentfulClient.getEntries({
      content_type: "nt_audience",
      include: 1,
    });

    const audiences = audienceData.items as AudienceEntryLike[];

    const mappedAudiences = (audiences || [])
      .filter((entry) => AudienceMapper.isAudienceEntry(entry))
      .map((entry) => AudienceMapper.mapAudience(entry));

    nuxtApp.vueApp.use(VueNinetailed, {
      clientId: config.public.ninetailedClientId,
      environment: config.public.ninetailedEnvironment,
      plugins: [
        new NinetailedGoogleTagmanagerPlugin(),
        new NinetailedInsightsPlugin(),
        // FIXME: This throws
        // Good: I can get and map the Ninetailed CMS data
        // Bad: The preview plugin doesn't like the iframe bridge?
        // new NinetailedPreviewPlugin({
        //   experiences: [],
        //   audiences: [],
        // }),
      ],
    });
  },
});
