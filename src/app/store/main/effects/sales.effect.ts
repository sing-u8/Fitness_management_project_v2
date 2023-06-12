import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin, iif } from 'rxjs'
import { catchError, switchMap, mergeMap, map, filter, tap, debounceTime } from 'rxjs/operators'

import * as SalesActions from '@store/main/actions/sales.action'
import * as SalesReducer from '@store/main/reducers/sales.reducer'
import * as SalesSelector from '@store/main/selectors/sales.selector'

import {
    CenterStatsService,
    ExportSalesDataReqBody,
    GetStatsProductTypeCode,
    GetStatsSalesTypeCode,
} from '@services/center-stats.service'

import _ from 'lodash'
import { adGetSales, adLoadSales, asGetSales } from '@store/main/actions/sales.action'

@Injectable()
export class SalesEffect {
    constructor(private actions$: Actions, private nxStore: Store, private centerStatApi: CenterStatsService) {}

    public loadStatsSales$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.asLoadSales),
            concatLatestFrom(() => [this.nxStore.select(SalesSelector.filters)]),
            switchMap(([{ centerId }, filters]) =>
                forkJoin([
                    this.centerStatApi.getStatsSales(centerId, filters.date.startDate, filters.date.endDate, {
                        page: 1,
                        pageSize: 10,
                    }),
                    this.centerStatApi.getStatsSalesSummary(centerId),
                ]).pipe(
                    switchMap(([sales, salesSummary]) => {
                        // return []
                        return [SalesActions.adLoadSales({ sales, salesSummary })]
                    }),
                    catchError((error: any) => of(SalesActions.error({ error })))
                )
            )
        )
    )

    public getStatsSales$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.asGetSales),
            concatLatestFrom(() => [this.nxStore.select(SalesSelector.filters)]),
            switchMap(([{ centerId, pageNumber, cb }, filters]) => {
                const reqBody = {
                    type_code: _.join(
                        _.reduce(
                            filters.type_code,
                            (acc, val, key) => {
                                if (filters.type_code[key]) {
                                    acc.push(key)
                                }
                                return acc
                            },
                            []
                        ),
                        ', '
                    ),
                    center_user_name: filters.center_user_name,
                    center_user_phone_number: filters.center_user_phone_number
                        ? _.join(_.split(filters.center_user_phone_number, '-'), '')
                        : '',
                    product_type_code: _.join(
                        _.reduce(
                            filters.product_type_code,
                            (acc, val, key) => {
                                if (filters.product_type_code[key]) {
                                    acc.push(val)
                                }
                                return acc
                            },
                            []
                        ),
                        ', '
                    ),
                    product_name: filters.product_name,
                    responsibility_center_user_name: filters.responsibility_center_user_name,
                    responsibility_center_user_phone_number: filters.responsibility_center_user_phone_number
                        ? _.join(_.split(filters.responsibility_center_user_phone_number, '-'), '')
                        : '',
                    page: pageNumber,
                    pageSize: 10,
                }
                console.log('asGetSales req body ', reqBody)
                return this.centerStatApi
                    .getStatsSales(centerId, filters.date.startDate, filters.date.endDate, reqBody)
                    .pipe(
                        switchMap((sales) => {
                            cb ? cb() : null
                            return [SalesActions.adGetSales({ sales })]
                        }),
                        catchError((error: any) => of(SalesActions.error({ error })))
                    )
            })
        )
    )

    public exportSales$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.asExportSales),
            concatLatestFrom(() => [this.nxStore.select(SalesSelector.filters)]),
            switchMap(([{ centerId, exportType, cb }, filters]) => {
                let reqBody: ExportSalesDataReqBody = undefined
                if (exportType == 'all') {
                    reqBody = {
                        start_date: filters.date.startDate,
                        end_date: filters.date.endDate,
                    }
                } else if (exportType == 'filtered') {
                    reqBody = {
                        start_date: filters.date.startDate,
                        end_date: filters.date.endDate,
                        type_code: _.reduce(
                            filters.type_code,
                            (acc, val, key) => {
                                if (filters.type_code[key]) {
                                    acc.push(key)
                                }
                                return acc
                            },
                            []
                        ),
                        center_user_name: filters.center_user_name,
                        center_user_phone_number: filters.center_user_phone_number,
                        product_type_code: _.reduce(
                            filters.product_type_code,
                            (acc, val, key) => {
                                if (filters.product_type_code[key]) {
                                    acc.push(val)
                                }
                                return acc
                            },
                            []
                        ),
                        product_name: filters.product_name,
                        responsibility_center_user_name: filters.responsibility_center_user_name,
                        responsibility_center_user_phone_number: filters.responsibility_center_user_phone_number,
                    }
                    _.forEach(reqBody, (value, key) => {
                        if (_.isEmpty(value)) {
                            delete reqBody[key]
                        }
                    })
                }

                console.log('asExportSales -- ', reqBody)

                return this.centerStatApi.exportSalesData(centerId, reqBody).pipe(
                    switchMap((res) => {
                        console.log('asExportSales done : ', res)
                        cb ? cb() : null
                        const contentDisposition = res.headers.get('Content-Disposition')
                        const filename = this.getFileName(contentDisposition)
                        const blob = res.body
                        this.downLoadFile(blob, filename)
                        return [SalesActions.adExportSales()]
                    }),
                    catchError((error: any) => {
                        cb ? cb() : null
                        return of(SalesActions.error({ error }))
                    })
                )
            })
        )
    )

    public getFileName(disposition: string): string {
        const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i
        const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i
        let fileName: string = null
        if (utf8FilenameRegex.test(disposition)) {
            fileName = decodeURIComponent(utf8FilenameRegex.exec(disposition)[1])
        } else {
            // prevent ReDos attacks by anchoring the ascii regex to string start and
            //  slicing off everything before 'filename='
            const filenameStart = disposition.toLowerCase().indexOf('filename=')
            if (filenameStart >= 0) {
                const partialDisposition = disposition.slice(filenameStart)
                const matches = asciiFilenameRegex.exec(partialDisposition)
                if (matches != null && matches[2]) {
                    fileName = matches[2]
                }
            }
        }
        return fileName
    }
    downLoadFile(blob, fileName) {
        const anchorElement = document.createElement('a')
        document.body.appendChild(anchorElement)
        anchorElement.style.display = 'none'
        const url = window.URL.createObjectURL(blob)
        anchorElement.href = url
        anchorElement.download = fileName
        anchorElement.click()
        window.URL.revokeObjectURL(url)
        anchorElement.remove()
    }
}
