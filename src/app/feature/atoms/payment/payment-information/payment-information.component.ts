import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { PaymentItem, PaymentItemInfo } from '@schemas/payment/payment-item'

import _ from 'lodash'
import dayjs from 'dayjs'

@Component({
    selector: 'rwa-payment-information',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-information.component.html',
    styleUrls: ['./payment-information.component.scss'],
})
export class PaymentInformationComponent {
    @Input() paymentItemInfo: PaymentItemInfo
    @Input() totalDiscountPrice = 0
    @Input() totalTax = 0
    @Input() totalPay = 0

    @Input() mode: 'pc' | 'tablet' = 'pc'
    constructor() {}
}
