import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeButtonFields {
    internalName: EntryFieldTypes.Symbol;
    buttonText: EntryFieldTypes.Symbol;
    eventType?: EntryFieldTypes.Symbol<"identify" | "track">;
    eventName?: EntryFieldTypes.Symbol;
    eventPayload?: EntryFieldTypes.Object;
    variant: EntryFieldTypes.Symbol<"loud" | "primary" | "secondary">;
    slug: EntryFieldTypes.Symbol;
}

export type TypeButtonSkeleton = EntrySkeletonType<TypeButtonFields, "button">;
export type TypeButton<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeButtonSkeleton, Modifiers, Locales>;
export type TypeButtonWithoutLinkResolutionResponse = TypeButton<"WITHOUT_LINK_RESOLUTION">;
export type TypeButtonWithoutUnresolvableLinksResponse = TypeButton<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeButtonWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITH_ALL_LOCALES", Locales>;
export type TypeButtonWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeButtonWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeButton<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
