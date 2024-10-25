import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNt_audienceFields {
    nt_name: EntryFieldTypes.Symbol;
    nt_description?: EntryFieldTypes.Text;
    nt_rules: EntryFieldTypes.Object;
    nt_audience_id: EntryFieldTypes.Symbol;
    nt_metadata?: EntryFieldTypes.Object;
}

export type TypeNt_audienceSkeleton = EntrySkeletonType<TypeNt_audienceFields, "nt_audience">;
export type TypeNt_audience<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNt_audienceSkeleton, Modifiers, Locales>;
export type TypeNt_audienceWithoutLinkResolutionResponse = TypeNt_audience<"WITHOUT_LINK_RESOLUTION">;
export type TypeNt_audienceWithoutUnresolvableLinksResponse = TypeNt_audience<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNt_audienceWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_audience<"WITH_ALL_LOCALES", Locales>;
export type TypeNt_audienceWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_audience<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNt_audienceWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_audience<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
