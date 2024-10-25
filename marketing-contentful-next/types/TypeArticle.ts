import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeSeoSkeleton } from "./TypeSeo";

export interface TypeArticleFields {
    internalName: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>;
    title: EntryFieldTypes.Symbol;
    body?: EntryFieldTypes.RichText;
}

export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, "article">;
export type TypeArticle<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticleSkeleton, Modifiers, Locales>;
export type TypeArticleWithoutLinkResolutionResponse = TypeArticle<"WITHOUT_LINK_RESOLUTION">;
export type TypeArticleWithoutUnresolvableLinksResponse = TypeArticle<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeArticleWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITH_ALL_LOCALES", Locales>;
export type TypeArticleWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeArticleWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeArticle<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
