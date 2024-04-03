// symbols.ts
import type { InjectionKey, ShallowRef } from 'vue'
import type { Ninetailed, ProfileState } from '@ninetailed/experience.js'

export const NinetailedKey: InjectionKey<Ninetailed> = Symbol('Ninetailed')
export const ProfileStateKey: InjectionKey<ShallowRef<ProfileState>> = Symbol('Ninetailed')
