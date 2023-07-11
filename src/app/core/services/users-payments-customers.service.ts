import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { PaymentCard } from '@schemas/payment/payment-card'

@Injectable({
    providedIn: 'root',
})
export class UsersPaymentsCustomersService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    createPaymentCustomer(userId: string, reqBody: CreatePaymentCustomerReqBody): Observable<PaymentCard> {
        const url = this.SERVER + `/${userId}/payments/customers`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getPaymentCustomer(userId: string): Observable<PaymentCard[]> {
        const url = this.SERVER + `/${userId}/payments/customers`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    selectPaymentCustomer(userId: string, customerId: string): Observable<any> {
        const url = this.SERVER + `/${userId}/payments/customers/${customerId}`
        return this.http.put<Response>(url, {}, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
    deletePaymentCustomer(userId: string, customerId: string): Observable<any> {
        const url = this.SERVER + `/${userId}/payments/customers/${customerId}`
        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface CreatePaymentCustomerReqBody {
    card_number: string // "카드번호(dddd-dddd-dddd-dddd)",
    expiry: string // "카드 유효기간(YYYY-MM)",
    birth: string // "생년월일6자리(법인카드의 경우 사업자등록번호10자리)",
    pwd_2digit: string // "카드비밀번호 앞 2자리",
    cvc: string // "카드 뒷면 3자리"
}
