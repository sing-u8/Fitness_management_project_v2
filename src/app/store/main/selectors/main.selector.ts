import { createFeatureSelector } from '@ngrx/store'

import * as FromSales from '@store/main/reducers/sales.reducer'

export interface MainState {
    Sales: FromSales.State
}

export const FeatureKey = 'Main'

export const MainFeature = createFeatureSelector<MainState>(FeatureKey)
