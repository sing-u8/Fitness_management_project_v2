import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'
import dayjs from 'dayjs'

// schemas
import { Loading } from '@schemas/loading'
import { GetStatsSalesReturnSummary, StatsSales } from '@schemas/stats-sales'

import * as SaleActions from '@store/main/actions/sales.action'

import { GetStatsSalesTypeCode, GetStatsProductTypeCode } from '@services/center-stats.service'
import { StatsSalesSummary, StatsSalesSummaryItem } from '@schemas/stats-sales-summary'

export type FilterMapTypeCode = Record<GetStatsSalesTypeCode, boolean>
export type FilterMapProductTypeCode = Record<GetStatsProductTypeCode, boolean>
export interface FilterMap {
    date: {
        startDate: string // YYYY-MM-DD
        endDate: string // YYYY-MM-DD
    }
    type_code: FilterMapTypeCode
    center_user_name: string
    product_type_code: FilterMapProductTypeCode
    product_name: string
    responsibility_center_user_name: string
    responsibility_center_user_phone_number: string
}
export const FilterMapInit: FilterMap = {
    date: { startDate: null, endDate: null },
    type_code: {
        payment_type_transfer: false,
        payment_type_payment: false,
        payment_type_refund: false,
    },
    center_user_name: null,
    product_type_code: {
        user_locker: false,
        user_membership: false,
        user_sportswear: false,
    },
    product_name: null,
    responsibility_center_user_name: null,
    responsibility_center_user_phone_number: null,
}
export const StatsSalesSummaryItemInit: StatsSalesSummaryItem = {
    card: null,
    cash: null,
    trans: null,
    unpaid: null,
}

export interface State {
    statsSales: Array<StatsSales>
    statsSalesInfo: {
        filterMap: FilterMap
        loading: Loading
        summary: GetStatsSalesReturnSummary
    }
    salesSummaryLoading: Loading
    salesSummary: StatsSalesSummary
}

export const StateInit: State = {
    statsSales: [],
    statsSalesInfo: {
        filterMap: FilterMapInit,
        loading: 'idle',
        summary: {
            rows: null,
            sum_card: null,
            sum_trans: null,
            sum_cash: null,
            sum_unpaid: null,
        },
    },
    salesSummaryLoading: 'idle',
    salesSummary: {
        this_month: StatsSalesSummaryItemInit,
        last_month: StatsSalesSummaryItemInit,
        today: StatsSalesSummaryItemInit,
        yesterday: StatsSalesSummaryItemInit,
    },
}

export const salesReducer = createImmerReducer(
    StateInit,
    on(SaleActions.asLoadSales, (state, action) => {
        state = _.cloneDeep(StateInit)
        state.salesSummaryLoading = 'pending'
        state.statsSalesInfo.loading = 'pending'
        return state
    }),
    on(SaleActions.adLoadSales, (state, action) => {
        console.log('SaleActions.adLoadSales -- ', action)
        state.salesSummaryLoading = 'done'
        state.statsSalesInfo.loading = 'done'
        state.salesSummary = action.salesSummary
        state.statsSalesInfo.summary = action.sales.summary
        state.statsSales = action.sales.dataset
        return state
    })
)
