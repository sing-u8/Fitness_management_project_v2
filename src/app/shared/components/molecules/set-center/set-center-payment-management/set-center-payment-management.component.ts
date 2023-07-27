import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core'
import { Center } from '@schemas/center'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { CenterListItemService } from '@services/helper/center-list-item.service'
import { CenterPaymentsService } from '@services/center-payments.service'
import { UsersCustomersService } from '@services/users-customers.service'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/loading'
import { BasePaymentItem } from '@schemas/base-payment-item'
import { User } from '@schemas/user'

import { detectChangesOn } from '@shared/helper/component-helper'
import { OnCancelPayment } from '@shared/components/molecules/center-payment-card/center-payment-card.component'
import { forkJoin } from 'rxjs'

import _ from 'lodash'
import dayjs from 'dayjs'
import { ModalInput } from '@schemas/components/modal'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'

@Component({
    selector: 'rwm-set-center-payment-management',
    templateUrl: './set-center-payment-management.component.html',
    styleUrls: ['./set-center-payment-management.component.scss'],
})
export class SetCenterPaymentManagementComponent implements OnChanges {
    public user: User

    @Input() center: Center
    @Input() isOpen = false

    @Output() closeModal = new EventEmitter()

    public prevCenter: Center

    constructor(
        private usersCustomersService: UsersCustomersService,
        private centerListService: CenterListItemService,
        private storageService: StorageService,
        private cd: ChangeDetectorRef,
        private nxStore: Store,
        private router: Router,
        private centerPaymentsService: CenterPaymentsService,
        private paymentMethodManagementService: PaymentMethodManagementService
    ) {
        this.user = this.storageService.getUser()
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            if (this.isOpen && this.center && this.center.id != this.prevCenter?.id) {
                this.getPaymentItems()
                this.prevCenter = this.center
            }
        })
    }

    // -------------------------------------------------------------------------------------

    // public openPaymentMethodManagement = false
    setPaymentMethodModalVisible(flag: boolean) {
        this.paymentMethodManagementService.setPaymentMethodModalVisible(flag)
    }

    public paymentLoading: Loading = 'idle'
    public paymentItemList: BasePaymentItem[] = []
    getPaymentItems() {
        this.paymentLoading = 'pending'
        forkJoin([
            this.centerPaymentsService.getPaymentHistory(this.center.id),
            this.centerPaymentsService.getReservedPayment(this.center.id),
        ]).subscribe({
            next: ([paymentItemList, reservedPayment]) => {
                this.paymentLoading = 'idle'
                this.paymentItemList = _.reverse(paymentItemList)
                if (_.isObject(reservedPayment)) this.paymentItemList.unshift(reservedPayment)
                console.log('getPaymentItems -- ', this.paymentItemList)
            },
            error: (err) => {
                this.paymentLoading = 'idle'
            },
        })
    }

    onCancelPayment(value: OnCancelPayment) {
        value.btLoadingFn.showLoading()
        if (value.paymentType == 'payment-scheduled') {
            this.centerPaymentsService.cancelSubscribePayment(this.center.id).subscribe({
                next: (center) => {
                    value.btLoadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '이용권이 해지되었어요.' }))
                    this.centerListService.centerChangeSubject.next({
                        center,
                        type: 'change',
                    })
                    //
                    _.remove(this.paymentItemList, (v) => v['schedule_at'])
                    console.log('cancelSubscribePayment -- ', center)
                },
                error: (err) => {
                    value.btLoadingFn.hideLoading()
                },
            })
        } else {
            this.centerPaymentsService
                .cancelPayment(this.center.id, {
                    merchant_uid: value.paymentItem.merchant_uid,
                    amount: value.paymentItem.amount,
                })
                .subscribe({
                    next: (center) => {
                        value.btLoadingFn.hideLoading()
                        this.nxStore.dispatch(showToast({ text: '환불 신청이 완료되었어요.' }))
                        this.centerListService.centerChangeSubject.next({
                            center: center,
                            type: 'change',
                        })
                        this.getPaymentItems()
                        if (dayjs().isAfter(center.end_date)) {
                            this.closeModal.emit()
                        }
                        console.log('cancelPayment -- ', center)
                    },
                    error: (err) => {
                        value.btLoadingFn.hideLoading()
                    },
                })
        }
    }

    // -------------------------------------------------------------------------------------
    goPayment() {
        if (this.checkIsAbleToGoPaymentPage()) {
            this.router.navigate([`${this.center.name}`, 'payment'])
        } else {
            this.showDisableToGoPaymentPageModal = true
        }
    }

    public showDisableToGoPaymentPageModal = false
    public disableToGoPaymentPageModalData: ModalInput = {
        title: '이미 사용 예정인 이용권이 있어요.',
        desc: `새로운 이용권을 구매하기 전에 사용 예정인
                이용권을 해지하거나 환불해 주세요.`,
        confirm: '확인',
    }
    checkIsAbleToGoPaymentPage() {
        return !(this.center.next_start_date && this.center.next_end_date) && !this.center.schedule_at
    }
}
