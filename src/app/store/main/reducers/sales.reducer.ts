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
import { setDateFilter } from '@store/main/actions/sales.action'

export type FilterMapTypeCode = Record<GetStatsSalesTypeCode, boolean>
export type FilterMapProductTypeCode = Record<GetStatsProductTypeCode, boolean>
export interface FilterMap {
    date: {
        startDate: string // YYYY-MM-DD
        endDate: string // YYYY-MM-DD
    }
    type_code: FilterMapTypeCode
    center_user_name: string
    center_user_phone_number: string
    product_type_code: FilterMapProductTypeCode
    product_name: string
    responsibility_center_user_name: string
    responsibility_center_user_phone_number: string
}
export const FilterMapInit: FilterMap = {
    date: {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    },
    type_code: {
        payment_type_transfer: false,
        payment_type_payment: false,
        payment_type_refund: false,
    },
    center_user_name: undefined,
    center_user_phone_number: undefined,
    product_type_code: {
        user_locker: false,
        user_membership: false,
        user_sportswear: false,
    },
    product_name: undefined,
    responsibility_center_user_name: undefined,
    responsibility_center_user_phone_number: undefined,
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
            rows: 0,
            sum_card: 0,
            sum_trans: 0,
            sum_cash: 0,
            sum_unpaid: 0,
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
    // async
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
    }),
    on(SaleActions.asGetSales, (state, action) => {
        state.statsSalesInfo.loading = 'pending'
        return state
    }),
    on(SaleActions.adGetSales, (state, action) => {
        state.statsSalesInfo.loading = 'done'
        state.statsSalesInfo.summary = action.sales.summary
        state.statsSales = action.sales.dataset
        return state
    }),
    on(SaleActions.asExportSales, (state, action) => {
        return state
    }),
    on(SaleActions.adExportSales, (state, action) => {
        return state
    }),

    // sync
    on(SaleActions.setDateFilter, (state, action) => {
        state.statsSalesInfo.filterMap.date = action.date
        return state
    }),
    on(SaleActions.setTypeCodeFilter, (state, action) => {
        state.statsSalesInfo.filterMap.type_code = action.typeCode
        return state
    }),
    on(SaleActions.setMemberFilter, (state, action) => {
        const phoneNumberReg1 = /\d/
        const phoneNumberReg2 = /^[0-9]{3}-+[0-9]{4}-+[0-9]{4}$/
        if (phoneNumberReg1.test(action.member) || phoneNumberReg2.test(action.member)) {
            state.statsSalesInfo.filterMap.center_user_name = ''
            state.statsSalesInfo.filterMap.center_user_phone_number = action.member
        } else {
            state.statsSalesInfo.filterMap.center_user_name = action.member
            state.statsSalesInfo.filterMap.center_user_phone_number = ''
        }
        return state
    }),
    on(SaleActions.setProductTypeCodeFilter, (state, action) => {
        state.statsSalesInfo.filterMap.product_type_code = action.productTypeCode
        return state
    }),
    on(SaleActions.setProductNameFilter, (state, action) => {
        state.statsSalesInfo.filterMap.product_name = action.productName
        return state
    }),
    on(SaleActions.setPersonInChargeFilter, (state, action) => {
        const phoneNumberReg1 = /\d/
        const phoneNumberReg2 = /^[0-9]{3}-+[0-9]{4}-+[0-9]{4}$/
        // let personInCharge = ''
        // _.forEach(_.split(action.personInCharge, '-'), (v) => {
        //     personInCharge += v
        // })
        if (phoneNumberReg1.test(action.personInCharge) || phoneNumberReg2.test(action.personInCharge)) {
            state.statsSalesInfo.filterMap.responsibility_center_user_phone_number = action.personInCharge
            state.statsSalesInfo.filterMap.responsibility_center_user_name = ''
        } else {
            state.statsSalesInfo.filterMap.responsibility_center_user_phone_number = ''
            state.statsSalesInfo.filterMap.responsibility_center_user_name = action.personInCharge
        }
        return state
    }),
    on(SaleActions.resetFilters, (state, action) => {
        state.statsSalesInfo.filterMap = FilterMapInit
        return state
    })
)
