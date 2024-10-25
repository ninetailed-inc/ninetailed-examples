import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeBannerSkeleton } from "./TypeBanner";
import type { TypeFooterSkeleton } from "./TypeFooter";
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypeSettingSkeleton } from "./TypeSetting";

export interface TypeConfigFields {
    name: EntryFieldTypes.Symbol<"Configuration">;
    banner?: EntryFieldTypes.EntryLink<TypeBannerSkeleton>;
    navigation?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
    settings?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeSettingSkeleton>>;
    footer?: EntryFieldTypes.EntryLink<TypeFooterSkeleton>;
}

export type TypeConfigSkeleton = EntrySkeletonType<TypeConfigFields, "config">;
export type TypeConfig<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeConfigSkeleton, Modifiers, Locales>;
export type TypeConfigWithoutLinkResolutionResponse = TypeConfig<"WITHOUT_LINK_RESOLUTION">;
export type TypeConfigWithoutUnresolvableLinksResponse = TypeConfig<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeConfigWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeConfig<"WITH_ALL_LOCALES", Locales>;
export type TypeConfigWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeConfig<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeConfigWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeConfig<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
