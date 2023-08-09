import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    Renderer2,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
} from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { CommonModule } from '@angular/common'

import { PaymentCard } from '@schemas/payment/payment-card'
import { CreateCustomerReqBody, CenterCustomersService } from '@services/center-customers.service'

import { ButtonEmit } from '@schemas/components/button'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import _ from 'lodash'
import { Center } from '@schemas/center'

@Component({
    selector: 'rwa-payment-method',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-method.component.html',
    styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() center: Center = undefined
    // @Input() paymentCard: PaymentCard = undefined
    @Output() paymentCardChange = new EventEmitter<PaymentCard>()
    @Input() paymentCardList: PaymentCard[] = []
    @Output() paymentCardListChange = new EventEmitter<PaymentCard[]>()

    public paymentCard: PaymentCard = undefined

    @ViewChild('card_slide') card_slide_el: ElementRef
    public curSlideNumber = 1
    onSlideButtonClick(slide: number) {
        this.renderer.setStyle(this.card_slide_el.nativeElement, 'transform', `translateX(-${(slide - 1) * 270}px)`)
        this.paymentCard = this.paymentCardList.length + 1 == slide ? undefined : this.paymentCardList[slide - 1]
        this.paymentCardChange.emit(this.paymentCard)
    }
    setCardSlide(slide: number) {
        this.renderer.setStyle(this.card_slide_el.nativeElement, 'transform', `translateX(-${(slide - 1) * 270}px)`)
        this.paymentCard = this.paymentCardList.length + 1 == slide ? undefined : this.paymentCardList[slide - 1]
    }
    constructor(private renderer: Renderer2, private centerCustomersService: CenterCustomersService) {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'paymentCardList', (paymentCardList) => {
            if (this.paymentCardList.length > 0) {
                const idx = _.findIndex(this.paymentCardList, (v) => v.checked)
                this.curSlideNumber = idx + 1
                this.setCardSlide(this.curSlideNumber)
            }
        })
    }
    ngAfterViewInit() {
        if (this.paymentCardList.length > 0) {
            const idx = _.findIndex(this.paymentCardList, (v) => v.checked)
            this.curSlideNumber = idx + 1
            this.setCardSlide(this.curSlideNumber)
        }
    }

    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: CreateCustomerReqBody }) {
        res.btLoading.showLoading()
        this.centerCustomersService.createCustomer(this.center.id, res.reqBody).subscribe({
            next: (paymentCard) => {
                this.registerCardData = paymentCard
                this.paymentCardList.unshift(paymentCard)
                this.paymentCardListChange.emit(this.paymentCardList)
                setTimeout(() => {
                    this.onSlideButtonClick(1)
                }, 200)
                // this.onPaymentCardChanged.emit(paymentCard)
                this.isRegisterCardError = false
                res.btLoading.hideLoading()
                this.showRegisterCardModal = false
                this.showRegisterCardResultModal = true

                // console.log('onRegisterCardConfirm -- ', this.registerCardData, this.paymentCardList)
            },
            error: () => {
                this.isRegisterCardError = true
                res.btLoading.hideLoading()
            },
        })
    }

    public showRegisterCardResultModal = false
    public registerCardData: PaymentCard = {
        id: '',
        card_name: '',
        card_number: '',
        checked: true,
    }
}
