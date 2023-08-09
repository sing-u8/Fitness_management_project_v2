import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { PaymentItem, PaymentItemInfo } from '@schemas/payment/payment-item'
import { changesOn, detectChangesOn } from "@shared/helper/component-helper";
import dayjs from 'dayjs'

@Component({
    selector: 'rwa-payment-product-info',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-product-info.component.html',
    styleUrls: ['./payment-product-info.component.scss'],
})
export class PaymentProductInfoComponent implements OnChanges {
    @Input() paymentItem: PaymentItem
    @Input() paymentItemInfo: PaymentItemInfo

    public productDetailOpen = true

    public subscriptionPaymentDate = dayjs().format('YYYY-MM-DD') // 에러 방지용 초기값
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'paymentItemInfo', (v) => {
            this.subscriptionPaymentDate = dayjs(this.paymentItemInfo.period.endDate)
                .subtract(5, 'day')
                .format('YY년 MM월 DD일')
        })
    }
}
