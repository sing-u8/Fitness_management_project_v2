import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'
import { CodeCategory } from '@schemas/code-category'
import { Response } from '@schemas/response'
import _ from 'lodash'
import { Code } from '@schemas/code'

@Injectable({
    providedIn: 'root',
})
export class CodeService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/code-categories`
    constructor(
        private http: HttpClient,
        private storageService: StorageService // private WsChat: WsChatService
    ) {}

    getCodeCategory(): Observable<CodeCategory[]> {
        const url = this.SERVER

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

    getCodeCategoryItem(categoryCode: string): Observable<Code> {
        const url = this.SERVER + `/${categoryCode}/code`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}
