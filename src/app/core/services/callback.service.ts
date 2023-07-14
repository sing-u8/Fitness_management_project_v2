import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'

@Injectable({
    providedIn: 'root',
})
export class CallbackService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/callback`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    checkAndSavePayment(reqBody: CheckAndSavePaymentReqBody): Observable<Response> {
        const url = this.SERVER + `/complete`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface CheckAndSavePaymentReqBody {
    imp_uid: string
    merchant_uid: string
}
