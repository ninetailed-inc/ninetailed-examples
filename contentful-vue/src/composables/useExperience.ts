import { selectHasExperienceVariants } from '@ninetailed/experience.js'

import type {
  ExperienceConfiguration,
  Profile,
  Reference,
  VariantRef
} from '@ninetailed/experience.js'

import { NinetailedKey } from '@/plugins/ninetailed'
import { inject, shallowRef, type ShallowRef } from 'vue'

type Load<TBaseline extends Reference> = {
  status: 'loading'
  loading: boolean
  hasVariants: boolean
  baseline: TBaseline
  experience: null
  variant: TBaseline
  variantIndex: 0
  audience: null
  isPersonalized: boolean
  profile: null
  error: null
}

type Success<TBaseline extends Reference, TVariant extends Reference> = {
  status: 'success'
  loading: boolean
  hasVariants: boolean
  baseline: TBaseline
  experience: ExperienceConfiguration<TVariant> | null
  variant: TVariant
  variantIndex: number
  audience: { id: string } | null
  isPersonalized: boolean
  profile: Profile
  error: null
}

type Fail<TBaseline extends Reference> = {
  status: 'error'
  loading: boolean
  hasVariants: boolean
  baseline: TBaseline
  experience: null
  variant: TBaseline
  variantIndex: 0
  audience: null
  isPersonalized: boolean
  profile: null
  error: Error
}

type UseExperienceArgs<TBaseline extends Reference, TVariant extends Reference> = {
  baseline: TBaseline
  experiences: ExperienceConfiguration<TVariant>[]
}

type UseExperienceReturn<TBaseline extends Reference, TVariant extends Reference> =
  | Load<TBaseline>
  | Success<TBaseline, TVariant | VariantRef>
  | Fail<TBaseline>

// TODO: Figure out return typing
export const useExperience = <TBaseline extends Reference, TVariant extends Reference>({
  baseline,
  experiences
}: UseExperienceArgs<TBaseline, TVariant>): ShallowRef<
  UseExperienceReturn<TBaseline, TVariant>
> => {
  const ninetailed = inject(NinetailedKey)

  const hasVariants = experiences
    .map((experience) => selectHasExperienceVariants(experience, baseline))
    .reduce((acc, curr) => acc || curr, false)

  const experience = shallowRef<UseExperienceReturn<TBaseline, TVariant | VariantRef>>({
    hasVariants,
    baseline,
    error: null,
    loading: true,
    status: 'loading',
    experience: null,
    variant: baseline,
    variantIndex: 0,
    audience: null,
    isPersonalized: false,
    profile: null
  })

  ninetailed?.onSelectVariant({ baseline, experiences }, (newExperienceState) => {
    experience.value = newExperienceState as UseExperienceReturn<TBaseline, TVariant>
  })

  return experience
}
