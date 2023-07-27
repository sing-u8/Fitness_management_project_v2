import { Component, Input, Output, OnInit, Renderer2, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { Router, RouterLink } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { forkJoin, Subject } from 'rxjs'
import { UsersCenterService } from '@services/users-center.service'
import { CenterListItemService } from '@services/helper/center-list-item.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'
import { Loading } from '@schemas/loading'

import _ from 'lodash'

@Component({
    selector: 'rwm-main-menu',
    standalone: true,
    imports: [CommonModule, SharedModule, RouterLink],
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, AfterViewInit, OnDestroy {
    public productOpen = false
    onProductCategClick() {
        if (!this.productOpen) {
            this.smsOpen = false
            this.noticeOpen = false
        }
        this.productOpen = !this.productOpen
    }
    public smsOpen = false
    onSmsCategClick() {
        if (!this.smsOpen) {
            this.productOpen = false
            this.noticeOpen = false
        }
        this.smsOpen = !this.smsOpen
    }
    public noticeOpen = false
    onNoticeCategClick() {
        if (!this.noticeOpen) {
            this.productOpen = false
            this.smsOpen = false
        }
        this.noticeOpen = !this.noticeOpen
    }
    closeCategs() {
        this.smsOpen = false
        this.productOpen = false
        this.noticeOpen = false
    }

    public user: User
    public center: Center

    public showCenterDropdown = false

    public unDescriber$ = new Subject()

    public resizeListener: () => void = undefined

    // vars for html tags
    @Input() mode: 'tablet' | 'pc' = 'pc'
    @Input() showTabletNav = false
    @Output() onShowTabletClose = new EventEmitter()
    onRouteClick() {
        if (this.mode == 'tablet') {
            this.onShowTabletClose.emit()
        }
    }

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        public route: Router,
        private usersCenterService: UsersCenterService,
        private centerListItemService: CenterListItemService,
        private paymentMethodManagementService: PaymentMethodManagementService,
    ) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.center = this.storageService.getCenter()
        // this.centerUser = this.storageService.getCenterUser()

        this.getCenterList()

        this.storageService.userChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe(() => {
            this.user = this.storageService.getUser()
            this.center = this.storageService.getCenter()
            // this.centerUser = this.storageService.getCenterUser()
        })
    }
    ngAfterViewInit() {
        // this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
        //     if (window.innerWidth < 1920) {
        //         if (this.mode == 'tablet') {
        //         } else if (this.mode == 'pc') {
        //             // this.menuWidth = '80px'
        //         }
        //     } else if (window.innerWidth >= 1920) {
        //         if (this.mode == 'tablet') {
        //         } else if (this.mode == 'pc') {
        //             // this.menuWidth = '275px'
        //         }
        //     }
        // })
    }
    ngOnDestroy() {
        // this.resizeListener()
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    isActive(url: string) {
        return this.route.isActive(url, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        })
    }

    routeToRedwhaleHome() {
        this.route.navigate(['redwhale-home'])
    }
    routeToOtherCenter(center: Center) {
        this.storageService.setCenter(center)
        window.open(`${window.location.origin}/${center.name}/main`, '_self')
        // this.route.navigate([`${center.name}`, 'main']).then(() => {
        //     window.location.reload()
        // })
    }
    routeToPayment() {
        this.route.navigate([`${this.center.name}`, 'payment'])
    }
    openPaymentMethodModal() {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(true)
    }

    public showMyInformation = false
    openMyInfoModal() {
        this.showMyInformation = true
    }
    closeMyInfoModal() {
        this.showMyInformation = false
    }

    public centerLoading: Loading = 'idle'
    public originCenterList: Center[] = []
    public centerList: Center[] = []
    public isInvitedCenterExist = false
    public inviteTooltip = { title: '💌 초대 도착' }
    getCenterList() {
        this.centerLoading = 'pending'
        this.usersCenterService.getCenterList(this.user.id).subscribe({
            next: (centerList) => {
                this.originCenterList = centerList
                this.centerList = _.filter(
                    centerList,
                    (v) => this.centerListItemService.isCenterAvailable(v) && this.center.id != v.id
                )
                this.isInvitedCenterExist =
                    _.findIndex(centerList, (v) => v.connection_status == 'employee_connection_status_pending') != -1
                console.log('getCenterList -- main-menu : ', this.centerList, centerList)
                this.centerLoading = 'idle'
            },
            error: (err) => {
                this.centerLoading = 'idle'
            },
        })
    }
}
