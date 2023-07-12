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

@Component({
    selector: 'rwm-set-center-payment-management',
    templateUrl: './set-center-payment-management.component.html',
    styleUrls: ['./set-center-payment-management.component.scss'],
})
export class SetCenterPaymentManagementComponent {
    constructor(
        private centerListService: CenterListService,
        private storageService: StorageService,
        private cd: ChangeDetectorRef,
        private nxStore: Store
    ) {}

    // -------------------------------------------------------------------------------------

    public openPaymentMethodManagement = false
}
