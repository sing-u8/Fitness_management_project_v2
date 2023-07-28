import { Injectable } from '@angular/core'
import { PaymentBadge, PaymentBadgeKey } from '@schemas/payment/payment-badge-state'
import { Center } from '@schemas/center'
import dayjs from 'dayjs'
import _ from 'lodash'
import { BasePaymentItem } from '@schemas/base-payment-item'

@Injectable({
    providedIn: 'root',
})
export class CenterPaymentHelperService {
    constructor() {}

    public readonly stateBadge: PaymentBadge = {
        normal: {
            bgColor: '',
            color: '',
            text: '',
        },
        freeTrialEndToday: {
            bgColor: 'var(--state-error-5)',
            color: 'var(--state-error-100)',
            text: '⏱ 오늘 무료 체험이 종료돼요!',
        },
        freeTrialEnd: {
            bgColor: 'var(--gray-50)',
            color: 'var(--font-color)',
            text: '체험 종료',
        },
        freeTrialEndExpected: {
            bgColor: 'var(--state-warning-5)',
            color: 'var(--state-warning-100)',
            text1: '⏱ 체험 종료 ',
            text2: '일 전',
            day: 14,
        },
        expirationExpected: {
            bgColor: 'var(--state-warning-5)',
            color: 'var(--state-warning-100)',
            text1: '⏱ 만료 ',
            text2: '일 전',
            day: 10,
        },
        expired: {
            bgColor: 'var(--gray-50)',
            color: 'var(--font-color)',
            text: '이용권 만료',
        },
        expiredToday: {
            bgColor: 'var(--state-error-5)',
            color: 'var(--state-error-100)',
            text: '⏱ 오늘 이용권이 만료돼요!',
        },
    }

    getCenterBadgeStatus(center: Center): { paymentBadgeKey: PaymentBadgeKey; paymentBadge: PaymentBadge } {
        let paymentBadgeKey: PaymentBadgeKey = 'normal'
        const paymentBadge: PaymentBadge = _.cloneDeep(this.stateBadge)

        const dayRemains = dayjs(center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        if (center.connection_status_code == 'employee_connection_status_pending') {
            paymentBadgeKey = 'normal'
        } else if (center.product_code == 'free_trial_membership') {
            if (dayRemains > 14) {
                paymentBadgeKey = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                paymentBadge.freeTrialEndExpected.day = dayRemains
                paymentBadgeKey = 'freeTrialEndExpected'
            } else if (dayRemains == 1) {
                paymentBadgeKey = 'freeTrialEndToday'
            } else {
                paymentBadgeKey = 'freeTrialEnd'
            }
        } else if (center.product_code == 'subscription_membership') {
            if (dayRemains > 14 || (dayRemains <= 14 && !_.isEmpty(center.next_start_date))) {
                paymentBadgeKey = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                paymentBadge.expirationExpected.day = dayRemains
                paymentBadgeKey = 'expirationExpected'
            } else if (dayRemains == 1) {
                paymentBadgeKey = 'expiredToday'
            } else {
                paymentBadgeKey = 'expired'
            }
        } else {
            // 1, 2년 구독
            if (dayRemains > 14) {
                paymentBadgeKey = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                paymentBadge.expirationExpected.day = dayRemains
                paymentBadgeKey = 'expirationExpected'
            } else if (dayRemains == 1) {
                paymentBadgeKey = 'expiredToday'
            } else {
                paymentBadgeKey = 'expired'
            }
        }

        return {
            paymentBadgeKey,
            paymentBadge,
        }
    }

    getCenterPaymentCardBadge(paymentCard: BasePaymentItem) {
        let paymentBadgeKey: PaymentBadgeKey = 'normal'
        const paymentBadge: PaymentBadge = _.cloneDeep(this.stateBadge)

        const dayRemains = dayjs(paymentCard.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1

        if (paymentCard.product_code == 'subscription_membership') {
            if (dayRemains > 14) {
                paymentBadgeKey = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                paymentBadge.expirationExpected.day = dayRemains
                paymentBadgeKey = 'expirationExpected'
            } else if (dayRemains == 1) {
                paymentBadgeKey = 'expiredToday'
            } else {
                paymentBadgeKey = 'expired'
            }
        } else {
            // 1, 2년 구독
            if (dayRemains > 14) {
                paymentBadgeKey = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                paymentBadge.expirationExpected.day = dayRemains
                paymentBadgeKey = 'expirationExpected'
            } else if (dayRemains == 1) {
                paymentBadgeKey = 'expiredToday'
            } else {
                paymentBadgeKey = 'expired'
            }
        }
        return {
            paymentBadgeKey,
            paymentBadge,
        }
    }
}
