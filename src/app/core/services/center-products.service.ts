import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { Product } from '@schemas/product'
import { Promotion, PromotionCode } from '@schemas/payment/promotion'

@Injectable({
    providedIn: 'root',
})
export class CenterProductsService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    getPromotion(
        centerId: string,
        productCode: string // '1_years_membership' | '2_years_membership'
    ): Observable<Promotion[]> {
        const url = this.SERVER + `/${centerId}/products/${productCode}/promotion`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    checkProductPromotion(
        centerId: string,
        productCode: string, // '1_years_membership' | '2_years_membership',
        promotionCode: PromotionCode,
        centerCode?: string
    ): Observable<any> {
        const url =
            this.SERVER +
            `/${centerId}/products/${productCode}/promotion/${promotionCode}?center_code=${centerCode}` +
            centerCode
                ? `&center_code=${centerCode}`
                : ''
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}
