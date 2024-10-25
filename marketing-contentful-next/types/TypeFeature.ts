import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeButtonSkeleton } from "./TypeButton";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";

export interface TypeFeatureFields {
    internalName?: EntryFieldTypes.Symbol;
    headline: EntryFieldTypes.RichText;
    subline?: EntryFieldTypes.RichText;
    button?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeButtonSkeleton>>;
    image: EntryFieldTypes.AssetLink;
    imagePosition?: EntryFieldTypes.Symbol<"center" | "left" | "right">;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeFeatureSkeleton = EntrySkeletonType<TypeFeatureFields, "feature">;
export type TypeFeature<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFeatureSkeleton, Modifiers, Locales>;
export type TypeFeatureWithoutLinkResolutionResponse = TypeFeature<"WITHOUT_LINK_RESOLUTION">;
export type TypeFeatureWithoutUnresolvableLinksResponse = TypeFeature<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFeatureWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFeature<"WITH_ALL_LOCALES", Locales>;
export type TypeFeatureWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFeature<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFeatureWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFeature<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
