import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { StatsSales, GetStatsSalesReturn } from '@schemas/stats-sales'
import { StatsSalesSummary } from '@schemas/stats-sales-summary'
import { Response } from '@schemas/response'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class CenterStatsService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    /**
     *
     * @param centerId
     * @param reqBody
     */
    exportSalesData(centerId: string, reqBody: ExportSalesDataReqBody): Observable<HttpResponse<Blob>> {
        const url = this.SERVER + `/${centerId}/stats/sales/export`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http
            .post<Blob>(url, reqBody, { ...options, observe: 'response', responseType: 'blob' as 'json' })
            .pipe(catchError(handleError))
    }

    /**
     * @param centerId 'string'
     * @param start_date 'yyyy-MM'
     * @param end_date 'yyyy-MM'
     * @param option getStatsSaleOption
     * @returns
     */
    getStatsSales(
        centerId: string,
        start_date: string,
        end_date: string,
        option?: getStatsSaleOption
    ): Observable<GetStatsSalesReturn> {
        let url = this.SERVER + `/${centerId}/stats/sales` + `?start_date=${start_date}&end_date=${end_date}`
        // +(option.page && option.pageSize ? `&page=${option.page}}&pageSize=${option.page}}` : ``)

        if (!_.isEmpty(option) && _.keys(option).length > 0) {
            _.forIn(option, (v, k) => {
                if (!_.isEmpty(v) || _.isNumber(v)) url += `&${k}=${encodeURIComponent(v)}`
            })
        }

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    /**
     *  @param centerId
     **/
    getStatsSalesSummary(centerId: string): Observable<StatsSalesSummary> {
        const url = this.SERVER + `/${centerId}/stats/sales_summary`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export type ExportSalesDataReqBody = {
    start_date: string
    end_date: string
    type_code?: Array<GetStatsSalesTypeCode>
    center_user_name?: string
    center_user_phone_number?: string
    product_type_code?: Array<GetStatsProductTypeCode>
    product_name?: string
    responsibility_center_user_name?: string
    responsibility_center_user_phone_number?: string
}

export type GetStatsSalesTypeCode = 'payment_type_payment' | 'payment_type_refund' | 'payment_type_transfer'
export type GetStatsProductTypeCode = 'user_membership' | 'user_locker' | 'user_sportswear' // user_sportswear는 아직 API에 없음
export type getStatsSaleOption = {
    type_code?: string //GetStatsSalesTypeCode
    center_user_name?: string
    center_user_phone_number?: string
    product_type_code?: string //GetStatsProductTypeCode
    product_name?: string
    responsibility_center_user_name?: string
    responsibility_center_user_phone_number?: string
    page?: number
    pageSize?: number
}
