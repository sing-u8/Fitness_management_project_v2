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

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private SERVER = `${environment.protocol}${environment.v3SubDomain}${environment.domain}${environment.port}${environment.version}/files`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    uploadFile(reqBody: UploadFileReqBody, files: FileList): Observable<Array<File>> {
        const url = this.SERVER

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json', // 'multipart/form-data'
            }),
        }

        const formData: FormData = new FormData()

        const keys = Object.keys(reqBody)
        keys.forEach((key) => {
            formData.append(key, reqBody[key])
        })

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

    uploadFileWithReport(reqBody: UploadFileReqBody, files: FileList) {
        const url = this.SERVER

        const formData: FormData = new FormData()

        const keys = Object.keys(reqBody)
        keys.forEach((key) => {
            formData.append(key, reqBody[key])
        })

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

    getFile(param: GetFileParam): Observable<Array<File>> {
        const url =
            this.SERVER +
            `/files?type_code=${param.type_code}` +
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
}

export type FileType =
    | 'file_type_user_picture'
    | 'file_type_user_background'
    | 'file_type_center_picture'
    | 'file_type_center_background'
    | 'file_type_center_business_registration'
export interface UploadFileReqBody {
    type_code: FileType
}

export interface GetFileParam {
    type_code: FileType
    page?: number
    pageSize?: number
}
