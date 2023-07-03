import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { Employee } from '@schemas/employee'

@Injectable({
    providedIn: 'root',
})
export class CenterEmployeeService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`
    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    createEmployee(centerId: string, reqBody: CreateEmployeeReqBody): Observable<Employee> {
        const url = this.SERVER + `/${centerId}/employee`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getEmployee(centerId: string): Observable<{
        owner: Employee[]
        administrator: Employee[]
        instructor: Employee[]
    }> {
        const url = this.SERVER + `/${centerId}/employee`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    updateEmployee(centerId: string, employeeId: string, reqBody: UpdateEmployeeReqBody): Observable<Employee> {
        const url = this.SERVER + `/${centerId}/employee/${employeeId}`
        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    deleteEmployee(centerId: string, employeeId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/employee/${employeeId}`
        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export type RoleCode = 'administrator' | 'instructor'
export type Gender = 'male' | 'female'
export interface CreateEmployeeReqBody {
    role_code: RoleCode
    name: string
    sex?: Gender
    birth_date?: string
    email?: string
    phone_number: string
    memo?: string
    connection: boolean
}

export interface UpdateEmployeeReqBody {
    role_code?: RoleCode
    name?: string
    sex?: Gender
    birth_date?: string
    email?: string
    phone_number?: string
    memo?: string
    connection?: boolean
}
