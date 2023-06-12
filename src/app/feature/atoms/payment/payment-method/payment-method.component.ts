import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core'
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
    @Input() paymentCardList: PaymentCard[] = []
    @Output() registeredPaymentCard = new EventEmitter<PaymentCard>()

    @ViewChild('card_slide') card_slide_el: ElementRef
    public curSlideNumber = 1
    onSlideButtonClick(slide: number) {
        this.renderer.setStyle(this.card_slide_el.nativeElement, 'transform', `translateX(-${(slide - 1) * 270}px)`)
        this.paymentCard = this.paymentCardList.length + 1 == slide ? undefined : this.paymentCardList[slide - 1]
        this.registeredPaymentCard.emit(this.paymentCard)
        console.log('onSlideButtonClick - ', slide, this.paymentCard, this.paymentCardList[slide - 1])
    }
    constructor(private paymentApi: PaymentService, private renderer: Renderer2) {}

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
    protected readonly undefined = undefined
}
