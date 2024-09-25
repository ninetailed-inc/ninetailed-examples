import {
  BaselineWithExperiencesEntry,
  Entry,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';
import { SettingsContext } from './SettingsProvider';
import { useContext } from 'react';
import { useExperience } from '@ninetailed/experience.js-next';

export type singularBlock = Entry | BaselineWithExperiencesEntry | undefined;
export type singularOrArrayBlock = singularBlock | singularBlock[];

export const hasExperiences = (
  entry: unknown
): entry is BaselineWithExperiencesEntry => {
  return (
    (entry as BaselineWithExperiencesEntry).fields.nt_experiences !== undefined
  );
};

export const parseExperiences = (entry: unknown) => {
  return hasExperiences(entry)
    ? entry.fields.nt_experiences
        .filter((experience) => ExperienceMapper.isExperienceEntry(experience))
        .map((experience) => ExperienceMapper.mapExperience(experience))
    : [];
};

export const hoistId = (entry: singularBlock) => {
  if (entry) {
    return {
      ...entry,
      id: entry.sys.id,
    };
  }
  return {
    id: '',
  };
};

// Feature flagging example
export const useFlag = (flag: string) => {
  const settings = useContext(SettingsContext);
  const setting = settings[flag];

  const { variantIndex } = useExperience({
    baseline: hoistId(setting),
    experiences: setting ? parseExperiences(setting) : [],
  });

  return variantIndex;
};
