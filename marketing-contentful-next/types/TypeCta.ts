import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeButtonSkeleton } from "./TypeButton";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeCtaFields {
    internalName: EntryFieldTypes.Symbol;
    headline: EntryFieldTypes.RichText;
    subline?: EntryFieldTypes.RichText;
    buttons?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeButtonSkeleton>>;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeCtaSkeleton = EntrySkeletonType<TypeCtaFields, "cta">;
export type TypeCta<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeCtaSkeleton, Modifiers, Locales>;
export type TypeCtaWithoutLinkResolutionResponse = TypeCta<"WITHOUT_LINK_RESOLUTION">;
export type TypeCtaWithoutUnresolvableLinksResponse = TypeCta<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCtaWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeCta<"WITH_ALL_LOCALES", Locales>;
export type TypeCtaWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeCta<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCtaWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeCta<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
