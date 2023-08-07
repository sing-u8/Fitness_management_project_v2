import { Injectable } from '@angular/core'
import { BehaviorSubject, Subscription } from 'rxjs'
import { PaymentCard } from '@schemas/payment/payment-card'
import { Loading } from '@schemas/loading'
import _ from 'lodash'
import { CenterCustomersService } from '@services/center-customers.service'
import { Center } from '@schemas/center'

@Injectable({
    providedIn: 'root',
})
export class PaymentMethodManagementService {
    public cardList$: BehaviorSubject<PaymentCard[]> = new BehaviorSubject<PaymentCard[]>([])
    public cardListLoading$: BehaviorSubject<Loading> = new BehaviorSubject<Loading>('idle')
    public paymentMethodModalVisible$ = new BehaviorSubject<boolean>(false)
    constructor(private centerCustomersService: CenterCustomersService) {}

    setPaymentMethodModalVisible(flag: boolean) {
        this.paymentMethodModalVisible$.next(flag)
    }
    // -----------------------------------------------------------------------------------------------------------

    addPaymentCard(paymentCard: PaymentCard) {
        const cardList = this.cardList$.getValue()
        cardList.unshift(paymentCard)
        this.cardList$.next(cardList)
    }
    removePaymentCard(paymentCard: PaymentCard) {
        const cardList = this.cardList$.getValue()
        _.remove(cardList, (v) => v.id == paymentCard.id)
        this.cardList$.next(cardList)
    }
    setCardSelect(paymentCard: PaymentCard) {
        const cardList = this.cardList$.getValue()
        _.forEach(cardList, (v, idx) => {
            cardList[idx].checked = v.id == paymentCard.id
        })
        this.cardList$.next(cardList)
    }
    initPaymentMethods(centerId: string) {
        this.cardListLoading$.next('pending')
        this.centerCustomersService.getCustomer(centerId).subscribe({
            next: (cards) => {
                this.cardListLoading$.next('done')
                this.cardList$.next(cards)
                // this.initSelectedCard(this.cardList)
                // console.log('initPaymentMethods - ', this.cardList)
            },
            error: (err) => {
                this.cardListLoading$.next('idle')
            },
        })
    }
}
