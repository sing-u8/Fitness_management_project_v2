import { createFeatureSelector, createSelector } from '@ngrx/store'

import { AppStateInterface } from '@schemas/appStore/appState.interface'

import { appFeatureKey } from '@appStore/reducers/reducers'

export const appFeatureSelector = createFeatureSelector<AppStateInterface>(appFeatureKey)

export const toastSelector = createSelector(appFeatureSelector, (appState) => appState.toast)
export const registrationSelector = createSelector(appFeatureSelector, (appState) => appState.registration)
export const modalSelector = createSelector(appFeatureSelector, (appState) => appState.modal)
