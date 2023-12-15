import {
  selectHasExperienceVariants,
  selectExperience,
  selectExperienceVariant,
} from "@ninetailed/experience.js";

import type {
  Baseline,
  ExperienceConfiguration,
  Profile,
  Reference,
  VariantRef,
} from "@ninetailed/experience.js";

import { ProfileStateKey } from "~/vuePlugins/ninetailed";

type Load<Variant extends Reference> = {
  status: "loading";
  loading: boolean;
  hasVariants: boolean;
  baseline: Baseline;
  experience: null;
  variant: Variant;
  variantIndex: 0;
  audience: null;
  isPersonalized: boolean;
  profile: null;
  error: null;
};

type Success<Variant extends Reference> = {
  status: "success";
  loading: boolean;
  hasVariants: boolean;
  baseline: Baseline;
  experience: ExperienceConfiguration<Variant> | null;
  variant: Variant;
  variantIndex: number;
  audience: { id: string } | null;
  isPersonalized: boolean;
  profile: Profile;
  error: null;
};

type Fail<Variant extends Reference> = {
  status: "error";
  loading: boolean;
  hasVariants: boolean;
  baseline: Baseline;
  experience: null;
  variant: Variant;
  variantIndex: 0;
  audience: null;
  isPersonalized: boolean;
  profile: null;
  error: Error;
};

type UseExperienceArgs<Variant extends Reference> = {
  baseline: Baseline;
  experiences: ExperienceConfiguration<Variant>[];
};

type UseExperienceResponse<Variant extends Reference> =
  | Load<Variant | VariantRef>
  | Success<Variant | VariantRef>
  | Fail<Variant | VariantRef>;

// TODO: Figure out return typing
export const useExperience = <Variant extends Reference>({
  baseline,
  experiences,
}: UseExperienceArgs<Variant>): ComputedRef<UseExperienceResponse<Variant>> => {
  const profileState = inject(ProfileStateKey);
  const hasVariants = experiences
    .map((experience) => selectHasExperienceVariants(experience, baseline))
    .reduce((acc, curr) => acc || curr, false);

  const baseReturn = {
    ...profileState?.value,
    hasVariants,
    baseline,
  };

  const emptyReturn = {
    ...baseReturn,
    experience: null,
    variant: baseline,
    variantIndex: 0,
    audience: null,
    isPersonalized: false,
    profile: null,
  };

  const experienceState = computed(() => {
    if (
      profileState?.value.status === "loading" ||
      profileState?.value.status === "error" ||
      !profileState?.value.profile
    ) {
      return emptyReturn;
    }

    const experience = selectExperience({
      experiences,
      profile: profileState.value.profile,
    });

    if (!experience) {
      // @ts-ignore
      return { ...emptyReturn, profile: profileState.value.profile };
    }

    const { variant, index } = selectExperienceVariant({
      baseline,
      experience,
      profile: profileState.value.profile,
    });

    return {
      ...baseReturn,
      status: "success",
      loading: false,
      error: null,
      experience,
      variant,
      variantIndex: index,
      audience: experience.audience ? experience.audience : null,
      profile: profileState.value.profile,
      isPersonalized: true,
    };
  });

  // @ts-ignore
  return experienceState;
};
