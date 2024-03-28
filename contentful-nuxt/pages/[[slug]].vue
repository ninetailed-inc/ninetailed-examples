<template>
  <pre>You've visited the {{ formattedSlug }} page!</pre>
  <pre>
There are {{ data.fields.sections.length || 0 }} sections on this entry, {{
      numberOfHeroSections
    }} of which are Hero sections.</pre
  >
  <pre>{{ data?.fields.title }}</pre>
  <ClientOnly>
    <PageSections :data="data" />
  </ClientOnly>
</template>

<script setup lang="tsx">
import type { SingularBlock } from "~/lib/experiences";
import {
  mapBaselineContentfulEntry,
  parseExperiences,
} from "~/lib/experiences";
import Experience from "../components/Experience.vue";

const {
  params: { slug },
} = useRoute();
const formattedSlug = slug || "/";

// TODO: Make pure SSG via server only fetched data
const { data } = await useAsyncData(slug as string, async () => {
  const { $contentfulClient } = useNuxtApp();
  console.log(`Fetching ${formattedSlug} data`);
  const pages = await $contentfulClient.getEntries({
    content_type: "page",
    "fields.slug": formattedSlug,
    limit: 1,
    include: 10,
  });
  return pages.items[0];
});

const numberOfHeroSections = data.value.fields.sections.filter(
  (section: any) => section.sys?.contentType.sys.id === "hero"
).length;

// TODO: Prop typing
const PageSections = (props: { data: any }) => {
  return props.data.fields.sections.map((section: SingularBlock) => {
    if (section.sys.contentType?.sys.id === "hero") {
      const baselineHeroEntry = mapBaselineContentfulEntry(section);
      const mappedExperiences = parseExperiences(section);
      return (
        <Experience
          baseline={baselineHeroEntry}
          key={baselineHeroEntry.id}
          experiences={mappedExperiences}
          component="Hero"
        />
      );
    }
  });
};
</script>
