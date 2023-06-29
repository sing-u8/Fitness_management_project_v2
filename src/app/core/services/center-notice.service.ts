import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { Notice } from '@schemas/notice'

@Injectable({
    providedIn: 'root',
})
export class CenterNoticeService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`
    constructor(private http: HttpClient, private storageService: StorageService) {}

    registerNotice(centerId: string, reqBody: RegisterNoticeReqBody): Observable<Notice> {
        const url = this.SERVER + `/${centerId}/notice`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getNotice(centerId: string, page = '', pageSize = ''): Observable<Notice[]> {
        const url =
            this.SERVER +
            `/${centerId}/notice` +
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
    updateNotice(centerId: string, noticeId: string, reqBody: UpdateNoticeReqBody): Observable<Notice> {
        const url = this.SERVER + `/${centerId}/notice/${noticeId}`

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
    deleteNotice(centerId: string, noticeId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/notice/${noticeId}`

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

export interface RegisterNoticeReqBody {
    title: string
    content: string
}

export interface UpdateNoticeReqBody {
    title: string
    content: string
}
