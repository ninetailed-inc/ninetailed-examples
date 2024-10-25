import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";
import type { TypeFeatureSkeleton } from "./TypeFeature";
import type { TypeHeroSkeleton } from "./TypeHero";
import type { TypeHubspotFormSkeleton } from "./TypeHubspotForm";
import type { TypePricingTableSkeleton } from "./TypePricingTable";
import type { TypeSectionsGroupSkeleton } from "./TypeSectionsGroup";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypePageFields {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
    sections: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton | TypeFeatureSkeleton | TypeHeroSkeleton | TypeHubspotFormSkeleton | TypePricingTableSkeleton | TypeSectionsGroupSkeleton>>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;
export type TypePageWithoutLinkResolutionResponse = TypePage<"WITHOUT_LINK_RESOLUTION">;
export type TypePageWithoutUnresolvableLinksResponse = TypePage<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePageWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePageWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePage<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
