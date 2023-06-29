import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { OperatingHours } from '@schemas/operating-hours'

@Injectable({
    providedIn: 'root',
})
export class CenterOperatingHoursService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`
    constructor(private http: HttpClient, private storageService: StorageService) {}

    getCenterOperatingHours(centerId: string): Observable<OperatingHours[]> {
        const url = this.SERVER + `/${centerId}/operating-hours`
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

    updateCenterOperatingHours(centerId: string, reqBody: UpdateCenterOperatingHoursReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/operating-hours`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface UpdateCenterOperatingHoursReqBody {
    operating_hours: OperatingHours[]
}
