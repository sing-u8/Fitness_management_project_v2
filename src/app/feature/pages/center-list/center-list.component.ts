import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { CenterListItemService } from '@services/helper/center-list-item.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'
import { User } from '@schemas/user'
import { Loading } from '@schemas/loading'
import { Center } from '@schemas/center'
import { forkJoin, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import _ from 'lodash'

@Component({
    selector: 'rwp-center-list',
    standalone: true,
    imports: [CommonModule, SharedModule, NgOptimizedImage],
    templateUrl: './center-list.component.html',
    styleUrls: ['./center-list.component.scss'],
})
export class CenterListComponent implements OnInit, OnDestroy {
    public user: User
    public unDescriber$ = new Subject()

    public showCreateCenterModal = false
    onCreatedCenter(center: Center) {
        this.centerList.unshift(center)
    }

    public centerLoading: Loading = 'idle'
    public centerList: Center[] = []

    public selectedCenter: Center = undefined
    public setCenterModalVisible = false
    onSetCenter(center: Center) {
        this.selectedCenter = center
        this.setCenterModalVisible = true
    }

    public paymentMethodModalVisible = false
    setPaymentMethodModalVisible(flag: boolean) {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(flag)
    }

    constructor(
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private centerListService: CenterListItemService,
        private paymentMethodManagementService: PaymentMethodManagementService
    ) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.storageService.userChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe(() => {
            this.user = this.storageService.getUser()
        })
        this.centerListService.centerChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe((cc) => {
            if (cc.type == 'change') {
                this.onCenterChanged(cc.center)
            } else if (cc.type == 'remove') {
                this.onCenterRemoved(cc.center)
            }
        })
        this.paymentMethodManagementService.paymentMethodModalVisible$
            .pipe(takeUntil(this.unDescriber$))
            .subscribe((visible) => {
                this.paymentMethodModalVisible = visible
            })
        this.getCenterList()
    }
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    getCenterList() {
        this.centerLoading = 'pending'
        forkJoin([this.usersCenterService.getCenterList(this.user.id)]).subscribe({
            next: ([centerList]) => {
                this.centerList = centerList
                this.centerLoading = 'idle'
                console.log('center lsit : ', centerList)
            },
            error: (err) => {
                this.centerLoading = 'idle'
            },
        })
    }

    onCenterChanged(center: Center) {
        const curCenterIdx = _.findIndex(this.centerList, (v) => v.id == center.id)
        this.centerList[curCenterIdx] = _.cloneDeep(center)
    }
    onCenterRemoved(center: Center) {
        _.remove(this.centerList, (v) => v.id == center.id)
    }

    // --------------------------------------------------------------------------------------------------

    onAgreeInvite(center: Center) {
        const idx = _.findIndex(this.centerList, (v) => v.id == center.id)
        this.centerList[idx] = center
    }
    onRefuseInvite(center: Center) {
        _.remove(this.centerList, (v) => v.id == center.id)
    }

    // --------------------------------------------------------------------------------------------------

    public showMyInformation = false
    openMyInfoModal() {
        this.showMyInformation = true
    }
    closeMyInfoModal() {
        this.showMyInformation = false
    }
}
