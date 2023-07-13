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

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/loading'
import { PaymentCard } from '@schemas/payment/payment-card'
import { User } from '@schemas/user'
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
        private nxStore: Store,
        private router: Router
    ) {
        this.user = this.storageService.getUser()
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            if (v && !this.isInit) {
            }
        })
    }

    // -------------------------------------------------------------------------------------

    public openPaymentMethodManagement = false

    goPayment() {
        this.router.navigate([`${this.center.name}`, 'payment'])
    }
}
