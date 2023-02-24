import { ActionReducer, MetaReducer } from '@ngrx/store'

import { environment } from '@environments/environment'

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    if (environment.production == false) {
        return function (state, action) {
            return reducer(state, action)
        }
    }
    return function (state, action) {
        return reducer(state, action)
    }
}

export const metaReducers: MetaReducer<any>[] = [debug]
