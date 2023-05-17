import { createAction, props } from '@ngrx/store'

import { GetStatsSalesReturn, StatsSales } from '@schemas/stats-sales'
import { StatsSalesSummary } from '@schemas/stats-sales-summary'

import { getStatsSaleOption } from '@services/center-stats.service'

const FeatureKey = '[Sale]'

// async -- type: asyncStart[as], asyncDone[ad]
export const asLoadSales = createAction(
    `[${FeatureKey}] Async Start Load Sales`,
    props<{
        centerId: string
        startDate: string
        endDate: string
        option?: getStatsSaleOption
    }>()
)
export const adLoadSales = createAction(
    `${FeatureKey} Async Done Load Sales`,
    props<{ sales: GetStatsSalesReturn; salesSummary: StatsSalesSummary }>()
)

// sync

export const error = createAction(`${FeatureKey} Async Done Load Sales`, props<{ error: any }>())
