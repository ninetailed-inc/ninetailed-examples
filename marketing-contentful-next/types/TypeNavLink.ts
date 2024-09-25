import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeNavLinkFields {
    internalName: EntryFieldTypes.Symbol;
    name: EntryFieldTypes.Symbol;
    icon?: EntryFieldTypes.Symbol<"ArrowPathIcon" | "ChartPieIcon" | "CursorArrowRaysIcon" | "FingerPrintIcon" | "PhoneIcon" | "PlayCircleIcon" | "SquaresPlusIcon">;
    url: EntryFieldTypes.Symbol;
    links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavLinkSkeleton>>;
    description?: EntryFieldTypes.Symbol;
}

export type TypeNavLinkSkeleton = EntrySkeletonType<TypeNavLinkFields, "navLink">;
export type TypeNavLink<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavLinkSkeleton, Modifiers, Locales>;
export type TypeNavLinkWithoutLinkResolutionResponse = TypeNavLink<"WITHOUT_LINK_RESOLUTION">;
export type TypeNavLinkWithoutUnresolvableLinksResponse = TypeNavLink<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNavLinkWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeNavLink<"WITH_ALL_LOCALES", Locales>;
export type TypeNavLinkWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeNavLink<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNavLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeNavLink<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
