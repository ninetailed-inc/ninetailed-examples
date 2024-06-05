<template>
  <div>
    <h1>Content Entry Title: {{ fields.internalName }}</h1>
    <RichTextRenderer :document="fields.headline" />
    <NuxtImg
      :src="fields.image.fields.file.url"
      width="500"
      provider="contentful"
    />
  </div>
</template>

<script setup lang="ts">
const { fields } = defineProps<{
  metadata: any;
  sys: any;
  fields: any;
}>();

// @ts-ignore
import RichTextRenderer from "contentful-rich-text-vue-renderer";
</script>
