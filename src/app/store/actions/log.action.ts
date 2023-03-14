import { createAction, props } from '@ngrx/store'

const FeatureKey = '[App/Log]'

export const debugLog = createAction(`${FeatureKey} Log For Debug`, props<{ log: Array<any> }>())
