import { Component, Input, Output, OnChanges, AfterViewInit, SimpleChanges, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { Center } from '@schemas/center'
import dayjs from 'dayjs'
import { detectChangesOn } from '@shared/helper/component-helper'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { User } from '@schemas/user'
import { Loading } from '@schemas/loading'
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'

export type DetailInfo = { title: string; desc: string[] }

@Component({
    selector: 'rwm-center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements AfterViewInit, OnChanges {
    @Input() center: Center

    public user: User

    public badgeState:
        | 'normal'
        | 'freeTrialEndToday'
        | 'freeTrialEnd'
        | 'freeTrialEndExpected'
        | 'expirationExpected'
        | 'expired'
        | 'expiredToday' = 'normal' // test용으로 Input으로 설정
    public badgeStateObj = {
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

    public headerState: 'normal' | 'needToBuy' | 'invite' | 'subscribeFailed' | 'expired' | 'freeTrialEnd' = 'normal'

    public setCenterModalVisible = false
    constructor(
        private router: Router,
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
    }

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', () => {
            this.getBadgeState()
            this.getHeaderState()
            this.getDetailModalData()
        })
    }
    ngAfterViewInit() {
        this.getBadgeState()
        this.getHeaderState()
        this.getDetailModalData()
    }

    goCenter() {
        this.storageService.setCenter(this.center)
        this.router.navigate([`${this.center.name}`, 'main'])
    }

    getBadgeState() {
        const dayRemains = dayjs(this.center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        if (this.center.connection_status == 'employee_connection_status_pending') {
            this.badgeState = 'normal'
        } else if (this.center.product_code == 'free_trial_membership') {
            if (dayRemains > 14) {
                this.badgeState = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.badgeStateObj.freeTrialEndExpected.day = dayRemains
                this.badgeState = 'freeTrialEndExpected'
            } else if (dayRemains == 1) {
                this.badgeState = 'freeTrialEndToday'
            } else {
                this.badgeState = 'freeTrialEnd'
            }
        } else if (this.center.product_code == 'subscription_membership') {
            if (dayRemains > 14) {
                this.badgeState = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.badgeStateObj.expirationExpected.day = dayRemains
                this.badgeState = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.badgeState = 'expiredToday'
            } else {
                this.badgeState = 'expired'
            }
        } else {
            // 1, 2년 구독
            if (dayRemains > 14) {
                this.badgeState = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.badgeStateObj.expirationExpected.day = dayRemains
                this.badgeState = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.badgeState = 'expiredToday'
            } else {
                this.badgeState = 'expired'
            }
        }
    }

    getHeaderState() {
        if (this.center.connection_status == 'employee_connection_status_pending') {
            this.headerState = 'invite'
        } else if (this.center.product_code == 'free_trial_membership') {
            if (this.badgeState == 'freeTrialEnd') {
                this.headerState = 'freeTrialEnd'
            } else {
                this.headerState = 'needToBuy'
            }
        } else if (this.center.product_code == 'subscription_membership') {
            if (this.badgeState == 'normal') {
                this.headerState = 'normal'
            } else if (this.badgeState == 'expirationExpected' || this.badgeState == 'expiredToday') {
                const dayRemains = dayjs(this.center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
                if (dayRemains <= 5) {
                    this.headerState = 'subscribeFailed'
                } else {
                    this.headerState = 'needToBuy'
                }
            } else if (this.badgeState == 'expired') {
                this.headerState = 'expired'
            }
        } else {
            // 1, 2년 구독
            if (this.badgeState == 'normal') {
                this.headerState = 'normal'
            } else if (this.badgeState == 'expirationExpected' || this.badgeState == 'expiredToday') {
                this.headerState = 'needToBuy'
            } else if (this.badgeState == 'expired') {
                this.headerState = 'expired'
            }
        }
    }

    // detail modal vars and funcs
    public showDetailModal = false
    public detailModalMode:
        | 'freeTrial'
        | 'monthSubscription'
        | '1yearSubscription'
        | '2yearSubscription'
        | 'subscriptionFailed' = undefined
    getDetailModalData() {
        if (this.headerState == 'subscribeFailed') {
            this.detailModalMode = 'subscriptionFailed'
            this.detailInfo = _.cloneDeep(this.subFailedDetail)
        } else if (this.center.product_code == 'subscription_membership') {
            this.detailModalMode = 'monthSubscription'
            this.detailInfo = _.cloneDeep(this.monthSubDetail)
        } else if (this.center.product_code == '1_years_membership') {
            this.detailModalMode = '1yearSubscription'
            this.detailInfo = _.cloneDeep(this.oneYearSubDetail)
        } else if (this.center.product_code == '2_years_membership') {
            this.detailModalMode = '2yearSubscription'
            this.detailInfo = _.cloneDeep(this.twoYearSubDetail)
        } else if (this.center.product_code == 'free_trial_membership') {
            this.detailModalMode = 'freeTrial'
            this.detailInfo = _.cloneDeep(this.freeTrialDetail)
        }
    }
    public detailInfo: DetailInfo = undefined
    public readonly freeTrialDetail: DetailInfo = {
        title: `무료 체험이 종료되어
        센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 무료 체험 기간에 사용한 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '무료 체험 종료 후 30일 내에 이용권을 구매하지 않으면, 해당 센터의 모든 정보가 삭제돼요.',
        ],
    }
    public readonly monthSubDetail: DetailInfo = {
        title: `사용 중이던 월 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly oneYearSubDetail: DetailInfo = {
        title: `사용 중이던 1년 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly twoYearSubDetail: DetailInfo = {
        title: `사용 중이던 2년 이용권이
            만료되어 센터에 입장하실 수 없어요.`,
        desc: [
            '이용권을 구매하면 사용 중이던 센터 정보를 그대로 이어서 사용할 수 있어요.',
            '이용권을 구매한 센터에 한해 무료로 회원 정보를 이동해 드려요.',
            '직원은 만료된 센터에 입장할 없지만, 회원은 앱을 통해 만료된 센터에 계속 입장할 수 있어요.',
        ],
    }
    public readonly subFailedDetail: DetailInfo = {
        title: `결제 도중 오류가 발생하여
            월 이용권 결제에 실패했어요.`,
        desc: [
            '카드 잔액 부족, 카드 정보 오류, 결제 시스템 장애 등으로 결제에 실패했어요. 문제가 계속되면 카드사로 문의해 주시기 바랍니다.',
            '할인을 받는 경우 이용권 기간 내에 결제가 이루어진 경우에만 할인 혜택이 유지되며, 기간 만료 후부터는 할인 혜택이 적용되지 않아요.',
        ],
    }

    public showAgreeInviteModal = false
    public showRefuseInviteModal = false

    public agreeLoading: Loading = 'idle'

    @Output() onAgreeInvite = new EventEmitter<Center>()
    @Output() onRefuseInvite = new EventEmitter<Center>()
    onAgreeCenter() {
        this.agreeLoading = 'pending'
        this.usersCenterService.setCenterConnection(this.user.id, this.center.id, { connection: true }).subscribe({
            next: (center) => {
                this.agreeLoading = 'idle'
                this.nxStore.dispatch(showToast({ text: '센터의 초대를 수락했어요.' }))
                this.onAgreeInvite.emit(center)
            },
            error: (err) => {
                this.agreeLoading = 'idle'
            },
        })
    }
    onRefuseCenter() {
        this.agreeLoading = 'pending'
        this.usersCenterService.setCenterConnection(this.user.id, this.center.id, { connection: false }).subscribe({
            next: () => {
                this.agreeLoading = 'idle'
                this.nxStore.dispatch(showToast({ text: '센터의 초대를 거절했어요.' }))
                this.onRefuseInvite.emit(this.center)
            },
            error: (err) => {
                this.agreeLoading = 'idle'
            },
        })
    }
}
