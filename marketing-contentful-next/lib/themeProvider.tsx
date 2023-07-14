import { IConfig, ISetting } from '@/types/contentful';
import { useExperience } from '@ninetailed/experience.js-next';
import { PropsWithChildren, createContext } from 'react';
import find from 'lodash/find';
import { parseExperiences } from './experiences';

export const ThemeContext = createContext<'default' | 'alternate'>('default');

export default function ThemeProvider(
  props: PropsWithChildren<{ config: IConfig }>
) {
  const { settings } = props.config?.fields || {};
  const heroLayoutSetting = find(settings, 'fields.value.heroLayout');
  const { variant } = useExperience({
    baseline: {
      id: heroLayoutSetting?.sys.id ?? '',
      ...heroLayoutSetting,
    },
    experiences: heroLayoutSetting ? parseExperiences(heroLayoutSetting) : [],
  });
  return (
    <ThemeContext.Provider
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      value={(variant as ISetting)?.fields?.value.heroLayout || 'default'}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
