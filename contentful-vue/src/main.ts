import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { VueNinetailed } from './plugins/ninetailed'
import { VueContentful } from './plugins/contentful'
import NinetailedPreviewPlugin from '@ninetailed/experience.js-plugin-preview'
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

app.use(VueContentful, {
  client: contentfulClient
})

const experienceData = await contentfulClient.getEntries({
  content_type: 'nt_experience',
  include: 1
})

const experiences = experienceData.items as ExperienceEntryLike[]

const mappedExperiences = (experiences || [])
  .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
  .map((entry) => ExperienceMapper.mapExperience(entry))

const audienceData = await contentfulClient.getEntries({
  content_type: 'nt_audience',
  include: 1
})

const audiences = audienceData.items as AudienceEntryLike[]

const mappedAudiences = (audiences || [])
  .filter((entry) => AudienceMapper.isAudienceEntry(entry))
  .map((entry) => AudienceMapper.mapAudience(entry))

app.use(VueNinetailed, {
  clientId: import.meta.env.VITE_NINETAILED_CLIENT_ID,
  environment: import.meta.env.VITE_NINETAILED_ENV,
  plugins: [
    new NinetailedPreviewPlugin({
      experiences: mappedExperiences,
      // @ts-ignore
      audiences: mappedAudiences
    })
  ]
})

// Globally registers components whose corresponding content types are experimentable and personalizable
// We need this because of the polymorphism of Experience.vue and the way in which Vue resolves components
// We cannot pass Vue components as functions in their entirety to children, as we might do in React; Vue wants explicit import and registration
// We won't know ahead of time **exactly** what components Experience.vue might need, so we make any possibly used components global
// Likely, this is already being done in customer implemenations using polymorphic content models

// eslint-disable-next-line
app.component('Hero', Hero)

app.mount('#app')
