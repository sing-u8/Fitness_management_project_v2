import { Component, Input, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core'

import { PaymentCard } from '@schemas/payment/payment-card'

@Component({
    selector: 'rwa-payment-card',
    templateUrl: './payment-card.component.html',
    styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit, AfterViewInit {
    @Input() cardData: PaymentCard = {
        id: '',
        card_number: '',
        card_name: '',
        checked: false,
    }
    @Input() showBottom = false
    constructor(private cd: ChangeDetectorRef) {}

    ngOnInit(): void {}
    ngAfterViewInit() {
        this.cd.detectChanges()
    }
}
