import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNavLinkSkeleton } from "./TypeNavLink";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeNavigationFields {
    internalTitle?: EntryFieldTypes.Symbol;
    logo?: EntryFieldTypes.AssetLink;
    navigationLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavLinkSkeleton>>;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<TypeNavigationFields, "navigation">;
export type TypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;
export type TypeNavigationWithoutLinkResolutionResponse = TypeNavigation<"WITHOUT_LINK_RESOLUTION">;
export type TypeNavigationWithoutUnresolvableLinksResponse = TypeNavigation<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNavigationWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigation<"WITH_ALL_LOCALES", Locales>;
export type TypeNavigationWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigation<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNavigationWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigation<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
