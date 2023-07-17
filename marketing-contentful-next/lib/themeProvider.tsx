// TODO:  Remove hardcoded hero layout reads, make generic

import { IConfig, ISetting } from '@/types/contentful';
import { Experience } from '@ninetailed/experience.js-next';
import { PropsWithChildren, createContext } from 'react';
import { parseExperiences } from './experiences';

type HeroLayoutOption = 'default' | 'alternate';

export const ThemeContext = createContext<HeroLayoutOption>('default');

export function ThemeProvider(props: PropsWithChildren<Partial<ISetting>>) {
  return (
    <ThemeContext.Provider
      value={(props.fields?.value?.heroLayout as HeroLayoutOption) || 'default'}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export default function SettingsProviderWrapper(
  props: PropsWithChildren<{ config: IConfig }>
) {
  const { settings } = props.config?.fields || {};
  return (
    <>
      {settings ? (
        <Experience
          id={settings[0].sys.id}
          {...settings[0]}
          component={ThemeProvider}
          // TODO: fix passthrough props
          // eslint-disable-next-line
          // @ts-ignore
          passthroughProps={{ children: props.children }}
          experiences={parseExperiences(settings[0])}
        />
      ) : (
        <ThemeProvider />
      )}
    </>
  );
}
