import { Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'
import { Center } from '@schemas/center'

/*
    센터 설정 모달, 결제 수단 모달 [rwm-set-center-modal, rwm-payment-method-management-modal]의 입력값인
    'center'를 지정하기 위한 용도의 service 파일입니다.

    rwm-set-center-modal, rwm-payment-method-management-modal은 app.component.html에 하나씩 배치되어 있습니다.
 */
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
