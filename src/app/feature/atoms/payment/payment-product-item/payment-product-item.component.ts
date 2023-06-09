import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PaymentItem } from '@schemas/payment/payment-item'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'rwa-payment-product-item',
    standalone: true,
    templateUrl: './payment-product-item.component.html',
    styleUrls: ['./payment-product-item.component.scss'],
    imports: [SharedModule, CommonModule],
})
export class PaymentProductItemComponent {
    @Input() mode: 'pc' | 'tablet' = 'pc'
    @Input() paymentItem: PaymentItem
    @Input() selected = false
    @Output() selectedChange = new EventEmitter<boolean>()

    @Output() onClick = new EventEmitter<boolean>()
    _onClick() {
        this.selected = !this.selected
        this.selectedChange.emit(this.selected)
        this.onClick.emit(this.selected)
    }
}
