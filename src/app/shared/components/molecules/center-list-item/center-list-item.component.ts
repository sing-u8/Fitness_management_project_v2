import { Component, Input, Output, OnChanges, AfterViewInit, SimpleChanges, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { Center } from '@schemas/center'
import dayjs from 'dayjs'
import { detectChangesOn } from '@shared/helper/component-helper'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { CenterPaymentHelperService } from '@services/helper/center-payment-helper.service'
import { CenterExpiredInfo, CenterListItemService, CenterStatus } from '@services/helper/center-list-item.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'

import { User } from '@schemas/user'
import { Loading } from '@schemas/loading'
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/app.actions'
import { PaymentBadgeKey, PaymentBadge } from '@schemas/payment/payment-badge-state'

@Component({
    selector: 'rwm-center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements AfterViewInit, OnChanges {
    @Input() center: Center
    @Output() onSetCenter = new EventEmitter<Center>()

    public user: User

    constructor(
        private router: Router,
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private centerPaymentHelperService: CenterPaymentHelperService,
        private centerListService: CenterListItemService,
        private paymentMethodManagementService: PaymentMethodManagementService,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
    }

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', () => {
            this.getBadgeState()
            this.getHeaderState()
            this.getDetailModalData()
            this.initCenterName()
        })
    }
    ngAfterViewInit() {
        this.getBadgeState()
        this.getHeaderState()
        this.getDetailModalData()
        this.initCenterName()
    }

    goPayment() {
        this.storageService.setCenter(this.center)
        this.router.navigate([`${this.center.name}`, 'payment'])
    }

    goCenter() {
        this.storageService.setCenter(this.center)
        this.router.navigate([`${this.center.name}`, 'main'])
    }

    openPaymentMethodModal() {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(true)
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

    // -------------------------------------------------------------------------------------------------------------------

    public badgeState: PaymentBadgeKey = 'normal'
    public badgeStateObj: PaymentBadge = _.cloneDeep(this.centerPaymentHelperService.stateBadge)

    public headerState: 'normal' | 'needToBuy' | 'invite' | 'subscribeFailed' | 'expired' | 'freeTrialEnd' = 'normal'
    getBadgeState() {
        const badgeStatus = this.centerPaymentHelperService.getCenterBadgeStatus(this.center)
        this.badgeState = badgeStatus.paymentBadgeKey
        this.badgeStateObj = badgeStatus.paymentBadge
    }

    getHeaderState() {
        this.headerState = this.centerListService.getCenterHeaderState(this.center, this.badgeState)
    }

    // -------------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------------
    // detail modal vars and funcs
    public showDetailModal = false
    public detailModalMode: CenterStatus = undefined
    getDetailModalData() {
        const { centerStatus, centerExpiredInfo } = this.centerListService.getExpiredData(this.center, this.headerState)
        this.detailModalMode = centerStatus
        this.detailInfo = _.cloneDeep(centerExpiredInfo)
    }
    public detailInfo: CenterExpiredInfo = undefined
    // -------------------------------------------------------------------------------------------------------------------

    public centerName = ''
    initCenterName() {
        this.centerName = !_.isEmpty(_.trim(this.center.addr_detail))
            ? `(${this.center.zip_no}) ${this.center.road_full_addr}, ${this.center.addr_detail}`
            : `(${this.center.zip_no}) ${this.center.road_full_addr}`
    }
}
