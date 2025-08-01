import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createGtm } from '@gtm-support/vue-gtm'

import { VueNinetailed } from './plugins/ninetailed'
import { VueContentful } from './plugins/contentful'
import NinetailedPreviewPlugin from '@ninetailed/experience.js-plugin-preview'
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights'
import { NinetailedGoogleTagmanagerPlugin } from '@ninetailed/experience.js-plugin-google-tagmanager'

import {
  ExperienceMapper,
  type ExperienceEntryLike,
  type AudienceEntryLike,
  AudienceMapper
} from '@ninetailed/experience.js-utils-contentful'
import { contentfulClient } from './lib/contentfulClient'

import Hero from '@/components/Hero.vue'

const app = createApp(App)

app.use(router)

app.use(
  // @ts-ignore
  createGtm({
    id: import.meta.env.VITE_GTM_ID,
    // @ts-ignore
    vueRouter: router
  })
)

app.use(VueContentful, {
  client: contentfulClient
})

const experienceData = await contentfulClient.getEntries({
  content_type: 'nt_experience',
  include: 1
})

// TODO: rectify entry types between Contentful & experience.js SDKs
const experiences = experienceData.items as unknown as ExperienceEntryLike[]

const mappedExperiences = (experiences || [])
  .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
  .map((entry) => ExperienceMapper.mapExperience(entry))

const audienceData = await contentfulClient.getEntries({
  content_type: 'nt_audience',
  include: 1
})

// TODO: rectify entry types between Contentful & experience.js SDKs
const audiences = audienceData.items as unknown as AudienceEntryLike[]

const mappedAudiences = (audiences || [])
  .filter((entry) => AudienceMapper.isAudienceEntry(entry))
  .map((entry) => AudienceMapper.mapAudience(entry))

// @ts-ignore
app.use(VueNinetailed, {
  clientId: import.meta.env.VITE_NINETAILED_CLIENT_ID,
  environment: import.meta.env.VITE_NINETAILED_ENV,
  plugins: [
    new NinetailedPreviewPlugin({
      experiences: mappedExperiences,
      // @ts-ignore
      audiences: mappedAudiences
    }),
    new NinetailedInsightsPlugin(),
    new NinetailedGoogleTagmanagerPlugin()
  ]
})

// Globally registers components whose corresponding content types are experimentable and personalizable
// We need this because of the polymorphism of Experience.vue and the way in which Vue resolves components
// We cannot pass Vue components as functions in their entirety to children, as we might do in React; Vue wants explicit import and registration
// We won't know ahead of time **exactly** what components Experience.vue might need, so we make any possibly used components global
// Likely, this is already being done in customer implementations using polymorphic content models

// eslint-disable-next-line
app.component('Hero', Hero)

app.mount('#app')
