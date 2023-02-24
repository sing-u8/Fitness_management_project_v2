import { createAction, props } from '@ngrx/store'

const featureKey = '[App/Toast]'

export const showToast = createAction(`${featureKey} Show Toast`, props<{ text: string }>())
export const hideToast = createAction(`${featureKey} Hide Toast`)
