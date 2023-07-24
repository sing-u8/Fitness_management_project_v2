import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { ProductCode } from '@schemas/payment/product-code'
import { PaymentPromotion, PromotionCode } from '@schemas/payment/promotion'
import { PaymentHistoryItem } from '@schemas/payment/payment-history-item'
import { Center } from '@schemas/center'
import { ScheduleResult } from '@schemas/schedule-result'

@Injectable({
    providedIn: 'root',
})
export class CenterPaymentsService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    createPayment(centerId: string, reqBody: CreatePaymentReqBody): Observable<CreatePaymentReturn> {
        const url = this.SERVER + `/${centerId}/payments`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    getPaymentHistory(centerId: string, page?: number, pageSize?: number): Observable<PaymentHistoryItem[]> {
        const url =
            this.SERVER +
            `/${centerId}/payments` +
            (page ? `?page=${page}` : '') +
            (pageSize ? `&page_size=${pageSize}` : '')
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    getPaymentPromotion(centerId: string, merchantUid: string): Observable<PaymentPromotion[]> {
        const url = this.SERVER + `/${centerId}/payments/${merchantUid}/promotion`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    cancelPayment(centerId: string, reqBody: CancelPaymentReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/payments/cancel`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 나중에 추가 필요
    createPaymentSubscribe(centerId: string) {
        const url = this.SERVER + `/${centerId}/payments/subscribe`
        return this.http.post<Response>(url, {}, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
    cancelSubscribePayment(centerId: string): Observable<Center> {
        const url = this.SERVER + `/${centerId}/payments/unsubscribe`
        return this.http.post<Response>(url, {}, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    getReservedPayment(centerId: string): Observable<ScheduleResult> {
        const url = this.SERVER + `/${centerId}/payments/schedule`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CreatePaymentReqBody {
    product_code: ProductCode
    amount: number
    promotion?: Array<PromotionReq>
}
export interface PromotionReq {
    promotion_code: PromotionCode
    center_code?: string
}

export interface CreatePaymentReturn {
    merchant_uid: string
    amount: number
}

export interface CancelPaymentReqBody {
    merchant_uid: string
    amount?: number
}
