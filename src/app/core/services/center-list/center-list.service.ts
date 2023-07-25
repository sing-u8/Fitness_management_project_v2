import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Center } from '@schemas/center'
import dayjs from "dayjs";

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

    isCenterExpired(center: Center) {
        const dayRemains = dayjs(center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        return dayRemains < 1
    }
    isCenterAvailable(center: Center) {
        const dayRemains = dayjs(center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        return dayRemains >= 1 && center.connection_status == 'employee_connection_status_connected'
    }
}
