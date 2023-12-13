// This plugin globally registers any components whose corresponding content types are experimentable and personalizable
// We need this because of the polymorphism of Experience.vue and the way in which Vue resolves components
// We cannot pass Vue components as functions in their entirety to children, as we might do in React; Vue wants explicit import and registration
// We won't know ahead of time **exactly** what components Experience.vue might need, so we make any possibly used components global
// Likely, this is already being done in customer implemenations using polymorphic content models
// TODO: Investigate if a <slot> implementation could work

import Hero from "~/components/Hero.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Hero", Hero);
});
