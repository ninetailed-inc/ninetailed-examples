import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeButtonSkeleton } from "./TypeButton";

export interface TypeFooterFields {
    internalTitle: EntryFieldTypes.Symbol;
    footerLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeButtonSkeleton>>;
    copyright: EntryFieldTypes.RichText;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFooterSkeleton, Modifiers, Locales>;
export type TypeFooterWithoutLinkResolutionResponse = TypeFooter<"WITHOUT_LINK_RESOLUTION">;
export type TypeFooterWithoutUnresolvableLinksResponse = TypeFooter<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFooterWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFooter<"WITH_ALL_LOCALES", Locales>;
export type TypeFooterWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFooter<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFooterWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFooter<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
