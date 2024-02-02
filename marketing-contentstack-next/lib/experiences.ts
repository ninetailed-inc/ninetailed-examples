import {
  ExperienceLike,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils';

import { NtExperience } from '@/types/contentstack';

interface NtExperienceCsEntry extends NtExperience {
  uid: string;
}

export function parseExperiences(entry: any) {
  return entry?.nt_experiences
    ? entry.nt_experiences
        .map((experience: NtExperienceCsEntry) => {
          return {
            name: experience.nt_name,
            type: experience.nt_type,
            config: experience.nt_config,
            ...(experience.nt_audience?.length
              ? {
                  audience: {
                    id: experience.nt_audience[0].nt_audience_id,
                    name: experience.nt_audience[0].nt_name,
                  },
                }
              : {}),
            id: experience.uid,
            variants: experience.nt_variants?.map((variant: any) => {
              return {
                id: variant.uid,
                ...variant,
              };
            }),
          };
        })
        .filter((experience: ExperienceLike) =>
          ExperienceMapper.isExperienceEntry(experience)
        )
        .map((experience: ExperienceLike) =>
          ExperienceMapper.mapExperience(experience)
        )
    : [];
}

export function parseModularBlockExperiences(
  modularBlockExperiences: any,
  mappedModularBlockVariants: any
) {
  return modularBlockExperiences
    .map((modularBlockExperience: any) => {
      const experience =
        modularBlockExperience.nt_experience_block.nt_experience[0];
      return {
        name: experience.nt_name,
        type: experience.nt_type,
        config: {
          ...experience.nt_config,
          components: experience.nt_config?.components?.map(
            (component: { variants: any[]; baseline: { blockId: any } }) => {
              return {
                variants: component.variants?.map((variant) => {
                  return {
                    ...variant,
                    id: variant.blockId,
                  };
                }),
                baseline: {
                  ...component.baseline,
                  id: component.baseline.blockId,
                },
              };
            }
          ),
        },
        ...(experience.nt_audience.length
          ? {
              audience: {
                id: experience.nt_audience[0].nt_audience_id,
                name: experience.nt_audience[0].nt_name,
              },
            }
          : {}),
        id: experience.uid,
        variants: mappedModularBlockVariants,
      };
    })
    .filter((experience: any) => ExperienceMapper.isExperienceEntry(experience))
    .map((experience: any) => ExperienceMapper.mapExperience(experience));
}
