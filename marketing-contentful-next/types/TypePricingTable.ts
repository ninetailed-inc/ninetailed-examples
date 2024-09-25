import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";
import type { TypePricingPlanSkeleton } from "./TypePricingPlan";

export interface TypePricingTableFields {
    internalName?: EntryFieldTypes.Symbol;
    headline: EntryFieldTypes.RichText;
    subline: EntryFieldTypes.RichText;
    pricingPlans: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypePricingPlanSkeleton>>;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypePricingTableSkeleton = EntrySkeletonType<TypePricingTableFields, "pricingTable">;
export type TypePricingTable<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePricingTableSkeleton, Modifiers, Locales>;
export type TypePricingTableWithoutLinkResolutionResponse = TypePricingTable<"WITHOUT_LINK_RESOLUTION">;
export type TypePricingTableWithoutUnresolvableLinksResponse = TypePricingTable<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePricingTableWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePricingTable<"WITH_ALL_LOCALES", Locales>;
export type TypePricingTableWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePricingTable<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePricingTableWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePricingTable<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
