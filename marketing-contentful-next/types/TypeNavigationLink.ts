import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNavigationLinkFields {
    internalName: EntryFieldTypes.Symbol;
    name: EntryFieldTypes.Symbol;
    icon?: EntryFieldTypes.Symbol<"ArrowPathIcon" | "ChartPieIcon" | "CursorArrowRaysIcon" | "FingerPrintIcon" | "PhoneIcon" | "PlayCircleIcon" | "SquaresPlusIcon">;
    url: EntryFieldTypes.Symbol;
    links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavigationLinkSkeleton>>;
    description?: EntryFieldTypes.Symbol;
}

export type TypeNavigationLinkSkeleton = EntrySkeletonType<TypeNavigationLinkFields, "navigationLink">;
export type TypeNavigationLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavigationLinkSkeleton, Modifiers, Locales>;
export type TypeNavigationLinkWithoutLinkResolutionResponse = TypeNavigationLink<"WITHOUT_LINK_RESOLUTION">;
export type TypeNavigationLinkWithoutUnresolvableLinksResponse = TypeNavigationLink<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNavigationLinkWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigationLink<"WITH_ALL_LOCALES", Locales>;
export type TypeNavigationLinkWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigationLink<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNavigationLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNavigationLink<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
