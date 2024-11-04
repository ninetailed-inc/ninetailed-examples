import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeProductInfoBlockFields {
    title: EntryFieldTypes.Symbol;
    copy?: EntryFieldTypes.RichText;
}

export type TypeProductInfoBlockSkeleton = EntrySkeletonType<TypeProductInfoBlockFields, "productInfoBlock">;
export type TypeProductInfoBlock<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeProductInfoBlockSkeleton, Modifiers, Locales>;
export type TypeProductInfoBlockWithoutLinkResolutionResponse = TypeProductInfoBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeProductInfoBlockWithoutUnresolvableLinksResponse = TypeProductInfoBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProductInfoBlockWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeProductInfoBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeProductInfoBlockWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeProductInfoBlock<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProductInfoBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeProductInfoBlock<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
