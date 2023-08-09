import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

import { MainTabletHeaderComponent } from '@feature/molecules/main/main-tablet-header/main-tablet-header.component'
import { MainMenuComponent } from '@feature/molecules/main/main-menu/main-menu.component'

import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { CenterPaymentHelperService } from '@services/helper/center-payment-helper.service'
import {
    CenterExpiredInfo,
    CenterHeaderStatus,
    CenterListItemService,
    CenterStatus,
} from '@services/helper/center-list-item.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'

import { User } from '@schemas/user'
import { ViewDrawer } from '@schemas/components/main/ViewDrawer'
import { MainDrawerComponent } from '@feature/templates/main/main-drawer/main-drawer.component'
import { Center } from '@schemas/center'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import _ from 'lodash'
import { PaymentBadge, PaymentBadgeKey } from '@schemas/payment/payment-badge-state'

@Component({
    standalone: true,
    selector: 'rwp-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [
        RouterOutlet,
        CommonModule,
        SharedModule,
        MainTabletHeaderComponent,
        MainMenuComponent,
        MainDrawerComponent,
    ],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
    public user: User
    public center: Center
    public unDescriber$ = new Subject()

    public showPhoneVerifModal = false
    onPhoneVerifModalConfirm() {
        this.showPhoneVerifModal = false
    }

    constructor(
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private centerPaymentHelperService: CenterPaymentHelperService,
        private centerListItemService: CenterListItemService,
        private paymentMethodManagementService: PaymentMethodManagementService,
        public route: Router
    ) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.center = this.storageService.getCenter()
        this.getBadgeState()
        this.getHeaderState()
        this.getDetailModalData()

        this.storageService.userChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe(() => {
            this.user = this.storageService.getUser()
        })
        this.centerListItemService.centerChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe((cc) => {
            if (cc.type == 'change' && cc.center.id == this.center.id) {
                this.storageService.setCenter(cc.center)
                this.center = _.cloneDeep(cc.center)

                this.getBadgeState()
                this.getHeaderState()
                this.getDetailModalData()
            }
        })
        // this.getCenterForTest()
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            if (!this.user.phone_number_verified) {
                this.showPhoneVerifModal = true
                if (!this.user?.sawVerificationPhoneOnce) {
                    this.user['sawVerificationPhoneOnce'] = true
                    this.storageService.setUser(this.user)
                }
            }
        })
    }
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    public showDrawer = false
    public viewDrawer: ViewDrawer = undefined
    onDrawerButtonClick(viewDrawer: ViewDrawer) {
        this.showDrawer = true
        this.viewDrawer = viewDrawer
    }
    onShowDrawerChange(e: { showDrawer: boolean; viewDrawer: ViewDrawer }) {
        this.showDrawer = e.showDrawer
        this.viewDrawer = e.viewDrawer
    }

    routeToPayment() {
        this.route.navigate([`${this.center.name}`, 'payment'])
    }
    openPaymentMethodModal() {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(true)
    }

    // -------------------------------------------------------------------------------------------------------------------
    public badgeState: PaymentBadgeKey = 'normal'
    public badgeStateObj: PaymentBadge = _.cloneDeep(this.centerPaymentHelperService.stateBadge)

    public headerState: CenterHeaderStatus = 'normal'
    getBadgeState() {
        const badgeStatus = this.centerPaymentHelperService.getCenterBadgeStatus(this.center)
        this.badgeState = badgeStatus.paymentBadgeKey
        this.badgeStateObj = badgeStatus.paymentBadge
    }

    getHeaderState() {
        this.headerState = this.centerListItemService.getCenterHeaderState(this.center, this.badgeState)
    }

    public showCenterExpiredModal = false
    public centerExpiredStatus: CenterStatus = undefined
    public centerExpiredInfo: CenterExpiredInfo = undefined
    getDetailModalData() {
        const { centerStatus, centerExpiredInfo } = this.centerListItemService.getExpiredData(
            this.center,
            this.headerState
        )
        this.centerExpiredStatus = centerStatus
        this.centerExpiredInfo = _.cloneDeep(centerExpiredInfo)
        if (this.headerState == 'expired' || this.headerState == 'freeTrialEnd') {
            this.showCenterExpiredModal = true
        }
    }
}
