import { Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'
import { Center } from '@schemas/center'
@Injectable({
    providedIn: 'root',
})
export class SetCenterService {
    public setCenterModalVisible$ = new BehaviorSubject<boolean>(false)
    public center$ = new BehaviorSubject<Center>(undefined)
    constructor() {}
    setCenterModalVisible(flag: boolean) {
        this.setCenterModalVisible$.next(flag)
    }
    // -----------------------------------------------------------------------------------------------------------
    setCenter(center: Center) {
        this.center$.next(center)
    }
}
