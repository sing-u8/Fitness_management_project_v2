import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { PaymentCard } from '@schemas/payment/payment-card'
import { detectChangesOn } from '@shared/helper/component-helper'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
    selector: 'rwm-payment-card-list-item',
    templateUrl: './payment-card-list-item.component.html',
    styleUrls: ['./payment-card-list-item.component.scss'],
})
export class PaymentCardListItemComponent implements OnInit, OnChanges {
    @Input() paymentCard: PaymentCard
    @Output() onRegister = new EventEmitter<PaymentCard>()
    @Output() onRemove = new EventEmitter<PaymentCard>()
    constructor(private deviceDetector: DeviceDetectorService) {}

    public cardNumber = '0000'

    public isDeskTop = false
    ngOnInit() {
        this.isDeskTop = this.deviceDetector.isDesktop()
    }

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'paymentCard', (v) => {
            this.cardNumber = this.paymentCard.card_number.slice(0, 4)
        })
    }
}
