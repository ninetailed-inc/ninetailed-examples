import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeFeatureSkeleton } from "./TypeFeature";
import type { TypeProductDetailSkeleton } from "./TypeProductDetail";
import type { TypeProductPolicySkeleton } from "./TypeProductPolicy";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypePdpFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    seo: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
    product: EntryFieldTypes.Symbol;
    details?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeProductDetailSkeleton>>;
    policies?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeProductPolicySkeleton>>;
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFeatureSkeleton>>;
}

export type TypePdpSkeleton = EntrySkeletonType<TypePdpFields, "pdp">;
export type TypePdp<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePdpSkeleton, Modifiers, Locales>;
export type TypePdpWithoutLinkResolutionResponse = TypePdp<"WITHOUT_LINK_RESOLUTION">;
export type TypePdpWithoutUnresolvableLinksResponse = TypePdp<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePdpWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePdp<"WITH_ALL_LOCALES", Locales>;
export type TypePdpWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePdp<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePdpWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePdp<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
