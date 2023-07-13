import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { Promotion } from '@schemas/payment/promotion'
import { PaymentItemInfoProp } from '@schemas/payment/payment-item'

import { CenterProductsService } from '@services/center-products.service'

import _ from 'lodash'
import { Center } from '@schemas/center'
import { detectChangesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwa-payment-discount-benefit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-discount-benefit.component.html',
    styleUrls: ['./payment-discount-benefit.component.scss'],
})
export class PaymentDiscountBenefitComponent implements OnInit, OnChanges {
    @Input() center: Center
    @Input() promotions: Array<Promotion> = []
    @Input() itemInfo: PaymentItemInfoProp

    @Output() onPromotionChanged = new EventEmitter<Array<Promotion>>()
    public totalDiscountPrice = 0
    constructor(private centerProductsApi: CenterProductsService) {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'promotions', () => {
            this.totalDiscountPrice = this.getDiscountPrice(this.promotions)
        })
    }
    getDiscountPrice(promotions: Promotion[]) {
        return _.reduce(
            promotions,
            (acc, val) => {
                return val.discount_unit_code == 'promotion_discount_unit_percent'
                    ? acc + val.discount_price_for_percent
                    : val.isFriendPromotion && val.friend_event_valid
                    ? acc + val.discount_price_for_money
                    : val.discount_unit_code == 'promotion_discount_unit_won' && !val.isFriendPromotion
                    ? acc + val.discount_price_for_money
                    : acc
            },
            0
        )
    }

    checkFriendPromotion(idx: number) {
        console.log('checkFriendPromotion -- ', this.center, this.itemInfo, this.promotions[idx])
        this.centerProductsApi
            .checkProductPromotion(
                this.center.id,
                this.itemInfo.productCode,
                this.promotions[idx].code,
                this.center.code
            )
            .subscribe({
                next: (res) => {
                    this.promotions[idx].friend_event_error = ''
                    this.promotions[idx].friend_event_valid = true
                    this.totalDiscountPrice = this.getDiscountPrice(this.promotions)
                    this.onPromotionChanged.emit(this.promotions)
                },
                error: (err) => {
                    console.log('checkFriendPromotion -- ', err)
                    if (err.code == 'FUNCTION_CENTER_PRODUCTS_004') {
                        this.promotions[idx].friend_event_error = '이미 참여한 이벤트입니다.'
                    } else if (err.code == 'FUNCTION_CENTER_PRODUCTS_003') {
                        this.promotions[idx].friend_event_error = '존재하지 않는 센터 코드입니다.'
                    } else if (err.code == 'FUNCTION_IAMPORT_PAYMENT_005') {
                        this.promotions[idx].friend_event_error = '본인 센터의 URL 주소는 입력하실 수 없어요.'
                    }
                },
            })
    }
}
