import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeProductDetailFields {
    internalName: EntryFieldTypes.Symbol;
    heading: EntryFieldTypes.Symbol;
    body?: EntryFieldTypes.RichText;
}

export type TypeProductDetailSkeleton = EntrySkeletonType<TypeProductDetailFields, "productDetail">;
export type TypeProductDetail<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeProductDetailSkeleton, Modifiers, Locales>;
export type TypeProductDetailWithoutLinkResolutionResponse = TypeProductDetail<"WITHOUT_LINK_RESOLUTION">;
export type TypeProductDetailWithoutUnresolvableLinksResponse = TypeProductDetail<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProductDetailWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeProductDetail<"WITH_ALL_LOCALES", Locales>;
export type TypeProductDetailWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeProductDetail<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProductDetailWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeProductDetail<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
