// symbols.ts
import type { ContentfulClientApi } from 'contentful'
import type { InjectionKey } from 'vue'

export const ContentfulKey: InjectionKey<ContentfulClientApi<undefined>> = Symbol('Contentful')
