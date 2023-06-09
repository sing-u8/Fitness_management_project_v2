import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { PaymentCard } from '@schemas/payment/payment-card'

@Component({
    selector: 'rwm-payment-card-slide',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-card-slide.component.html',
    styleUrls: ['./payment-card-slide.component.scss'],
})
export class PaymentCardSlideComponent {
    @Input() paymentCards: PaymentCard[] = []
    @Output() onCardRegister = new EventEmitter()
}
