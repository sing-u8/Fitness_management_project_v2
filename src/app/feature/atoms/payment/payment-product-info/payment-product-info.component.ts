import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { PaymentItem, PaymentItemInfo } from '@schemas/payment/payment-item'

@Component({
    selector: 'rwa-payment-product-info',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-product-info.component.html',
    styleUrls: ['./payment-product-info.component.scss'],
})
export class PaymentProductInfoComponent {
    @Input() paymentItem: PaymentItem
    @Input() paymentItemInfo: PaymentItemInfo

    public productDetailOpen = true
    constructor() {}
}
