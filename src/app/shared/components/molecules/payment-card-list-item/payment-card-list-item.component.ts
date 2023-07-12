import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { PaymentCard } from '@schemas/payment/payment-card'
import { detectChangesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwm-payment-card-list-item',
    templateUrl: './payment-card-list-item.component.html',
    styleUrls: ['./payment-card-list-item.component.scss'],
})
export class PaymentCardListItemComponent implements OnChanges {
    @Input() paymentCard: PaymentCard
    @Output() onClick = new EventEmitter<PaymentCard>()
    constructor() {}

    public cardNumber = '0000'
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'paymentCard', (v) => {
            this.cardNumber = this.paymentCard.card_number.slice(0, 4)
        })
    }

    protected readonly onclick = onclick
}
