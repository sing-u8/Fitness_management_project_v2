import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Center } from '@schemas/center'
import dayjs from 'dayjs'
import _ from 'lodash'
import { PaymentBadgeKey } from '@schemas/payment/payment-badge-state'

export interface CenterChanged {
    center: Center
    type: CenterChangedType
}
export type CenterChangedType = 'change' | 'remove'

export type CenterHeaderStatus = 'normal' | 'needToBuy' | 'invite' | 'subscribeFailed' | 'expired' | 'freeTrialEnd'
export type CenterStatus =
    | 'freeTrial'
    | 'monthSubscription'
    | '1yearSubscription'
    | '2yearSubscription'
    | 'subscriptionFailed'
export type CenterExpiredInfo = { title: string; desc: string[] }

@Injectable({
    providedIn: 'root',
})
export class CenterListItemService {
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
        return dayRemains >= 1 && center.connection_status_code == 'employee_connection_status_connected'
    }

    // -------------------------------------------------------------------------------------------------------------------

    getCenterHeaderState(center: Center, badgeState: PaymentBadgeKey): CenterHeaderStatus {
        const dayRemains = dayjs(center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        if (center.connection_status_code == 'employee_connection_status_pending') {
            return 'invite'
        } else if (center.product_code == 'free_trial_membership') {
            if (badgeState == 'freeTrialEnd') {
                return 'freeTrialEnd'
            } else {
                return 'needToBuy'
            }
        } else if (center.product_code == 'subscription_membership') {
            if (badgeState == 'normal') {
                if (dayRemains <= 5) {
                    return 'subscribeFailed'
                } else {
                    return 'normal'
                }
            } else if (badgeState == 'expirationExpected' || badgeState == 'expiredToday') {
                if (dayRemains <= 5) {
                    return 'subscribeFailed'
                } else {
                    return 'needToBuy'
                }
            } else if (badgeState == 'expired') {
                return 'expired'
            } else {
                //
                return 'normal'
            }
        } else {
            // 1, 2년 구독
            if (badgeState == 'normal') {
                return 'normal'
            } else if (badgeState == 'expirationExpected' || badgeState == 'expiredToday') {
                return 'needToBuy'
            } else if (badgeState == 'expired') {
                return 'expired'
            } else {
                //
                return 'normal'
            }
        }
    }

    // -------------------------------------------------------------------------------------------------------------------
    public readonly freeTrialDetail: CenterExpiredInfo = {
        title: `무료 체험이 종료되어
        센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 무료 체험 기간에 사용한 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '무료 체험 종료 후 30일 내에 이용권을 구매하지 않으면, 해당 센터의 모든 정보가 삭제돼요.',
        ],
    }
    public readonly monthSubDetail: CenterExpiredInfo = {
        title: `사용 중이던 월 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly oneYearSubDetail: CenterExpiredInfo = {
        title: `사용 중이던 1년 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly twoYearSubDetail: CenterExpiredInfo = {
        title: `사용 중이던 2년 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly subFailedDetail: CenterExpiredInfo = {
        title: `결제 도중 오류가 발생하여
            월 이용권 결제에 실패했어요.`,
        desc: [
            '카드 잔액 부족, 카드 정보 오류, 결제 시스템 장애 등으로 결제에 실패했어요. 문제가 계속되면 카드사로 문의해 주시기 바랍니다.',
            '할인을 받는 경우 이용권 기간 내에 결제가 이루어진 경우에만 할인 혜택이 유지되며, 기간 만료 후부터는 할인 혜택이 적용되지 않아요.',
        ],
    }
    getExpiredData(
        center: Center,
        headerState: CenterHeaderStatus
    ): { centerStatus: CenterStatus; centerExpiredInfo: CenterExpiredInfo } {
        let centerStatus: CenterStatus = undefined
        let centerExpiredInfo: CenterExpiredInfo = { title: '', desc: [''] }
        if (headerState == 'subscribeFailed') {
            centerStatus = 'subscriptionFailed'
            centerExpiredInfo = _.cloneDeep(this.subFailedDetail)
        } else if (center.product_code == 'subscription_membership') {
            centerStatus = 'monthSubscription'
            centerExpiredInfo = _.cloneDeep(this.monthSubDetail)
        } else if (center.product_code == '1_years_membership') {
            centerStatus = '1yearSubscription'
            centerExpiredInfo = _.cloneDeep(this.oneYearSubDetail)
        } else if (center.product_code == '2_years_membership') {
            centerStatus = '2yearSubscription'
            centerExpiredInfo = _.cloneDeep(this.twoYearSubDetail)
        } else if (center.product_code == 'free_trial_membership') {
            centerStatus = 'freeTrial'
            centerExpiredInfo = _.cloneDeep(this.freeTrialDetail)
        }

        return { centerStatus, centerExpiredInfo }
    }
}
