import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { Center } from '@schemas/center'

@Injectable({
    providedIn: 'root',
})
export class UsersCenterService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/users`

    constructor(private http: HttpClient) {}

    getCenterList(userId: string, isApp = false, page = '', pageSize = ''): Observable<Array<Center>> {
        const url =
            this.SERVER +
            `/${userId}/center?platform=${isApp ? 'app' : 'web'}` +
            (page ? `&page=${page}` : '') +
            (pageSize ? `&pageSize=${pageSize}` : '')

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    setCenterConnection(userId: string, centerId: string, reqBody: SetCenterConnectionReqBody): Observable<Center> {
        const url = this.SERVER + `/${userId}/center/${centerId}/connection`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    leaveCenter(userId: string, centerId: string): Observable<Response> {
        const url = this.SERVER + `/${userId}/center/${centerId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface SetCenterConnectionReqBody {
    connection: boolean
}
