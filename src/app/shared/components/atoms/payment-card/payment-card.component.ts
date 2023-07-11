import { Component, Input, OnInit } from '@angular/core'

import { PaymentCard } from '@schemas/payment/payment-card'

@Component({
    selector: 'rwa-payment-card',
    templateUrl: './payment-card.component.html',
    styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {
    @Input() cardData: PaymentCard = {
        id: '',
        card_number: '',
        card_name: '',
        checked: false,
    }
    @Input() showBottom = false
    constructor() {}

    ngOnInit(): void {}
}
