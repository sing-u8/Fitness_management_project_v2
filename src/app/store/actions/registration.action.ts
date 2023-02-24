import { createAction, props } from '@ngrx/store'

import { Registration } from '@schemas/appStore/registration.interface'

const featureKey = '[App/Registration]'

export const setRegistration = createAction(`${featureKey} Set Registration`, props<{ registration: Registration }>())
export const removeRegistration = createAction(`${featureKey} Remove Registration`)
