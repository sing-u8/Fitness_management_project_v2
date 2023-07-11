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
export class UsersPaymentsSubscribeService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    subscribePayment(userId: string, centerId: string): Observable<any> {
        const url = this.SERVER + `/${userId}/payments/subscribe`
        return this.http
            .post<Response>(
                url,
                {
                    center_id: centerId,
                },
                this.options
            )
            .pipe(
                map((res) => {
                    return res.dataset[0]
                }),
                catchError(handleError)
            )
    }
    cancelSubscribePayment(userId: string, centerId: string): Observable<any> {
        const url = this.SERVER + `/${userId}/payments/subscribe/${centerId}`
        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}
