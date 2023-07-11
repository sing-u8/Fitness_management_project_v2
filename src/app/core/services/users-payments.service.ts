import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { ProductCode } from '@schemas/payment/product-code'
import { PromotionCode } from '@schemas/payment/promotion'
import { PaymentHistoryItem } from '@schemas/payment/payment-history-item'

@Injectable({
    providedIn: 'root',
})
export class UsersPaymentsService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    createPayment(userId: string, reqBody: CreatePaymentReqBody): Observable<CreatePaymentReturn> {
        const url = this.SERVER + `/${userId}/payments`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getPayment(centerId: string, userId: string, page?: number, pageSize?: number): Observable<PaymentHistoryItem[]> {
        const url =
            this.SERVER +
            `/${userId}/payments?center_id=${centerId}` +
            (page ? `&page=${page}` : '') +
            (pageSize ? `&pageSize=${pageSize}` : '')
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    getPaymentPromotion(centerId: string, userId: string, merchantUid: string): Observable<any> {
        const url = this.SERVER + `/${userId}/payments?center_id=${centerId}&merchant_uid=${merchantUid}`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    cancelPayment(userId: string, reqBody: CancelPaymentReqBody): Observable<Response> {
        const url = this.SERVER + `/${userId}/payments`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface CreatePaymentReqBody {
    center_id: string
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
