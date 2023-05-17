import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin, iif } from 'rxjs'
import { catchError, switchMap, mergeMap, map, filter, tap, debounceTime } from 'rxjs/operators'

import * as SalesActions from '@store/main/actions/sales.action'
import * as SalesReducer from '@store/main/reducers/sales.reducer'

import { CenterStatsService } from '@services/center-stats.service'

import _ from 'lodash'
import { adLoadSales } from '@store/main/actions/sales.action'

@Injectable()
export class SalesEffect {
    constructor(private actions$: Actions, private nxStore: Store, private centerStatApi: CenterStatsService) {}

    public loadStatsSales$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.asLoadSales),
            switchMap(({ centerId, startDate, endDate, option }) =>
                forkJoin([
                    this.centerStatApi.getStatsSales(centerId, startDate, endDate, option),
                    this.centerStatApi.getStatsSalesSummary(centerId),
                ]).pipe(
                    switchMap(([sales, salesSummary]) => {
                        return [SalesActions.adLoadSales({ sales, salesSummary })]
                    }),
                    catchError((error: any) => of(SalesActions.error({ error })))
                )
            )
        )
    )
}
