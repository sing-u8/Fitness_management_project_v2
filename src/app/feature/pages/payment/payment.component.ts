import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { DomSanitizer } from '@angular/platform-browser'

import _ from 'lodash'
import dayjs from 'dayjs'

import { PaymentProductItemComponent } from '@feature/atoms/payment/payment-product-item/payment-product-item.component'
import { PaymentProductInfoComponent } from '@feature/atoms/payment/payment-product-info/payment-product-info.component'

import { StorageService } from '@services/storage.service'
import { PaymentService } from '@services/payment.service'
import { CenterService } from '@services/center.service'

import { paymentItemList } from '@shared/helper/center-payment'

import { PaymentItem, PaymentItemInfo } from '@schemas/payment/payment-item'
import { ModalInput } from '@schemas/components/modal'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/loading'
import { ProductCode } from '@schemas/payment/product-code'
import { Promotion } from '@schemas/payment/promotion'
import { BehaviorSubject, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PaymentCard } from '@schemas/payment/payment-card'
import { PaymentDiscountBenefitComponent } from '@feature/atoms/payment/payment-discount-benefit/payment-discount-benefit.component'
import { PaymentMethodComponent } from '@feature/atoms/payment/payment-method/payment-method.component'
import { PaymentInformationComponent } from '@feature/atoms/payment/payment-information/payment-information.component'
import { PaymentResultModalComponent } from '@feature/molecules/payment/payment-result-modal/payment-result-modal.component'

type Progress = 'one' | 'two'

@Component({
    selector: 'rwp-payment',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        PaymentProductItemComponent,
        PaymentProductInfoComponent,
        PaymentDiscountBenefitComponent,
        PaymentMethodComponent,
        PaymentInformationComponent,
        PaymentResultModalComponent,
    ],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnDestroy, OnInit {
    public center: Center

    constructor(
        private storageService: StorageService,
        private paymentService: PaymentService,
        private domSanitizer: DomSanitizer,
        private centerService: CenterService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}
    ngOnInit() {
        this.center = this.storageService.getCenter()
        this.stepBS.pipe(takeUntil(this.unSubscriber$)).subscribe((progress) => {
            switch (progress) {
                case 'one':
                    this.resetPaymentItemInfo()
                    this.resetPaymentItem()
                    this.resetPaymentMethod()
                    // this.resetAgreeObj()
                    break
                case 'two':
                    this.setPaymentItemInfo()
                    if (this.selectedPaymentItem.type == 'subscribe_membership') {
                        this.getPaymentMethod()
                    }
                    break
            }
            this.step = progress
        })
    }

    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    public unSubscriber$ = new Subject<boolean>()

    public stepBS: BehaviorSubject<Progress> = new BehaviorSubject('one')
    public step: Progress = 'one'
    public paymentItemList: PaymentItem[] = _.cloneDeep(paymentItemList)
    public paymentAgree = false

    public purchaseButtonLoading: Loading = 'idle'
    selectPaymentItem(idx) {
        this.resetPaymentItem()
        this.paymentItemList[idx].selected = true
        this.selectedPaymentItem = this.paymentItemList[idx]
    }
    resetPaymentItem() {
        _.forEach(this.paymentItemList, (v) => {
            v.selected = false
        })
    }

    public selectedPaymentItem: PaymentItem = undefined

    onNextInTheFirstStep() {
        this.stepBS.next('two')
        this.step = 'two'
    }

    // modal vars and funcs  --------------------------------------------------------------
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
        this.selectedPaymentItem = undefined
        this.stepBS.next('one')
    }

    public showPaymentError = false
    public paymentErrorData = {
        text: `결제 도중 오류가 발생하여
            결제에 실패했습니다.`,
        subText: `카드 정보를 다시 확인하거나 다른 카드를 이용해 주세요.
                문제가 계속되면, 카드사로 문의해 주시기 바랍니다.`,
        detailList: [{ title: '주요 결제 오류 사유', desc: '카드 잔액 부족, 카드 정보 오류, 결제 시스템 장애 등' }],
    }
    openPaymentErrorModal() {
        this.showPaymentErrorModal = true
    }
    public showPaymentErrorModal = false
    confirmPaymentErrorModal() {
        this.showPaymentErrorModal = false
    }

    public showPaymentResultModal = false
    onPaymentResultModalConfirm() {
        this.showPaymentResultModal = false
        // this.router.navigate(['..'], {
        //     relativeTo: this.activatedRoute,
        // })
    }

    public isPurchaseInProcess = false
    purchaseItems() {
        if (this.isPurchaseInProcess) return

        this.isPurchaseInProcess = true
        this.purchaseButtonLoading = 'pending'
        if (this.paymentItemInfo.itemInfo.productCode != 'subscribe_membership' && this.paymentAgree) {
            const reqBody = {
                center_id: this.center.id,
                product_code: this.paymentItemInfo.itemInfo.productCode,
                amount: this.totalTax + this.totalPay,
            }
            if (this.paymentItemInfo.promotions.length > 0) {
                _.assign(reqBody, { promotion: [] })
                _.forEach(this.paymentItemInfo.promotions, (val) => {
                    if (val.isFriendPromotion && val.friend_event_valid) {
                        reqBody['promotion'].push({
                            promotion_code: val.code,
                            center_address: val.friend_event_center_url,
                        })
                    } else if (!val.isFriendPromotion && val.code) {
                        reqBody['promotion'].push({
                            promotion_code: val.code,
                        })
                    }
                })
            }
            this.paymentService.createPaymentData(reqBody).subscribe((v) => {
                const user = this.storageService.getUser()
                const IMP = window['IMP']

                this.purchaseButtonLoading = 'idle'
                console.log('onChargePointChargeConfirm : ', IMP, ' --- ', v)

                IMP.init('imp46444316')
                IMP.request_pay(
                    {
                        pg: 'uplus',
                        pay_method: 'card',
                        merchant_uid: v.merchant_uid,
                        name: '센터 상품 결제',
                        amount: reqBody.amount, // v.amount,
                        buyer_email: user.email,
                        buyer_name: user.name,
                        buyer_tel: user.phone_number,
                    },
                    (rsp) => {
                        if (rsp.success) {
                            this.paymentService
                                .validatePaymentDataAndSave({
                                    imp_uid: rsp.imp_uid,
                                    merchant_uid: rsp.merchant_uid,
                                })
                                .subscribe(() => {
                                    this.setCurCenter(() => {
                                        this.showPaymentResultModal = true
                                        this.isPurchaseInProcess = false
                                    })
                                })
                        } else {
                            this.openPaymentErrorModal()
                            this.isPurchaseInProcess = false
                        }
                    }
                )
            })
        } else if (this.paymentItemInfo.itemInfo.productCode == 'subscribe_membership' && this.paymentAgree) {
            this.paymentService.subscribePayments({ center_id: this.center.id }).subscribe(() => {
                this.setCurCenter(() => {
                    this.showPaymentResultModal = true
                    this.isPurchaseInProcess = false
                    this.purchaseButtonLoading = 'idle'
                })
            })
        }
    }

    setCurCenter(cb?: () => void) {
        this.centerService.getCenter(this.center.id).subscribe((v) => {
            this.storageService.setCenter(v)
            cb ? cb() : null
        })
    }

    // ------------------------------------------------------------------------------------

    public paymentItemLoading: {
        paymentMethod: Loading
        promotion: Loading
    } = {
        paymentMethod: 'idle',
        promotion: 'idle',
    }
    public paymentItemInfo: PaymentItemInfo = {
        itemInfo: {
            title: undefined,
            originalPrice: undefined,
            price: undefined,
            discountRate: 0,
            productCode: undefined,
        },
        period: {
            startDate: undefined,
            endDate: undefined,
            dateStr: undefined,
        },
        promotions: [],
    }
    resetPaymentItemInfo() {
        this.paymentItemInfo = {
            itemInfo: {
                title: undefined,
                originalPrice: undefined,
                price: undefined,
                discountRate: 0,
                productCode: undefined,
            },
            period: {
                startDate: undefined,
                endDate: undefined,
                dateStr: undefined,
            },
            promotions: [],
        }
    }
    setPaymentItemInfo() {
        this.paymentItemInfo.itemInfo = {
            title: this.selectedPaymentItem.top.title,
            originalPrice:
                this.selectedPaymentItem.type == '1_years_membership'
                    ? this.changePriceStrToNumber(this.selectedPaymentItem.middle.originalPrice) * 12
                    : this.selectedPaymentItem.type == '2_years_membership'
                    ? this.changePriceStrToNumber(this.selectedPaymentItem.middle.originalPrice) * 24
                    : this.changePriceStrToNumber(this.selectedPaymentItem.middle.originalPrice),
            price:
                this.selectedPaymentItem.type == '1_years_membership'
                    ? this.changePriceStrToNumber(this.selectedPaymentItem.middle.price) * 12
                    : this.selectedPaymentItem.type == '2_years_membership'
                    ? this.changePriceStrToNumber(this.selectedPaymentItem.middle.price) * 24
                    : this.changePriceStrToNumber(this.selectedPaymentItem.middle.price),
            discountRate: this.selectedPaymentItem.middle.discountRate ?? 0,
            productCode: this.selectedPaymentItem.type,
        }
        this.getPaymentPromotion(this.center.id, this.selectedPaymentItem.type)
        this.getPaymentItemPeriod(this.selectedPaymentItem.type)
    }
    changePriceStrToNumber(priceStr: string) {
        return Number(priceStr.replace(/[^0-9]/gi, ''))
    }

    getPaymentItemPeriod(productCode: ProductCode) {
        switch (productCode) {
            case '1_years_membership':
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')
                    const endDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .add(1, 'year')
                        .format('YYYY.MM.DD HH:mm:ss')
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate,
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
                    const endDate = dayjs().add(1, 'year').format('YYYY.MM.DD HH:mm:ss')
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate,
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                }

                break
            case '2_years_membership':
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')
                    const endDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .add(2, 'year')
                        .format('YYYY.MM.DD HH:mm:ss')
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate,
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
                    const endDate = dayjs().add(2, 'year').format('YYYY.MM.DD HH:mm:ss')
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate,
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                }
                break
            case 'lifetime_membership':
                this.paymentItemInfo.period = {
                    startDate: undefined,
                    endDate: undefined,
                    dateStr: `평생 이용`,
                }
                break
            default:
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')
                    const endDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .add(1, 'month')
                        .format('YYYY.MM.DD HH:mm:ss')
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate,
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    this.paymentItemInfo.period = {
                        startDate: dayjs().format('YYYY.MM.DD HH:mm:ss'),
                        endDate: dayjs().add(1, 'month').format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs().format('YYYY.MM.DD')} ~ ${dayjs().add(1, 'month').format('YYYY.MM.DD')}`,
                    }
                }
                break
        }
    }
    getPaymentPromotion(centerId: string, productCode: ProductCode) {
        this.paymentItemLoading.promotion = 'pending'
        if (productCode == 'subscribe_membership') {
            this.paymentItemInfo.promotions = [
                {
                    title: '런칭 이벤트',
                    description: '레드웨일 런칭 기념, 6개월간 5% 할인 자동 적용',
                    code: undefined,
                    start: undefined,
                    end: undefined,
                    discount_unit_code: 'promotion_discount_unit_percent',
                    discount: 5,
                    discount_price_for_percent: _.ceil(this.paymentItemInfo.itemInfo.originalPrice * 5 * 0.01, -3),
                },
            ]
            this.paymentItemLoading.promotion = 'done'
            return
        }
        this.paymentService
            .getPaymentPromotion(this.center.id, this.selectedPaymentItem.type)
            .pipe()
            .subscribe({
                next: (promotions) => {
                    this.paymentItemInfo.promotions = _.map(promotions, (value) => {
                        if (
                            value.code == '2_years_friend_event_2023' ||
                            value.code == '1_years_friend_event_2023' ||
                            value.code == 'lifetime_friend_event_2023'
                        ) {
                            value.isFriendPromotion = true
                            value.friend_event_valid = false
                            value.friend_event_error = ''
                            value.friend_event_center_url = ''
                        }
                        if (value.discount_unit_code == 'promotion_discount_unit_percent') {
                            value.discount_price_for_percent = _.ceil(
                                this.paymentItemInfo.itemInfo.originalPrice - this.paymentItemInfo.itemInfo.price,
                                -3
                            )
                            return value
                        } else {
                            value.discount_price_for_money = value.discount
                            return value
                        }
                    })
                    _.forEach(this.paymentItemInfo.promotions, (v) => {
                        v.description = this.domSanitizer.bypassSecurityTrustHtml(
                            _.replace(v.description as string, /(\r\n|\r|\n)/g, '<br />')
                        )
                    })
                    this.getTotalDiscountPrice()
                    this.paymentItemLoading.promotion = 'done'
                },
                error: (err) => {
                    this.paymentItemLoading.promotion = 'done'
                },
            })
    }

    // ------------------------------------------------------------------------------------

    public totalDiscountPrice = 0
    public totalPay = 0
    public totalTax = 0
    getTotalDiscountPrice() {
        this.totalDiscountPrice = 0
        this.totalPay = 0
        this.totalTax = 0
        this.totalPay = _.reduce(
            this.paymentItemInfo.promotions,
            (acc, val) => {
                if (val.isFriendPromotion && !val.friend_event_valid) {
                    return acc
                } else {
                    this.totalDiscountPrice += val.discount_price_for_percent ?? val.discount_price_for_money
                    return acc - (val.discount_price_for_percent ?? val.discount_price_for_money)
                }
            },
            this.paymentItemInfo.itemInfo.originalPrice
        )
        this.totalTax = this.totalPay * 0.1
    }
    onPromotionChanged(promotions: Array<Promotion>) {
        this.paymentItemInfo.promotions = promotions
        this.getTotalDiscountPrice()
    }

    // ------------------------------------------------------------------------------------

    public paymentCard: PaymentCard = undefined
    getPaymentMethod() {
        this.paymentItemLoading.paymentMethod = 'pending'
        this.paymentService
            .getSubscribedPaymentCustomers()
            .pipe()
            .subscribe({
                next: (paymentCard) => {
                    this.paymentCard = paymentCard
                    this.paymentItemLoading.paymentMethod = 'done'
                    this.getTotalDiscountPrice()
                },
                error: () => {
                    this.paymentItemLoading.paymentMethod = 'done'
                },
            })
    }
    resetPaymentMethod() {
        this.paymentCard = undefined
    }

    protected readonly undefined = undefined;
}
