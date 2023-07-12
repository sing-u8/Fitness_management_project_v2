import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '@angular/common'

import { PaymentCard } from '@schemas/payment/payment-card'
import { UsersPaymentsSubscribeService } from '@services/users-payments-subscribe.service'

import { ButtonEmit } from '@schemas/components/button'
import { CreatePaymentCustomerReqBody, UsersPaymentsCustomersService } from '@services/users-payments-customers.service'
import { User } from '@schemas/user'

@Component({
    selector: 'rwa-payment-method',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
    @Input() user: User = undefined
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
    constructor(
        private renderer: Renderer2,
        private usersPaymentsSubscribeApi: UsersPaymentsSubscribeService,
        private usersPaymentsCustomersService: UsersPaymentsCustomersService
    ) {}

    ngOnInit(): void {}

    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: CreatePaymentCustomerReqBody }) {
        res.btLoading.showLoading()
        this.usersPaymentsCustomersService.createPaymentCustomer(this.user.id, res.reqBody).subscribe({
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
