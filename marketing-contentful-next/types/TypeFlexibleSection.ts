import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeFlexibleSectionFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    componentTree: EntryFieldTypes.Object;
    dataSource: EntryFieldTypes.Object;
    unboundValues: EntryFieldTypes.Object;
    componentSettings?: EntryFieldTypes.Object;
    usedComponents?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFlexibleSectionSkeleton>>;
}

export type TypeFlexibleSectionSkeleton = EntrySkeletonType<TypeFlexibleSectionFields, "flexibleSection">;
export type TypeFlexibleSection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFlexibleSectionSkeleton, Modifiers, Locales>;
export type TypeFlexibleSectionWithoutLinkResolutionResponse = TypeFlexibleSection<"WITHOUT_LINK_RESOLUTION">;
export type TypeFlexibleSectionWithoutUnresolvableLinksResponse = TypeFlexibleSection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFlexibleSectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFlexibleSection<"WITH_ALL_LOCALES", Locales>;
export type TypeFlexibleSectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFlexibleSection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFlexibleSectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFlexibleSection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
