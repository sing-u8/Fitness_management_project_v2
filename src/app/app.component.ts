import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'
import { SetCenterService } from '@services/helper/set-center.service'

// ngrx
import { Store, select } from '@ngrx/store'
import { modalSelector, toastSelector } from '@store/app/selectors/selectors'
import { hideToast } from '@store/app/actions/app.actions'

// schemas
import { Modal } from '@schemas/appStore/modal.interface'
import { Toast } from '@schemas/appStore/toast.interface'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { RouterModule } from '@angular/router'
import { hideModal } from '@store/app/actions/app.actions'
import { Center } from '@schemas/center'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, SharedModule, RouterModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public unSubscriber$ = new Subject<void>()

    public modalState: Modal
    public toastState: Toast

    public selectedCenter: Center = undefined
    public setCenterModalVisible = false

    public paymentMethodModalVisible = false
    setPaymentMethodModalVisible(flag: boolean) {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(flag)
    }

    constructor(
        private nxStore: Store,
        private paymentMethodManagementService: PaymentMethodManagementService,
        private setCenterService: SetCenterService
    ) {
        this.nxStore.pipe(select(modalSelector), takeUntil(this.unSubscriber$)).subscribe((modal) => {
            this.modalState = modal
        })
        this.nxStore.pipe(select(toastSelector), takeUntil(this.unSubscriber$)).subscribe((toast) => {
            this.toastState = toast
        })

        this.setCenterService.center$
            .asObservable()
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((center) => {
                this.selectedCenter = center
            })
        this.setCenterService.setCenterModalVisible$
            .asObservable()
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((visible) => {
                this.setCenterModalVisible = visible
            })
        this.paymentMethodManagementService.paymentMethodModalVisible$
            .asObservable()
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((visible) => {
                this.paymentMethodModalVisible = visible
            })
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    hideToast() {
        this.nxStore.dispatch(hideToast())
    }

    hideModal() {
        this.nxStore.dispatch(hideModal())
    }
}
