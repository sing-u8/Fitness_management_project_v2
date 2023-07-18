import { Component, Input, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core'

import { CenterPaymentsService } from '@services/center-payments.service'
import { PaymentHistoryItem } from '@schemas/payment/payment-history-item'

import dayjs from 'dayjs'

@Component({
    selector: 'rwm-center-membership-card',
    templateUrl: './center-membership-card.component.html',
    styleUrls: ['./center-membership-card.component.scss'],
})
export class CenterMembershipCardComponent implements AfterViewInit, OnInit {
    @Input() isLast = false
    @Input() paymentItem: PaymentHistoryItem

    constructor(private centerPaymentApi: CenterPaymentsService, private cd: ChangeDetectorRef) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.initPaymentItemInfo()
        this.cd.detectChanges()
    }

    public showPriceDropdown = false

    // --------------------------------------------------------------------------------------------------
    public membershipName = ''
    initMembershipName() {
        if (this.paymentItem.product_code == '1_years_membership') {
            this.membershipName = '1년 이용권'
        } else if (this.paymentItem.product_code == '2_years_membership') {
            this.membershipName = '2년 이용권'
        } else {
            this.membershipName = '월 이용권'
        }
    }

    public cardName = ''
    initCardName() {
        this.cardName = this.paymentItem.card_name
    }

    initPaymentItemInfo() {
        this.initMembershipName()
        console.log('started at : ', dayjs(this.paymentItem.started_at).format('YYYY MM DD'))
    }
}
