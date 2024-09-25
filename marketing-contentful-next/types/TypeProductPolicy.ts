import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeProductPolicyFields {
    internalName: EntryFieldTypes.Symbol;
    policyType: EntryFieldTypes.Symbol<"Loyalty" | "Shipping">;
    heading: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.RichText;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeProductPolicySkeleton = EntrySkeletonType<TypeProductPolicyFields, "productPolicy">;
export type TypeProductPolicy<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeProductPolicySkeleton, Modifiers, Locales>;
export type TypeProductPolicyWithoutLinkResolutionResponse = TypeProductPolicy<"WITHOUT_LINK_RESOLUTION">;
export type TypeProductPolicyWithoutUnresolvableLinksResponse = TypeProductPolicy<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProductPolicyWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeProductPolicy<"WITH_ALL_LOCALES", Locales>;
export type TypeProductPolicyWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeProductPolicy<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProductPolicyWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeProductPolicy<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
