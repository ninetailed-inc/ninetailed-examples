import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeSeoFields {
    name: EntryFieldTypes.Symbol;
    title: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Symbol;
    no_index?: EntryFieldTypes.Boolean;
    no_follow?: EntryFieldTypes.Boolean;
}

export type TypeSeoSkeleton = EntrySkeletonType<TypeSeoFields, "seo">;
export type TypeSeo<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSeoSkeleton, Modifiers, Locales>;
export type TypeSeoWithoutLinkResolutionResponse = TypeSeo<"WITHOUT_LINK_RESOLUTION">;
export type TypeSeoWithoutUnresolvableLinksResponse = TypeSeo<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSeoWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSeo<"WITH_ALL_LOCALES", Locales>;
export type TypeSeoWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSeo<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSeoWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSeo<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
