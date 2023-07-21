import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core'

import { CenterPaymentsService } from '@services/center-payments.service'
import { CenterPaymentHelperService } from '@services/helper/center-payment-helper.service'

import { Loading } from '@schemas/loading'
import { Center } from '@schemas/center'
import { PaymentPromotion } from '@schemas/payment/promotion'
import { BasePaymentItem } from '@schemas/base-payment-item'
import { PaymentBadge, PaymentBadgeKey } from '@schemas/payment/payment-badge-state'

import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

export interface OnCancelPayment {
    paymentItem: BasePaymentItem //  PaymentHistoryItem
    btLoadingFn: {
        showLoading: () => void
        hideLoading: () => void
    }
}

@Component({
    selector: 'rwm-center-payment-card',
    templateUrl: './center-payment-card.component.html',
    styleUrls: ['./center-payment-card.component.scss'],
})
export class CenterPaymentCardComponent implements AfterViewInit, OnInit {
    @Input() isLast = false
    @Input() paymentItem: BasePaymentItem // PaymentHistoryItem
    @Input() center: Center

    @Output() onCancelPayment = new EventEmitter<OnCancelPayment>()

    @ViewChild('caret_down_icon') caret_down_icon_el: ElementRef
    @ViewChild('l_tooltip') l_tooltip_el: ElementRef
    setTooltipPos() {
        const iconPos = this.caret_down_icon_el.nativeElement.getBoundingClientRect()
        if (this.isLast) {
            this.renderer.setStyle(this.l_tooltip_el.nativeElement, 'left', `calc(${iconPos.x}px - 102.5px)`)
            this.renderer.setStyle(
                this.l_tooltip_el.nativeElement,
                'bottom',
                `calc(${window.innerHeight}px - ${iconPos.y}px + 6px)`
            )
        } else {
            this.renderer.setStyle(this.l_tooltip_el.nativeElement, 'left', `calc(${iconPos.x}px - 102.5px)`)
            this.renderer.setStyle(this.l_tooltip_el.nativeElement, 'top', `calc(${iconPos.y}px + 30px)`)
        }
    }

    public badgeState: PaymentBadgeKey = 'normal'
    public badgeStateObj: PaymentBadge = _.cloneDeep(this.centerPaymentHelperService.stateBadge)
    getBadgeState() {
        const badgeStatus = this.centerPaymentHelperService.getCenterPaymentCardBadge(this.paymentItem)
        this.badgeState = badgeStatus.paymentBadgeKey
        this.badgeStateObj = badgeStatus.paymentBadge
    }

    constructor(
        private centerPaymentApi: CenterPaymentsService,
        private centerPaymentHelperService: CenterPaymentHelperService,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.initPaymentItemInfo()
        this.getBadgeState()
        this.initPaidDateText()
        this.initPriceText()
        this.initPaymentMethodText()
    }

    ngAfterViewInit() {
        this.cd.detectChanges()
    }

    // --------------------------------------------------------------------------------------------------
    public paidDateText = '결제일'
    public priceText = '결제 금액'
    public paymentMethodText = '결제 수단'
    initPaidDateText() {
        if (this.paymentItem['status'] == 'paid') {
            this.paidDateText = '결제일'
        } else if (this.paymentItem['status'] == 'cancelled') {
            this.paidDateText = '환불 신청일'
        } else if (this.paymentItem['schedule_at']) {
            this.paidDateText = '결제 예정일'
        }
    }
    initPriceText() {
        if (this.paymentItem['status'] == 'paid' || this.paymentItem['schedule_at']) {
            this.priceText = '결제 금액'
        } else {
            this.priceText = '환불 수단'
        }
    }
    initPaymentMethodText() {
        if (this.paymentItem['status'] == 'paid' || this.paymentItem['schedule_at']) {
            this.paymentMethodText = '결제 수단'
        } else {
            this.paymentMethodText = '환불 금액'
        }
    }

    // --------------------------------------------------------------------------------------------------
    public showTag = false

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

    public isPromotionInit = false
    public promotionLoading: Loading = 'idle'
    public promotionData: PaymentPromotion[] = []
    public totalDiscount = 0
    getPaymentPromotion() {
        if (this.isPromotionInit) return
        this.isPromotionInit = true
        this.promotionLoading = 'pending'
        this.centerPaymentApi.getPaymentPromotion(this.center.id, this.paymentItem.merchant_uid).subscribe({
            next: (res) => {
                console.log('getPaymentPromotion : ', res)
                this.totalDiscount = 0
                this.promotionData = _.map(res, (v) => {
                    v.fe_title = v.product_code == 'subscription_membership' ? `${v.title} (${v.count}회차)` : v.title
                    this.totalDiscount += v.discount
                    return v
                })
                this.promotionLoading = 'idle'
            },
            error: (err) => {
                this.isPromotionInit = false
                this.promotionLoading = 'idle'
            },
        })
    }

    public cardNumber = ''
    initCardNumber() {
        this.cardNumber = `(${this.paymentItem.card_number.slice(0, 4)})`
    }

    public buttonText = ''
    public buttonLoading: Loading = 'idle'
    public cancelModalButtonLoading: Loading = 'idle'
    showButtonLoading() {
        this.cancelModalButtonLoading = 'pending'
    }
    hideButtonLoading() {
        this.cancelModalButtonLoading = 'idle'
    }
    initButtonText() {
        if (this.paymentItem.product_code == 'subscription_membership') {
            this.buttonText = '해지'
        } else {
            this.buttonText = '환불'
        }
    }
    onCancelPaymentButtonClick() {
        this.onCancelPayment.emit({
            paymentItem: this.paymentItem,
            btLoadingFn: {
                showLoading: () => {
                    this.showButtonLoading()
                },
                hideLoading: () => {
                    this.hideButtonLoading()
                    this.showCancelPaymentModal = false
                },
            },
        })
    }

    public tax = 0
    getTax() {
        this.tax = this.paymentItem.amount - _.round(this.paymentItem.amount / 1.1)
    }

    public showCancelPaymentButton = true
    checkShowCancelPaymentButton() {
        if (
            this.paymentItem.product_code == 'subscription_membership' &&
            dayjs().isSameOrBefore(dayjs(this.paymentItem.start_date).add(6, 'day'))
        ) {
            this.showCancelPaymentButton = true
        } else if (
            this.paymentItem.product_code != 'subscription_membership' &&
            dayjs().isSameOrBefore(dayjs(this.paymentItem.start_date).add(29, 'day'))
        ) {
            this.showCancelPaymentButton = true
        }
        this.showCancelPaymentButton = false
    }

    initPaymentItemInfo() {
        this.initMembershipName()
        this.initCardNumber()
        this.initButtonText()
        this.getTax()
        this.checkShowCancelPaymentButton()
    }

    // --------------------------------------------------------------------------------------------------------------

    public showCancelPaymentModal = false
    openCancelPaymentModal() {
        const innerFn = () => {
            this.showCancelPaymentModal = true
            this.cancelDesc =
                this.paymentItem.product_code == 'subscription_membership'
                    ? this.cancelSubscriptionDesc
                    : this.cancelMembershipDesc
        }
        if (
            this.paymentItem.product_price != this.paymentItem.amount &&
            this.promotionData &&
            this.promotionData.length == 0
        ) {
            this.buttonLoading = 'pending'
            this.totalDiscount = 0
            this.centerPaymentApi.getPaymentPromotion(this.center.id, this.paymentItem.merchant_uid).subscribe({
                next: (res) => {
                    this.promotionData = _.map(res, (v) => {
                        v.fe_title =
                            v.product_code == 'subscription_membership' ? `${v.title} (${v.count}회차)` : v.title
                        this.totalDiscount += v.discount
                        return v
                    })
                    this.buttonLoading = 'idle'
                    this.isPromotionInit = true
                    innerFn()
                },
                error: (err) => {
                    this.buttonLoading = 'idle'
                },
            })
        } else {
            innerFn()
        }
    }

    public readonly cancelSubscriptionDesc = [
        '환불 신청과 동시에 센터에 입장하실 수 없으며, 카드사 영업일 기준 약 2~3일 후 환불이 완료될 예정이에요.',
        '할인을 받고 있는 경우, 환불 후 이용권을 재구매하더라도 더 이상 할인 혜택이 적용되지 않아요.',
        '직원은 환불된 센터에 입장할 수 없지만, 회원은 앱을 통해 환불된 센터에 계속 입장할 수 있어요.',
    ]
    public readonly cancelMembershipDesc = [
        '환불 신청과 동시에 센터에 입장하실 수 없으며, 카드사 영업일 기준 약 2~3일 후 환불이 완료될 예정이에요.',
        '직원은 환불된 센터에 입장할 수 없지만, 회원은 앱을 통해 환불된 센터에 계속 입장할 수 있어요.',
    ]
    public cancelDesc: string[] = []
}
