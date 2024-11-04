import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeButtonSkeleton } from "./TypeButton";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypePricingPlanFields {
    internalName?: EntryFieldTypes.Symbol;
    title: EntryFieldTypes.RichText;
    price: EntryFieldTypes.RichText;
    frequency?: EntryFieldTypes.Symbol<"/day" | "/month" | "/week">;
    discountedPrice?: EntryFieldTypes.RichText;
    description?: EntryFieldTypes.RichText;
    button: EntryFieldTypes.EntryLink<TypeButtonSkeleton>;
    mostPopular?: EntryFieldTypes.Boolean;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypePricingPlanSkeleton = EntrySkeletonType<TypePricingPlanFields, "pricingPlan">;
export type TypePricingPlan<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePricingPlanSkeleton, Modifiers, Locales>;
export type TypePricingPlanWithoutLinkResolutionResponse = TypePricingPlan<"WITHOUT_LINK_RESOLUTION">;
export type TypePricingPlanWithoutUnresolvableLinksResponse = TypePricingPlan<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePricingPlanWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePricingPlan<"WITH_ALL_LOCALES", Locales>;
export type TypePricingPlanWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePricingPlan<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePricingPlanWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePricingPlan<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
