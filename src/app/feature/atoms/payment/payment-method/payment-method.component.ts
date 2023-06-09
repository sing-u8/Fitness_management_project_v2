import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '@angular/common'

import { PaymentCard } from '@schemas/payment/payment-card'
import { PaymentService, SubscribePaymentCustomersReqBody } from '@services/payment.service'

import { ButtonEmit } from '@schemas/components/button'

@Component({
    selector: 'rwa-payment-method',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
    @Input() paymentCard: PaymentCard = undefined
    @Output() registeredPaymentCard = new EventEmitter<PaymentCard>()
    constructor(private paymentApi: PaymentService) {}

    ngOnInit(): void {}

    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: SubscribePaymentCustomersReqBody }) {
        res.btLoading.showLoading()
        this.paymentApi.subscribePaymentCustomers(res.reqBody).subscribe({
            next: (paymentCard) => {
                this.registerCardData = paymentCard
                this.registeredPaymentCard.emit(paymentCard)
                this.isRegisterCardError = false
                res.btLoading.hideLoading()
                this.showRegisterCardModal = false
                this.showRegisterCardResultModal = true
            },
            error: () => {
                this.isRegisterCardError = true
                res.btLoading.hideLoading()
            },
        })
    }

    public showRegisterCardResultModal = false
    public registerCardData: PaymentCard = undefined
}
