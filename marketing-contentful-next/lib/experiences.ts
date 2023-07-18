import {
  BaselineWithExperiencesEntry,
  Entry,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';

export type singularBlock = Entry | BaselineWithExperiencesEntry;
export type singularOrArrayBlock =
  | singularBlock
  | Entry[]
  | BaselineWithExperiencesEntry[];

export const hasExperiences = (
  entry: singularBlock
): entry is BaselineWithExperiencesEntry => {
  return (
    (entry as BaselineWithExperiencesEntry).fields.nt_experiences !== undefined
  );
};

export const parseExperiences = (entry: singularBlock) => {
  return hasExperiences(entry)
    ? entry.fields.nt_experiences
        .filter((experience) => ExperienceMapper.isExperienceEntry(experience))
        .map((experience) => ExperienceMapper.mapExperience(experience))
    : [];
};
