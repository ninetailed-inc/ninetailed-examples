import { PropsWithChildren, createContext } from 'react';
import {
  TypeConfigWithoutUnresolvableLinksResponse,
  TypeSettingWithoutUnresolvableLinksResponse,
} from '../types';

export const SettingsContext = createContext<
  Record<string, TypeSettingWithoutUnresolvableLinksResponse>
>({});

export default function SettingsProvider(
  props: PropsWithChildren<{
    config: TypeConfigWithoutUnresolvableLinksResponse;
  }>
) {
  const { settings } = props.config?.fields || {};
  return (
    <SettingsContext.Provider
      value={(settings || []).reduce((acc, current) => {
        if (current) {
          return { ...acc, [current.fields.settingKey]: current };
        } else return acc;
      }, {})}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
