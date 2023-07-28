import { createAction, props } from '@ngrx/store'
import { ModalInput } from '@schemas/components/modal'
import { Registration } from '@schemas/appStore/registration.interface'

const featureKey = '[App]'

export const debugLog = createAction(`${featureKey} Log For Debug`, props<{ log: Array<any> }>())

export const showModal = createAction(`${featureKey} Show Modal`, props<{ data: ModalInput }>())
export const hideModal = createAction(`${featureKey} Hide Modal`)

export const setRegistration = createAction(`${featureKey} Set Registration`, props<{ registration: Registration }>())
export const removeRegistration = createAction(`${featureKey} Remove Registration`)

export const showToast = createAction(`${featureKey} Show Toast`, props<{ text: string }>())
export const hideToast = createAction(`${featureKey} Hide Toast`)
