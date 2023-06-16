import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'

import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private SERVER = `${environment.protocol}${environment.v3SubDomain}${environment.domain}${environment.port}${environment.version}/users`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    getUser(userId: string): Observable<User> {
        const url = this.SERVER + `/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                const resData = res.dataset[0]
                resData.birth_date = _.replace(resData.birth_date, /[-]/gi, '.')
                return resData
            }),
            catchError(handleError)
        )
    }

    updateUser(userId: string, requestBody: UpdateUserRequestBody): Observable<User> {
        const url = this.SERVER + `/${userId}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                const resData = res.dataset[0]
                resData.birth_date = _.replace(resData.birth_date, /[-]/gi, '.')
                const user: User = this.storageService.getUser()
                this.storageService.setUser({
                    ...user,
                    name: resData['name'],
                    sex: resData['sex'],
                    birth_date: resData['birth_date'],
                    color: resData['color'],
                    fcm_token: resData['fcm_token'],
                    privacy: resData['privacy'],
                    service_terms: resData['service_terms'],
                    marketing_sms: resData['marketing_sms'],
                    marketing_email: resData['marketing_email'],
                    push_notification: resData['push_notification'],
                })
                return this.storageService.getUser()
            }),
            catchError(handleError)
        )
    }

    deleteUser(userId: string): Observable<Response> {
        const url = this.SERVER + `/${userId}`

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

    checkPassword(userId: string, requestBody: { password: string }): Observable<Response> {
        const url = this.SERVER + `/${userId}/check-password`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    changePassword(userId: string, requestBody: ChangePasswordRequestBody): Observable<Response> {
        const url = this.SERVER + `/${userId}/change-password`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

interface UpdateUserRequestBody {
    name?: string
    sex?: string //'male' | 'female'
    birth_date?: string
    color?: string
    fcm_token?: string
    privacy?: boolean
    service_terms?: boolean
    marketing_sms?: boolean
    marketing_email?: boolean
    push_notification?: boolean
}

interface ChangePasswordRequestBody {
    password: string
    new_password: string
}
