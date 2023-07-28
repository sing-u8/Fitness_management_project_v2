import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'
import { Product } from '@schemas/product'
import { Promotion, PromotionCode } from '@schemas/payment/promotion'
import { ProductCategory, ProductCategoryCode } from '@schemas/product-category'

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/products-categories`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    getProductCategory(): Observable<ProductCategory[]> {
        const url = this.SERVER
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    getProduct(categoryCode: ProductCategoryCode): Observable<Product[]> {
        const url = this.SERVER + `/${categoryCode}/products`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 밑에 코드 삭제 필요
    getProductPromotion(
        centerId: string,
        productCode: string // '1_years_membership' | '2_years_membership'
    ): Observable<Promotion[]> {
        const url = this.SERVER + `/promotion?center_id=${centerId}&product_code=${productCode}`
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
            `/check-promotion?center_id=${centerId}&product_code=${productCode}&promotion_code=${promotionCode}` +
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
