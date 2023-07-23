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
import { CenterListService } from '@services/center-list/center-list.service'
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

    constructor(
        private usersCustomersService: UsersCustomersService,
        private centerListService: CenterListService,
        private storageService: StorageService,
        private cd: ChangeDetectorRef,
        private nxStore: Store,
        private router: Router,
        private centerPaymentsService: CenterPaymentsService
    ) {
        this.user = this.storageService.getUser()
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            if (v) {
                this.getPaymentItems()
            }
        })
    }

    // -------------------------------------------------------------------------------------

    public openPaymentMethodManagement = false

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
                    next: (res) => {
                        value.btLoadingFn.hideLoading()
                        this.nxStore.dispatch(showToast({ text: '환불 신청이 완료되었어요.' }))
                        const paymentIdx = _.findIndex(
                            this.paymentItemList,
                            (v) => v.merchant_uid == value.paymentItem.merchant_uid
                        )
                        this.paymentItemList[paymentIdx] = _.cloneDeep({
                            ...this.paymentItemList[paymentIdx],
                            ...{ status: 'cancelled', cancelled_at: dayjs().format('YYYY-MM-DD') },
                        })

                        const centerCopy = _.cloneDeep({
                            ...this.center,
                            ...{ end_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
                        })
                        // 나중에 로직 변경되면 수정 필요
                        this.centerListService.centerChangeSubject.next({
                            center: centerCopy,
                            type: 'change',
                        })
                        this.closeModal.emit()
                        console.log('cancelPayment -- ', res)
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
        // 이후에 수정할 필요 있음
        return !(this.center.next_start_date && this.center.next_end_date)
    }
}
