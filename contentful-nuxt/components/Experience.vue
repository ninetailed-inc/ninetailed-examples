<template>
  <Experience />
</template>

<script setup lang="tsx">
import { useExperience } from "~/composables/useExperience";
import type {
  Baseline,
  ExperienceConfiguration,
  Reference,
} from "@ninetailed/experience.js";
import { NinetailedKey } from "~/vuePlugins/ninetailed";

type ComponentDefintion = string | (() => JSX.Element); // Pass a string to be resolved (must be globally registered) or a rendering function

// TODO: Type all the things
const props = defineProps<{
  baseline: Baseline;
  component: ComponentDefintion;
  experiences: ExperienceConfiguration<Reference>[];
  loadingComponent?: ComponentDefintion;
  passthroughProps?: any;
}>();

const { observeElement, unobserveElement, logger } = inject(NinetailedKey)!;

const resolveRenderingComponent = (
  component: ComponentDefintion | undefined
) => {
  if (typeof component === "string") {
    return resolveComponent(component);
  }
  if (component) {
    return component;
  }
};

const experienceState = useExperience({
  baseline: props.baseline,
  experiences: props.experiences,
});

const trackingElement = ref();

watchEffect((onCleanup) => {
  if (trackingElement.value && !(trackingElement.value instanceof Element)) {
    const isObject =
      typeof trackingElement.value === "object" &&
      trackingElement.value !== null;
    const constructorName = isObject
      ? (trackingElement.value as any).constructor.name
      : "";
    const isConstructorNameNotObject =
      constructorName && constructorName !== "Object";

    logger.warn(
      `The component ref being in Experience is an invalid element. Expected an Element but got ${typeof trackingElement.value}${
        isConstructorNameNotObject ? ` of type ${constructorName}` : ""
      }. This component won't be observed.`
    );
  }

  if (trackingElement.value) {
    observeElement({
      element: trackingElement.value,
      experience: experienceState.value.experience,
      audience: experienceState.value.audience,
      variant: experienceState.value.variant,
      variantIndex: experienceState.value.variantIndex,
    });

    onCleanup(() => {
      // FIXME: This throws when navigating away
      // unobserveElement(trackingElement.value);
    });
  }
});

// WARNING: This implementation requires that any possible resolved components are globally registered. See ~/plugins/possibleExperienceComponents.ts
// See: https://vuejs.org/guide/components/registration.html for documentation
// See: https://github.com/nuxt/nuxt/issues/14036 for in-practice inquiry about component polymorphism
const ExperienceRenderComponent = resolveRenderingComponent(props.component);

const DefaultLoadingComponent = (loadingComponentProps: {
  baseline: Baseline;
  experiences: ExperienceConfiguration<Reference>[];
  passthroughProps: any;
  unhideAfterMs?: number;
}) => {
  const unhideDelay = loadingComponentProps.unhideAfterMs ?? 5000;

  const hidden = ref(true);

  watchEffect((onCleanup) => {
    const timer = setTimeout(() => {
      hidden.value = false;
      logger.error(
        new Error(
          `The experience was still in loading state after ${unhideDelay}ms. That happens when no events are sent to the Ninetailed API. The baseline is now shown instead.`
        )
      );
    }, unhideDelay);
    onCleanup(() => {
      clearTimeout(timer);
    });
  });

  if (hidden) {
    return (
      <div key="hide" style={{ opacity: 0 }}>
        <ExperienceRenderComponent
          {...loadingComponentProps.passthroughProps}
          {...loadingComponentProps.baseline}
        />
      </div>
    );
  }

  return (
    <ExperienceRenderComponent
      {...loadingComponentProps.passthroughProps}
      {...loadingComponentProps.baseline}
    />
  );
};

const LoadingComponent =
  resolveRenderingComponent(props.loadingComponent) || DefaultLoadingComponent;

const Experience = () => {
  if (!experienceState.value.hasVariants) {
    return (
      <>
        <ExperienceRenderComponent
          {...props.passthroughProps}
          {...props.baseline}
          key={props.baseline.id}
          ref={trackingElement}
        />
      </>
    );
  }

  if (experienceState.value.status === "loading") {
    return (
      <LoadingComponent
        key={props.baseline.id}
        passthroughProps={props.passthroughProps}
        baseline={props.baseline}
        experiences={props.component}
        ref={trackingElement}
      />
    );
  }

  const isVariantHidden =
    "hidden" in experienceState.value.variant &&
    experienceState.value.variant.hidden;

  if (isVariantHidden) {
    return (
      <div
        class="nt-cmp-marker"
        ref={trackingElement}
        style={{ display: "none !important" }}
      />
    );
  }

  return (
    <>
      <ExperienceRenderComponent
        key={`${experienceState.value.experience?.id || "baseline"}-${
          experienceState.value.variant.id
        }`}
        ninetailed={{
          isPersonalized: experienceState.value.isPersonalized,
          audience: {
            id: experienceState.value.audience?.id || "all visitors",
          },
        }}
        {...props.passthroughProps}
        {...experienceState.value.variant}
        ref={trackingElement}
      />
    </>
  );
};
</script>
