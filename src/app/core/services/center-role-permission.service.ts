import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { PermissionCategory } from '@schemas/permission-category'
import { PermissionItem } from '@schemas/permission-item'
import { Role } from '@schemas/role-permission'
import { RolePermission } from '@schemas/role-permission'

@Injectable({
    providedIn: 'root',
})
export class CenterRolePermissionService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/center`
    constructor(private http: HttpClient, private storageService: StorageService) {}

    getRolePermission(centerId: string): Observable<Record<Role, RolePermission[]>> {
        const url = this.SERVER + `/${centerId}/role-permission`
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
    updateRolePermission(centerId: string, reqBody: UpdateRolePermissionReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/role-permission`
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

    createRole(centerId: string, reqBody: CreateRoleReqBody): Observable<Role> {
        const url = this.SERVER + `/${centerId}/role`

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
    getRole(centerId: string): Observable<Role[]> {
        const url = this.SERVER + `/${centerId}/role`

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
    updateRole(centerId: string, roleCode: string, reqBody: UpdateRoleReqBody): Observable<Role> {
        const url = this.SERVER + `/${centerId}/role/${roleCode}`

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
    deleteRole(centerId: string, roleCode: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/role/${roleCode}`

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
    getPermission(centerId: string, roleCode: string): Observable<PermissionCategory[]> {
        const url = this.SERVER + `/${centerId}/role/${roleCode}/permission`

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
    updatePermission(
        centerId: string,
        roleCode: string,
        permissionCode: string,
        reqBody: UpdatePermission
    ): Observable<PermissionItem> {
        const url = this.SERVER + `/${centerId}/role/${roleCode}/permission/${permissionCode}`

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
}

export type UpdateRolePermissionReqBody = Record<Role, Array<{ code: string; approved: boolean }>>

export interface CreateRoleReqBody {
    code: string
    name: string
}
export interface UpdateRoleReqBody {
    code?: string
    name?: string
}

export interface UpdatePermission {
    approved: boolean
}
