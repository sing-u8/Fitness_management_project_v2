import { createSelector, createFeatureSelector } from '@ngrx/store'

import * as SalesReducer from '@store/main/reducers/sales.reducer'
import { MainFeature } from '@store/main/selectors/main.selector'

export const FeatureKey = 'Sales'

export const SaleState = createSelector(MainFeature, (state) => state[FeatureKey])

// filter
export const filters = createSelector(SaleState, (state) => state.statsSalesInfo.filterMap)
export const dateFilter = createSelector(SaleState, (state) => state.statsSalesInfo.filterMap.date)
export const typeCodeFilter = createSelector(SaleState, (state) => state.statsSalesInfo.filterMap.type_code)
export const memberFilter = createSelector(
    SaleState,
    (state) =>
        state.statsSalesInfo.filterMap.center_user_name ?? state.statsSalesInfo.filterMap.center_user_phone_number
)
export const productTypeCodeFilter = createSelector(
    SaleState,
    (state) => state.statsSalesInfo.filterMap.product_type_code
)
export const productNameFilter = createSelector(SaleState, (state) => state.statsSalesInfo.filterMap.product_name)
export const personInChargeFilter = createSelector(
    SaleState,
    (state) =>
        state.statsSalesInfo.filterMap.responsibility_center_user_name ??
        state.statsSalesInfo.filterMap.responsibility_center_user_phone_number
)

// summary
export const saleSummary = createSelector(SaleState, (state) => state.salesSummary)
export const saleSummaryThisMonth = createSelector(SaleState, (state) => state.salesSummary.this_month)
export const saleSummaryLastMonth = createSelector(SaleState, (state) => state.salesSummary.last_month)
export const saleSummaryToday = createSelector(SaleState, (state) => state.salesSummary.today)
export const saleSummaryYesterday = createSelector(SaleState, (state) => state.salesSummary.yesterday)

// sales
export const sales = createSelector(SaleState, (state) => state.statsSales)

// statsSalesInfo
export const salesInfoSummary = createSelector(SaleState, (state) => state.statsSalesInfo.summary)
export const statsSalesInfoLoading = createSelector(SaleState, (state) => state.statsSalesInfo.loading)
