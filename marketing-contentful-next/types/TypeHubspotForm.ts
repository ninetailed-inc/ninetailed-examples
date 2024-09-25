import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeHubspotFormFields {
    internalName: EntryFieldTypes.Symbol;
    hubspotFormId: EntryFieldTypes.Symbol;
    hubspotPortalId: EntryFieldTypes.Symbol;
}

export type TypeHubspotFormSkeleton = EntrySkeletonType<TypeHubspotFormFields, "hubspotForm">;
export type TypeHubspotForm<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeHubspotFormSkeleton, Modifiers, Locales>;
export type TypeHubspotFormWithoutLinkResolutionResponse = TypeHubspotForm<"WITHOUT_LINK_RESOLUTION">;
export type TypeHubspotFormWithoutUnresolvableLinksResponse = TypeHubspotForm<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeHubspotFormWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeHubspotForm<"WITH_ALL_LOCALES", Locales>;
export type TypeHubspotFormWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeHubspotForm<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeHubspotFormWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeHubspotForm<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
