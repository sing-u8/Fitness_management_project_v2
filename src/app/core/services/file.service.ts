import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'
import { CodeCategory } from '@schemas/code-category'
import { Response } from '@schemas/response'
import { File as _File } from '@schemas/file'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private SERVER = `${environment.protocol}${environment.prodSubDomain}${environment.domain}${environment.port}${environment.version}/files`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    uploadFile(type_code: FileType, files: FileList, centerId = '', centerUserId = ''): Observable<Array<_File>> {
        const url = this.SERVER + `?center_id=${centerId}&type_code=${type_code}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json', // 'multipart/form-data'
            }),
        }

        const formData: FormData = new FormData()

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        return this.http.post<Response>(url, formData, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    uploadFileWithReport(type_code: FileType, files: FileList, centerId = '', centerUserId = '') {
        const url = this.SERVER + `?center_id=${centerId}&type_code=${type_code}`

        const formData: FormData = new FormData()

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        return this.http
            .post<Response>(url, formData, {
                headers: new HttpHeaders({
                    Accept: 'application/json', // 'multipart/form-data'
                }),
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(handleError))
    }

    getFile(param: GetFileParam): Observable<Array<_File>> {
        const url =
            this.SERVER +
            `/files?type_code=${param.type_code}&center_id=${param.center_id}` +
            (param.page ? `&page=${param.page}` : ``) +
            (param.pageSize ? `&pageSize=${param.pageSize}` : ``)

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    deleteFile(location: string): Observable<Response> {
        const url = this.SERVER + `/${encodeURIComponent(location)}`

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

    // helper
    async getUploadedFile(url: string, option?: RequestInit): Promise<Blob> {
        const _option = option ?? {
            method: 'GET',
            mode: 'cors',
            headers: { 'Cache-Control': 'no-cache' },
        }
        return fetch(url, _option).then((res) => {
            return res.blob()
        })
    }

    urlToFile(url: string, filename = 'file', mimeType = '') {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1]
        return fetch(url)
            .then(function (res) {
                return res.arrayBuffer()
            })
            .then(function (buf) {
                return new File([buf], filename, { type: mimeType })
            })
    }

    urlToFileList(url: string, filename = 'file', mimeType = '') {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1]
        return fetch(url)
            .then(function (res) {
                return res.arrayBuffer()
            })
            .then(function (buf) {
                const dt = new DataTransfer()
                dt.items.add(new File([buf], filename, { type: mimeType }))
                return dt.files
            })
    }
    checkFileSizeTooLarge(file: File, limitSize = 300): boolean {
        // unit: mb
        console.log('check file size : ', _.round(file.size / (1024 * 1024), 4), limitSize)
        return _.round(file.size / (1024 * 1024), 4) >= limitSize
    }
}

export type FileType =
    | 'file_type_user_picture'
    | 'file_type_user_background'
    | 'file_type_center_picture'
    | 'file_type_center_background'
    | 'file_type_center_business_registration'
    | 'file_type_center_employee_picture'
    | 'file_type_center_employee_background'
export interface UploadFileReqBody {
    type_code: FileType
}

export interface GetFileParam {
    center_id: string
    type_code: FileType
    page?: number
    pageSize?: number
}
