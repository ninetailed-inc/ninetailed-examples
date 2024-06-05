import { type ContentfulClientApi } from 'contentful'
import type { App } from 'vue'

import { ContentfulKey } from './symbols'

export const VueContentful = {
  install: (app: App, options: { client: ContentfulClientApi<undefined> }) => {
    app.provide(ContentfulKey, options.client)
  }
}
