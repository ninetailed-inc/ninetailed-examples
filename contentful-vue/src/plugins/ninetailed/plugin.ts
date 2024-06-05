import { shallowRef } from 'vue'
import { Ninetailed } from '@ninetailed/experience.js'
import type { NinetailedPlugin } from '@ninetailed/experience.js-plugin-analytics'

import type {
  Profile,
  Locale,
  OnErrorHandler,
  OnLogHandler,
  NinetailedRequestContext
} from '@ninetailed/experience.js-shared'
import type { Storage } from '@ninetailed/experience.js'
import type { App } from 'vue'

import { NinetailedKey, ProfileStateKey } from './symbols'

type NinetailedInstantiationOptions = {
  clientId: string
  environment?: string
  preview?: boolean
  url?: string
  plugins?: (NinetailedPlugin | NinetailedPlugin[])[]
  profile?: Profile
  locale?: Locale
  requestTimeout?: number
  onLog?: OnLogHandler
  onError?: OnErrorHandler
  componentViewTrackingThreshold?: number
  buildClientContext?: () => NinetailedRequestContext
  storageImpl?: Storage
}

export const VueNinetailed = {
  install: (app: App, options: NinetailedInstantiationOptions) => {
    const {
      clientId,
      environment,
      preview,
      url,
      locale,
      requestTimeout,
      plugins = [],
      onLog,
      onError,
      buildClientContext,
      componentViewTrackingThreshold,
      storageImpl
    } = options

    const ninetailed = new Ninetailed(
      { clientId, environment, preview },
      {
        url,
        plugins,
        locale,
        requestTimeout,
        onLog,
        onError,
        buildClientContext,
        componentViewTrackingThreshold,
        storageImpl
      }
    )

    const profileState = shallowRef(ninetailed.profileState)

    ninetailed.onProfileChange((newProfileState) => {
      profileState.value = newProfileState
    })

    app.provide(NinetailedKey, ninetailed)
    app.provide(ProfileStateKey, profileState)
  }
}
