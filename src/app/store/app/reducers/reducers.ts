import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'

import { environment } from '@environments/environment'

import { AppStateInterface } from '@schemas/appStore/appState.interface'

import {
    showToast,
    hideToast,
    showModal,
    hideModal,
    setRegistration,
    removeRegistration,
    debugLog,
} from '@store/app/actions/app.actions'

export const appFeatureKey = 'App'

const initialState: AppStateInterface = {
    toast: { visible: false, text: '' },
    registration: {
        service_terms: false,
        privacy: false,
        marketing_email: false,
        marketing_sms: false,
        regCompleted: false,
        name: undefined,
        email: undefined,
        emailValid: false,
        password: undefined,
        passwordValid: false,
    },
    modal: {
        isVisible: false,
        data: {
            title: '',
            desc: '',
            cancel: '',
            confirm: '',
        },
    },
}

export const appReducer = createImmerReducer(
    initialState,
    on(showToast, (state, action): AppStateInterface => {
        state.toast.text = action.text
        state.toast.visible = true
        return state
    }),
    on(hideToast, (state): AppStateInterface => {
        state.toast.visible = false
        return state
    }),
    // ------------------------------------------------------------------------------------//
    on(showModal, (state, action): AppStateInterface => {
        state.modal.isVisible = true
        state.modal.data = action.data
        return state
    }),
    on(hideModal, (state): AppStateInterface => {
        state.modal.isVisible = false
        state.modal.data = undefined
        return state
    }),
    // ------------------------------------------------------------------------------------//
    on(setRegistration, (state, action): AppStateInterface => {
        state.registration = { ...state.registration, ...action.registration }
        return state
    }),
    on(removeRegistration, (state): AppStateInterface => {
        state.registration = {
            service_terms: false,
            privacy: false,
            marketing_email: false,
            marketing_sms: false,
            regCompleted: false,
            name: undefined,
            email: undefined,
            emailValid: false,
            password: undefined,
            passwordValid: false,
        }
        return state
    }),
    // -------------------------------------------------------------------------------------//
    on(debugLog, (state, action): AppStateInterface => {
        if (environment.production == false) {
            console.log('-- debug logger --\n', ...action.log)
        }
        return state
    })
)
