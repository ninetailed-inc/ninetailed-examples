<script setup lang="tsx">
import { ContentfulKey } from '@/plugins/contentful'
import { inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type Entry } from 'contentful'
import { type SingularBlock, mapBaselineContentfulEntry, parseExperiences } from '@/lib/experiences'
import Experience from '@/components/Experience.vue'

const loading = ref<boolean>(false)
const page = ref<Entry | undefined | null>(null)
const error = ref<string | null>(null)

const route = useRoute()

const contentfulClient = inject(ContentfulKey)

async function fetchPageData() {
  error.value = page.value = null
  loading.value = true
  try {
    const entries = await contentfulClient?.getEntries({
      content_type: 'page',
      'fields.slug': '/', // TODO: Dynamic
      limit: 1,
      include: 10
    })
    page.value = entries?.items[0]
  } catch (err) {
    // @ts-ignore
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}

watch(() => route.params, fetchPageData, { immediate: true })

function PageSections(props: { data: any }) {
  return props.data.fields.sections.map((section: SingularBlock) => {
    if (section.sys.contentType?.sys.id === 'hero') {
      console.log(section)
      const baselineHeroEntry = mapBaselineContentfulEntry(section)
      const mappedExperiences = parseExperiences(section)
      return (
        <Experience
          baseline={baselineHeroEntry}
          key={baselineHeroEntry.id}
          experiences={mappedExperiences}
          component="Hero"
        />
      )
    }
  })
}
</script>

<template>
  <main>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="page" class="content">
      <PageSections :data="page" />
    </div>
  </main>
</template>
