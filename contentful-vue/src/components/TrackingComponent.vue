<template>
  <div
    className="nt-cmp-marker"
    style="
      display: block !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    "
    ref="trackingComponent"
  />
</template>

<script setup lang="ts">
import type {
  ExperienceConfiguration,
  Reference,
  VariantRef
} from '@ninetailed/experience.js-shared'
import { NinetailedKey } from '@/plugins/ninetailed'
import { inject, ref, watchEffect } from 'vue'

const props = defineProps<{
  experience?: ExperienceConfiguration<Reference | VariantRef> | null
  variant: Reference | VariantRef
  variantIndex: number
}>()

const trackingComponent = ref<null | Element>(null)
const ninetailed = inject(NinetailedKey)!
watchEffect((onCleanup) => {
  const element = trackingComponent.value
  if (element !== null) {
    ninetailed.observeElement({
      element,
      experience: props.experience,
      audience: props.experience?.audience,
      variant:
        'hidden' in props.variant && props.variant.hidden
          ? { ...props.variant, id: `${props.variant.id}-hidden` }
          : props.variant,
      variantIndex: props.variantIndex
    })
    onCleanup(() => ninetailed.unobserveElement(element))
  }
})
</script>
