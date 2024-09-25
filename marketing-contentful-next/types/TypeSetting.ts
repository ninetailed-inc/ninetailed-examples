import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeSettingFields {
    name: EntryFieldTypes.Symbol;
    settingKey: EntryFieldTypes.Symbol;
    settingValue: EntryFieldTypes.Symbol;
    value?: EntryFieldTypes.Object;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeSettingSkeleton = EntrySkeletonType<TypeSettingFields, "setting">;
export type TypeSetting<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSettingSkeleton, Modifiers, Locales>;
export type TypeSettingWithoutLinkResolutionResponse = TypeSetting<"WITHOUT_LINK_RESOLUTION">;
export type TypeSettingWithoutUnresolvableLinksResponse = TypeSetting<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSettingWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSetting<"WITH_ALL_LOCALES", Locales>;
export type TypeSettingWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSetting<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSettingWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSetting<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
