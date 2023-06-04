import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { paymentItemList } from '@shared/helper/center-payment'
import { PaymentItem } from '@schemas/payment/payment-item'

import _ from 'lodash'
import { ModalInput } from '@schemas/components/modal'

@Component({
    selector: 'rwp-payment',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
    public step: 'one' | 'two' = 'one'
    public paymentItemList: PaymentItem[] = paymentItemList
    public paymentItemSelectedList = [false, false, false]
    onPaymentItemClick(idx: number) {
        _.forEach(this.paymentItemSelectedList, (v, i) => {
            this.paymentItemSelectedList[i] = idx == i
            this.selectedPaymentItem = this.paymentItemList[i]
        })
    }
    public selectedPaymentItem: PaymentItem = undefined

    onNextInTheFirstStep() {
        this.step = 'two'
    }

    public backToStepOneModal = false
    public backToStepOneData: ModalInput = {
        title: '이전 단계로 이동하시겠어요?',
        desc: `이전 단계인 상품 선택 단계로 돌아가면,
                입력한 모든 정보가 초기화돼요.`,
        cancel: '취소',
        confirm: '이동하기',
    }
    onBackToStepOneConfirm() {
        this.backToStepOneModal = false
        this.step = 'one'
        this.paymentItemSelectedList = [false, false, false]
        this.selectedPaymentItem = undefined
    }

    constructor() {}

    protected readonly undefined = undefined
}
