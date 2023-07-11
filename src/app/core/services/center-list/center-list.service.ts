import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Center } from '@schemas/center'

export interface CenterChanged {
    center: Center
    type: CenterChangedType
}
export type CenterChangedType = 'change' | 'remove'

@Injectable({
    providedIn: 'root',
})
export class CenterListService {
    constructor() {}

    public readonly centerChangeSubject = new Subject<CenterChanged>()
    setChangedCenter(center: Center, type: CenterChangedType) {
        this.centerChangeSubject.next({
            center,
            type,
        })
    }
}
