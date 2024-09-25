import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNt_mergetagFields {
    nt_name: EntryFieldTypes.Symbol;
    nt_fallback?: EntryFieldTypes.Symbol;
    nt_mergetag_id: EntryFieldTypes.Symbol;
}

export type TypeNt_mergetagSkeleton = EntrySkeletonType<TypeNt_mergetagFields, "nt_mergetag">;
export type TypeNt_mergetag<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNt_mergetagSkeleton, Modifiers, Locales>;
export type TypeNt_mergetagWithoutLinkResolutionResponse = TypeNt_mergetag<"WITHOUT_LINK_RESOLUTION">;
export type TypeNt_mergetagWithoutUnresolvableLinksResponse = TypeNt_mergetag<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNt_mergetagWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_mergetag<"WITH_ALL_LOCALES", Locales>;
export type TypeNt_mergetagWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_mergetag<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNt_mergetagWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_mergetag<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
