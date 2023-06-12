import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { Promotion, PromotionCode } from '@schemas/payment/promotion'
import { PaymentCard } from '@schemas/payment/payment-card'

import _ from 'lodash'
import { PaymentHistoryItem } from '@schemas/payment/payment-history-item'
import { ProductCode } from '@schemas/payment/product-code'
import { PaymentHistoryPromotion } from '@schemas/payment/payment-history-promotion'

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/payment`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    // 결제 정보 생성
    createPaymentData(reqBody: CreatePaymentDataReqBody): Observable<{ merchant_uid: string; amount: number }> {
        const url = this.SERVER
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 결제 취소
    refundPaymentData(reqBody: RefundPaymentDataReqBody): Observable<Response> {
        const url = this.SERVER + `/cancel`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 결제 정보 검증 및 저장하기
    validatePaymentDataAndSave(reqBody: ValidatePaymentDataAndSaveReqBody): Observable<{ amount: number }> {
        const url = this.SERVER + `/complete`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 결제 내역 조회   // 결제 내역 스키마 정리 필요
    getPaymentHistory(centerId: string, page?: number, pageSize?: number): Observable<Array<PaymentHistoryItem>> {
        const url =
            this.SERVER +
            `/history?center_id=${centerId}` +
            (page ? `&page=${page}` : '') +
            (pageSize ? `&pageSize=${pageSize}` : '')
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 결제 할인 조회  // 결제 할인 스키마 정리 필요
    getPaymentPromotionHistory(centerId: string, merchantUid: string): Observable<Array<PaymentHistoryPromotion>> {
        const url = this.SERVER + `/history/promotion?center_id=${centerId}&merchant_uid=${merchantUid}`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 상품 조회
    getPaymentProducts() {
        const url = this.SERVER + `/product`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 프로모션 조회
    getPaymentPromotion(centerId: string, productCode: ProductCode): Observable<Array<Promotion>> {
        const url = this.SERVER + `/promotion?center_id=${centerId}&product_code=${productCode}`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    matchPromotionCodeToProductCode(promotionCode: PromotionCode) {
        if (_.includes(promotionCode, '1_years')) {
            return '1_years_membership'
        } else if (_.includes(promotionCode, '2_years')) {
            return '2_years_membership'
        } else if (_.includes(promotionCode, 'lifetime')) {
            return 'lifetime_membership'
        } else {
            return null
        }
    }

    // 프로모션 체크
    checkPaymentPromotion(
        centerId: string,
        productCode: ProductCode,
        promotionCode: PromotionCode,
        centerAddress?: string
    ): Observable<Response> {
        const url =
            this.SERVER +
            `/promotion/check?center_id=${centerId}&product_code=${productCode}&promotion_code=${promotionCode}` +
            (!!centerAddress ? `&center_address=${centerAddress}` : '')
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 구매자에 대해 빌링키 발급 및 저장
    subscribePaymentCustomers(reqBody: SubscribePaymentCustomersReqBody): Observable<PaymentCard> {
        const url = this.SERVER + `/subscribe/customers`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 구매자의 빌링키 정보 조회
    getSubscribedPaymentCustomers(): Observable<PaymentCard[]> {
        const url = this.SERVER + `/subscribe/customers`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 구매자의 빌링키 정보 삭제
    removeSubscribedPaymentCustomers(): Observable<Response> {
        const url = this.SERVER + `/subscribe/customers`
        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    subscribePayments(reqBody: SubscribePayments): Observable<Response> {
        const url = this.SERVER + `/subscribe/payments`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 결제 예약 취소
    cancelSubscribePayments(centerId: string): Observable<Response> {
        const url = this.SERVER + `/subscribe/payments?center_id=${centerId}`
        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 결제 예약 내역 조회
    getSubscribedPayments(
        centerId: string,
        schedule_status: 'scheduled' | 'executed' | 'revoked'
    ): Observable<Array<PaymentHistoryItem>> {
        const url = this.SERVER + `/subscribe/schedule?center_id=${centerId}&schedule_status=${schedule_status}`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}

export interface CreatePaymentDataReqBody {
    center_id: string
    product_code: ProductCode
    amount: number
    promotion?: Array<PromotionReq>
}
export interface PromotionReq {
    promotion_code: PromotionCode
    center_address?: string
}

export interface ValidatePaymentDataAndSaveReqBody {
    imp_uid: string
    merchant_uid: string
}

export interface SubscribePaymentCustomersReqBody {
    card_number: string // "카드번호(dddd-dddd-dddd-dddd)",
    expiry: string // "카드 유효기간(YYYY-MM)",
    birth: string // "생년월일6자리(법인카드의 경우 사업자등록번호10자리)",
    pwd_2digit: string // "카드비밀번호 앞 2자리",
    cvc: string // "카드 뒷면 3자리"
}

export interface RefundPaymentDataReqBody {
    merchant_uid: string
    amount: string
}

export interface SubscribePayments {
    center_id: string
}
