import { createAction, props } from '@ngrx/store'
import { ModalData, Permission } from '@schemas/appStore/modal.interface'

export const featureKey = `[App/Modal]`

export const showModal = createAction(`${featureKey} Show Modal`, props<{ data: ModalData }>())
export const hideModal = createAction(`${featureKey} Hide Modal`)
