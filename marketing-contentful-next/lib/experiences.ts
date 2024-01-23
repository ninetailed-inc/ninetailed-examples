import {
  BaselineWithExperiencesEntry,
  Entry,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';
import { SettingsContext } from './SettingsProvider';
import { useContext } from 'react';
import { useExperience } from '@ninetailed/experience.js-next';

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

export const hoistId = (entry: singularBlock) => {
  return {
    ...entry,
    id: entry.sys.id,
  };
};

// Feature flagging example
export const useFlag = (flag: string) => {
  const settings = useContext(SettingsContext);
  const pdpLayoutSetting = settings[flag] || {};

  const { variantIndex } = useExperience({
    baseline: hoistId(pdpLayoutSetting),
    experiences: parseExperiences(pdpLayoutSetting),
  });

  return variantIndex;
};
