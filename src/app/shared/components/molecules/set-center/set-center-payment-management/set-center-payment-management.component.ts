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
import { CreatePaymentCustomerReqBody, UsersPaymentsCustomersService } from '@services/users-payments-customers.service'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/loading'
import { PaymentCard } from '@schemas/payment/payment-card'
import { User } from '@schemas/user'
import { ButtonEmit } from '@schemas/components/button'

@Component({
    selector: 'rwm-set-center-payment-management',
    templateUrl: './set-center-payment-management.component.html',
    styleUrls: ['./set-center-payment-management.component.scss'],
})
export class SetCenterPaymentManagementComponent {
    public user: User
    public center: Center
    constructor(
        private usersPaymentsCustomersService: UsersPaymentsCustomersService,
        private centerListService: CenterListService,
        private storageService: StorageService,
        private cd: ChangeDetectorRef,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
        this.center = this.storageService.getCenter()
    }

    // -------------------------------------------------------------------------------------

    public openPaymentMethodManagement = false
    public cardList: PaymentCard[] = []

    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    openRegisterCardModal() {
        this.openPaymentMethodManagement = false
        this.showRegisterCardModal = true
    }
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: CreatePaymentCustomerReqBody }) {
        res.btLoading.showLoading()
        this.usersPaymentsCustomersService.createPaymentCustomer(this.user.id, res.reqBody).subscribe({
            next: (paymentCard) => {
                this.isRegisterCardError = false
                this.showRegisterCardModal = false
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
