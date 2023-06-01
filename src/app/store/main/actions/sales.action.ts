import { createAction, props } from '@ngrx/store'

import { GetStatsSalesReturn, StatsSales } from '@schemas/stats-sales'
import { StatsSalesSummary } from '@schemas/stats-sales-summary'

import { getStatsSaleOption } from '@services/center-stats.service'
import { FilterMapProductTypeCode, FilterMapTypeCode } from '@store/main/reducers/sales.reducer'

const FeatureKey = '[Sale]'

// async -- type: asyncStart[as], asyncDone[ad]
export const asLoadSales = createAction(`[${FeatureKey}] Async Start Load Sales`, props<{ centerId: string }>())
export const adLoadSales = createAction(
    `${FeatureKey} Async Done Load Sales`,
    props<{ sales: GetStatsSalesReturn; salesSummary: StatsSalesSummary }>()
)

export const asGetSales = createAction(
    `${FeatureKey} Async Start Get Sales`,
    props<{ centerId: string; pageNumber: number; cb?: () => void }>()
)
export const adGetSales = createAction(`${FeatureKey} Async Done Get Sales`, props<{ sales: GetStatsSalesReturn }>())

export const asExportSales = createAction(
    `${FeatureKey} Async Start Export Sales`,
    props<{ centerId: string; exportType: 'filtered' | 'all'; cb?: () => void }>()
)
export const adExportSales = createAction(`${FeatureKey} Async Done Export Sales`)

// sync
export const setDateFilter = createAction(
    `[${FeatureKey}] set date filter`,
    props<{
        date: {
            startDate: string
            endDate: string
        }
    }>()
)
export const setTypeCodeFilter = createAction(
    `[${FeatureKey}] set type code filter`,
    props<{
        typeCode: FilterMapTypeCode
    }>()
)
export const setMemberFilter = createAction(`[${FeatureKey}] set member filter`, props<{ member: string }>())
export const setProductTypeCodeFilter = createAction(
    `[${FeatureKey}] set product type code filter`,
    props<{ productTypeCode: FilterMapProductTypeCode }>()
)
export const setProductNameFilter = createAction(
    `[${FeatureKey}] set product name filter`,
    props<{ productName: string }>()
)
export const setPersonInChargeFilter = createAction(
    `[${FeatureKey}] set person in charge filter`,
    props<{ personInCharge: string; reset?: boolean }>()
)
export const resetFilters = createAction(`[${FeatureKey}] set sales filters`)

export const error = createAction(`${FeatureKey} Sales Error`, props<{ error: any }>())
export const resetAll = createAction(`[${FeatureKey}] Reset All Sales States`)
