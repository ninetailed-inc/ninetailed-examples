import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";
import type { TypeFeatureSkeleton } from "./TypeFeature";
import type { TypeHeroSkeleton } from "./TypeHero";
import type { TypeHubspotFormSkeleton } from "./TypeHubspotForm";
import type { TypeNt_experienceSkeleton } from "./TypeNt_experience";
import type { TypePricingTableSkeleton } from "./TypePricingTable";

export interface TypeSectionsGroupFields {
    internalName: EntryFieldTypes.Symbol;
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton | TypeFeatureSkeleton | TypeHeroSkeleton | TypeHubspotFormSkeleton | TypePricingTableSkeleton>>;
    nt_experiences?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNt_experienceSkeleton>>;
}

export type TypeSectionsGroupSkeleton = EntrySkeletonType<TypeSectionsGroupFields, "sectionsGroup">;
export type TypeSectionsGroup<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeSectionsGroupSkeleton, Modifiers, Locales>;
export type TypeSectionsGroupWithoutLinkResolutionResponse = TypeSectionsGroup<"WITHOUT_LINK_RESOLUTION">;
export type TypeSectionsGroupWithoutUnresolvableLinksResponse = TypeSectionsGroup<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeSectionsGroupWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionsGroup<"WITH_ALL_LOCALES", Locales>;
export type TypeSectionsGroupWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionsGroup<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeSectionsGroupWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeSectionsGroup<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
