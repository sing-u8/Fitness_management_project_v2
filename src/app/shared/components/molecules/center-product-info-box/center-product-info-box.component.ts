import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, Output, EventEmitter } from '@angular/core'
import { Center } from '@schemas/center'
import { detectChangesOn } from '@shared/helper/component-helper'
import dayjs from 'dayjs'
import { CenterProductInfo, InfoState } from '@schemas/components/center-product-info/center-product-info'

/*
    ***확인메모***
    - 2023/08/09
    나중에 결제 재시도 API가 있을 때, onRetryPaymentClick event에 자동 결제 재시도 관련 함수 연결 필요
 */
@Component({
    selector: 'rwm-center-product-info-box',
    templateUrl: './center-product-info-box.component.html',
    styleUrls: ['./center-product-info-box.component.scss'],
})
export class CenterProductInfoBoxComponent implements OnChanges, AfterViewInit {
    @Input() center: Center
    @Input() mode: 'tablet' | 'pc' = 'pc'

    @Output() onPurchaseCenterMembershipClick = new EventEmitter()
    // @Output() onPaymentMethodClick = new EventEmitter()
    @Output() onRetryPaymentClick = new EventEmitter()
    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', () => {
            this.getCenterInfo()
        })
    }
    ngAfterViewInit() {
        this.getCenterInfo()
    }

    public state: InfoState = 'normal'
    public productInfoData: Record<Exclude<InfoState, 'normal'>, CenterProductInfo> = {
        freeTrialEndExpected: {
            title: '일 후 무료 체험이 종료돼요.',
            desc: `무료 체험 종료 후에는
                센터에 입장하실 수 없어요.`,
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        freeTrialEndToday: {
            title: '오늘 무료 체험이 종료돼요.',
            desc: `무료 체험 종료 후에는
                센터에 입장하실 수 없어요.`,
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
        },
        expirationExpected: {
            title: '일 후 이용권이 만료돼요.',
            desc: `이용권 만료 후에는
                센터에 입장할 수 없어요.`,
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        expiredToday: {
            title: '오늘 이용권이 만료돼요.',
            desc: `이용권 만료 후에는
                센터에 입장할 수 없어요.`,
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
            day: 0,
        },
        subEndExpected: {
            title: '일 후 이용권이 만료돼요.',
            desc: `자동 결제에 실패했어요. 만료 후
                에는 센터에 입장하실 수 없어요.`,
            btText: '자동 결제 재시도',
            btFn: () => {
                this.onRetryPaymentClick.emit()
                // this.onPaymentMethodClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        subEndToday: {
            title: '오늘 이용권이 만료돼요.',
            desc: `자동 결제에 실패했어요. 만료 후
                에는 센터에 입장하실 수 없어요.`,
            btText: '자동 결제 재시도',
            btFn: () => {
                this.onRetryPaymentClick.emit()
                // this.onPaymentMethodClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
        },
    }
    public curInfoData: CenterProductInfo = {
        title: '',
        desc: ``,
        btText: '',
        btFn: () => {},
        bgColor: 'var(--state-warning-5)',
        borderColor: 'var(--state-warning-100)',
        day: 0,
    }
    getCenterInfo() {
        const dayRemains = dayjs(this.center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        if (this.center.product_code == 'free_trial_membership') {
            if (dayRemains > 14) {
                this.state = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.productInfoData.freeTrialEndExpected.day = dayRemains
                this.curInfoData = this.productInfoData.freeTrialEndExpected
                this.state = 'freeTrialEndExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.freeTrialEndToday
                this.state = 'freeTrialEndToday'
            }
        } else if (this.center.product_code == 'subscription_membership') {
            if (dayRemains > 5) {
                this.state = 'normal'
            } else if (dayRemains <= 5 && dayRemains > 1) {
                this.productInfoData.subEndExpected.day = dayRemains
                this.curInfoData = this.productInfoData.subEndExpected
                this.state = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.subEndToday
                this.state = 'expiredToday'
            }
        } else {
            // 1, 2년 구독
            if (dayRemains > 14) {
                this.state = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.productInfoData.expirationExpected.day = dayRemains
                this.curInfoData = this.productInfoData.expirationExpected
                this.state = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.expiredToday
                this.state = 'expiredToday'
            }
        }
    }
}
