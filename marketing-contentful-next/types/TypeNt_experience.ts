import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNt_audienceSkeleton } from "./TypeNt_audience";

export interface TypeNt_experienceFields {
    nt_name: EntryFieldTypes.Symbol;
    nt_description?: EntryFieldTypes.Text;
    nt_type: EntryFieldTypes.Symbol<"nt_experiment" | "nt_personalization">;
    nt_config: EntryFieldTypes.Object;
    nt_audience?: EntryFieldTypes.EntryLink<TypeNt_audienceSkeleton>;
    nt_variants?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
    nt_experience_id?: EntryFieldTypes.Symbol;
    nt_metadata?: EntryFieldTypes.Object;
}

export type TypeNt_experienceSkeleton = EntrySkeletonType<TypeNt_experienceFields, "nt_experience">;
export type TypeNt_experience<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNt_experienceSkeleton, Modifiers, Locales>;
export type TypeNt_experienceWithoutLinkResolutionResponse = TypeNt_experience<"WITHOUT_LINK_RESOLUTION">;
export type TypeNt_experienceWithoutUnresolvableLinksResponse = TypeNt_experience<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNt_experienceWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_experience<"WITH_ALL_LOCALES", Locales>;
export type TypeNt_experienceWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_experience<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNt_experienceWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNt_experience<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
