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

import { StorageService } from '@services/storage.service'
import { CenterListService } from '@services/center-list/center-list.service'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/loading'
import { PaymentCard } from '@schemas/payment/payment-card'
import { User } from '@schemas/user'
import { ButtonEmit } from '@schemas/components/button'
import { CreateCustomerReqBody, UsersCustomersService } from '@services/users-customers.service'
import { detectChangesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwm-set-center-payment-management',
    templateUrl: './set-center-payment-management.component.html',
    styleUrls: ['./set-center-payment-management.component.scss'],
})
export class SetCenterPaymentManagementComponent implements OnChanges {
    public user: User

    @Input() center: Center
    @Input() isInit = false
    @Output() isInitChange = new EventEmitter<boolean>()
    @Input() isOpen = false

    constructor(
        private usersCustomersService: UsersCustomersService,
        private centerListService: CenterListService,
        private storageService: StorageService,
        private cd: ChangeDetectorRef,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            if (v && !this.isInit) {
                this.initPaymentMethods()
            }
        })
    }

    initPaymentMethods() {
        this.cardListLoading = 'pending'
        this.usersCustomersService.getCustomer(this.user.id).subscribe({
            next: (cards) => {
                this.cardListLoading = 'idle'
                this.isInit = true
                this.isInitChange.emit(this.isInit)
                this.cardList = cards
                console.log('initPaymentMethods - ', this.cardList)
            },
            error: (err) => {
                this.cardListLoading = 'idle'
            },
        })
    }

    // -------------------------------------------------------------------------------------

    public openPaymentMethodManagement = false

    public cardList: PaymentCard[] = []
    public cardListLoading: Loading = 'idle'

    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    openRegisterCardModal() {
        this.openPaymentMethodManagement = false
        this.showRegisterCardModal = true
    }
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: CreateCustomerReqBody }) {
        res.btLoading.showLoading()
        this.usersCustomersService.createCustomer(this.user.id, res.reqBody).subscribe({
            next: (paymentCard) => {
                console.log('register card : ', paymentCard)
                this.isRegisterCardError = false
                this.showRegisterCardModal = false
                this.openPaymentMethodManagement = true
                res.btLoading.hideLoading()
                this.cardList.unshift(paymentCard)
                this.nxStore.dispatch(showToast({ text: '결제 수단이 추가되었어요.' }))
            },
            error: () => {
                this.isRegisterCardError = true
                res.btLoading.hideLoading()
            },
        })
    }
}
