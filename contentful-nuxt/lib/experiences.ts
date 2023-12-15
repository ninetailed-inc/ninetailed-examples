import type {
  BaselineWithExperiencesEntry,
  Entry,
} from "@ninetailed/experience.js-utils-contentful";

import { ExperienceMapper } from "@ninetailed/experience.js-utils-contentful";

export type SingularBlock = Entry | BaselineWithExperiencesEntry;
export type SingularOrArrayBlock =
  | SingularBlock
  | Entry[]
  | BaselineWithExperiencesEntry[];

export const hasExperiences = (
  entry: SingularBlock
): entry is BaselineWithExperiencesEntry => {
  return (
    (entry as BaselineWithExperiencesEntry).fields.nt_experiences !== undefined
  );
};

export const parseExperiences = (entry: SingularBlock) => {
  return hasExperiences(entry)
    ? entry.fields.nt_experiences
        .filter((experience) => ExperienceMapper.isExperienceEntry(experience))
        .map((experience) => ExperienceMapper.mapExperience(experience))
    : [];
};

export const mapBaselineContentfulEntry = (entry: SingularBlock) => {
  return {
    id: entry.sys.id,
    ...entry,
  };
};
