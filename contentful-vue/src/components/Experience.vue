<template>
  <Experience />
</template>

<script setup lang="tsx">
import { useExperience } from '@/composables/useExperience'
import type { Baseline, ExperienceConfiguration, Reference } from '@ninetailed/experience.js'
import { NinetailedKey } from '@/plugins/ninetailed'
import { deepToRaw } from '@/lib/helpers'
import TrackingComponent from './TrackingComponent.vue'
import { inject, resolveComponent, ref, watchEffect } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

type ComponentDefintion = string | (() => JSX.Element) // Pass a string to be resolved (must be globally registered) or a rendering function

// TODO: Type all the things
const props = defineProps<{
  baseline: Baseline
  component: ComponentDefintion
  experiences: ExperienceConfiguration<Reference>[]
  loadingComponent?: ComponentDefintion
  passthroughProps?: any
}>()

const { logger } = inject(NinetailedKey)!

const resolveRenderingComponent = (component: ComponentDefintion | undefined) => {
  if (typeof component === 'string') {
    return resolveComponent(component)
  }
  if (component) {
    return component
  }
}

const experienceState = useExperience({
  baseline: props.baseline,
  experiences: props.experiences
})

// WARNING: This implementation requires that any possible resolved components are globally registered. See ~/plugins/possibleExperienceComponents.ts
// See: https://vuejs.org/guide/components/registration.html for documentation
// See: https://github.com/nuxt/nuxt/issues/14036 for in-practice inquiry about component polymorphism
const ExperienceRenderComponent = resolveRenderingComponent(props.component)

const DefaultLoadingComponent = (loadingComponentProps: {
  baseline: Baseline
  experiences: ExperienceConfiguration<Reference>[]
  passthroughProps: any
  unhideAfterMs?: number
}) => {
  const unhideDelay = loadingComponentProps.unhideAfterMs ?? 5000

  const hidden = ref(true)

  watchEffect((onCleanup) => {
    const timer = setTimeout(() => {
      hidden.value = false
      logger.error(
        new Error(
          `The experience was still in loading state after ${unhideDelay}ms. That happens when no events are sent to the Ninetailed API. The baseline is now shown instead.`
        )
      )
    }, unhideDelay)
    onCleanup(() => {
      clearTimeout(timer)
    })
  })

  if (hidden.value) {
    return (
      <div key="hide" style={{ opacity: 0 }}>
        <ExperienceRenderComponent
          {...loadingComponentProps.passthroughProps}
          {...loadingComponentProps.baseline}
        />
      </div>
    )
  }

  return (
    <ExperienceRenderComponent
      {...loadingComponentProps.passthroughProps}
      {...loadingComponentProps.baseline}
    />
  )
}

const LoadingComponent =
  resolveRenderingComponent(props.loadingComponent) || DefaultLoadingComponent

const Experience = () => {
  if (!experienceState.value.hasVariants) {
    return (
      <>
        <TrackingComponent
          experience={experienceState.value.experience}
          variant={props.baseline}
          variantIndex={0}
        />
        <ExperienceRenderComponent
          {...props.passthroughProps}
          {...props.baseline}
          key={props.baseline.id}
        />
      </>
    )
  }

  if (experienceState.value.status === 'loading') {
    return (
      <LoadingComponent
        key={props.baseline.id}
        passthroughProps={props.passthroughProps}
        baseline={props.baseline}
        experiences={props.component}
      />
    )
  }

  const isVariantHidden =
    'hidden' in experienceState.value.variant && experienceState.value.variant.hidden

  if (isVariantHidden) {
    return (
      <TrackingComponent
        experience={experienceState.value.experience}
        variant={deepToRaw(experienceState.value.variant)}
        variantIndex={experienceState.value.variantIndex}
      />
    )
  }

  return (
    <>
      <TrackingComponent
        experience={experienceState.value.experience}
        variant={deepToRaw(experienceState.value.variant)}
        variantIndex={experienceState.value.variantIndex}
      />
      <ExperienceRenderComponent
        key={`${experienceState.value.experience?.id || 'baseline'}-${
          experienceState.value.variant.id
        }`}
        ninetailed={{
          isPersonalized: experienceState.value.isPersonalized,
          audience: {
            id: experienceState.value.audience?.id || 'all visitors'
          }
        }}
        {...props.passthroughProps}
        {...experienceState.value.variant}
      />
    </>
  )
}
</script>
