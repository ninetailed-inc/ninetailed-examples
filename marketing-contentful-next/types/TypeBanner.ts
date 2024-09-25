import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeBannerFields {
    internalTitle: EntryFieldTypes.Symbol;
    text: EntryFieldTypes.RichText;
    linkText: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    variant?: EntryFieldTypes.Symbol<"Loud" | "Primary">;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeBannerSkeleton = EntrySkeletonType<TypeBannerFields, "banner">;
export type TypeBanner<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBannerSkeleton, Modifiers, Locales>;
export type TypeBannerWithoutLinkResolutionResponse = TypeBanner<"WITHOUT_LINK_RESOLUTION">;
export type TypeBannerWithoutUnresolvableLinksResponse = TypeBanner<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeBannerWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITH_ALL_LOCALES", Locales>;
export type TypeBannerWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeBannerWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeBanner<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
