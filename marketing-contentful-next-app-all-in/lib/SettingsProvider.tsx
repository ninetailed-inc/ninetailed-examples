import { IConfig, ISetting } from '@/types/contentful';
import { PropsWithChildren, createContext } from 'react';

export const SettingsContext = createContext<Record<string, ISetting>>({});

export default function SettingsProvider(
  props: PropsWithChildren<{ config: IConfig }>
) {
  const { settings } = props.config?.fields || {};
  return (
    <SettingsContext.Provider
      value={(settings || []).reduce((acc, current) => {
        return { ...acc, [current.fields.settingKey]: current };
      }, {})}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
