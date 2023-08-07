import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule, Location } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { DomSanitizer } from '@angular/platform-browser'

import _ from 'lodash'
import dayjs from 'dayjs'

import { PaymentProductItemComponent } from '@feature/atoms/payment/payment-product-item/payment-product-item.component'
import { PaymentProductInfoComponent } from '@feature/atoms/payment/payment-product-info/payment-product-info.component'

import { StorageService } from '@services/storage.service'
import { CenterProductsService } from '@services/center-products.service'
import { CenterPaymentsService, CreatePaymentReqBody } from '@services/center-payments.service'
import { CenterService } from '@services/center.service'
import { CallbackService } from '@services/callback.service'

import { paymentItemList } from '@shared/helper/center-payment'

import { PaymentItem, PaymentItemInfo } from '@schemas/payment/payment-item'
import { ModalInput } from '@schemas/components/modal'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/loading'
import { ProductCode } from '@schemas/payment/product-code'
import { Promotion } from '@schemas/payment/promotion'
import { BehaviorSubject, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { PaymentCard } from '@schemas/payment/payment-card'
import { PaymentDiscountBenefitComponent } from '@feature/atoms/payment/payment-discount-benefit/payment-discount-benefit.component'
import { PaymentMethodComponent } from '@feature/atoms/payment/payment-method/payment-method.component'
import { PaymentInformationComponent } from '@feature/atoms/payment/payment-information/payment-information.component'
import { PaymentResultModalComponent } from '@feature/molecules/payment/payment-result-modal/payment-result-modal.component'
import { User } from '@schemas/user'
import { NgScrollbar, ScrollViewport } from 'ngx-scrollbar'
import { CenterCustomersService } from '@services/center-customers.service'

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
        NgScrollbar,
        ScrollViewport,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnDestroy, OnInit {
    public center: Center
    public user: User

    @ViewChild(NgScrollbar) scrollable: NgScrollbar

    constructor(
        private storageService: StorageService,
        private domSanitizer: DomSanitizer,
        private centerService: CenterService,
        private centerProductsService: CenterProductsService,
        private centerCustomersService: CenterCustomersService,
        private centerPaymentsService: CenterPaymentsService,
        private callbackService: CallbackService,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute
    ) {}
    ngOnInit() {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.stepBS.pipe(takeUntil(this.unSubscriber$)).subscribe((progress) => {
            switch (progress) {
                case 'one':
                    this.resetPaymentItemInfo()
                    this.resetPaymentItem()
                    this.paymentAgree = false
                    // this.resetAgreeObj()
                    break
                case 'two':
                    this.setPaymentItemInfo()
                    if (this.selectedPaymentItem.type == 'subscription_membership') {
                        this.getPaymentMethod()
                    }
                    break
            }
            this.step = progress
        })

        this.paymentCardSubject
            .asObservable()
            .pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.unSubscriber$))
            .subscribe((paymentCard) => {
                if (_.isObject(paymentCard)) {
                    this.centerCustomersService.selectCustomer(this.center.id, paymentCard.id).subscribe({
                        next: () => {
                            _.forEach(this.paymentCardList, (v, idx) => {
                                this.paymentCardList[idx].checked = v.id == paymentCard.id
                            })
                            this.selectedPaymentCard = paymentCard
                            console.log(
                                'paymentCardSubject value change complete : ',
                                this.paymentCardList,
                                paymentCard
                            )
                        },
                        error: (err) => {},
                    })
                } else {
                    this.selectedPaymentCard = paymentCard
                }
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
        this.scrollable.scrollTo({ top: 0, duration: 0 })
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
        this.scrollable.scrollTo({ top: 0, duration: 0 })
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
        this.router.navigate(['redwhale-home'])
    }

    public isPurchaseInProcess = false
    purchaseItems() {
        if (this.isPurchaseInProcess) return

        this.isPurchaseInProcess = true
        this.purchaseButtonLoading = 'pending'
        if (this.paymentItemInfo.itemInfo.productCode != 'subscription_membership' && this.paymentAgree) {
            const reqBody: CreatePaymentReqBody = {
                product_code: this.paymentItemInfo.itemInfo.productCode,
                amount: this.totalTax + this.totalPay,
            }
            if (this.paymentItemInfo.promotions.length > 0) {
                _.assign(reqBody, { promotion: [] })
                _.forEach(this.paymentItemInfo.promotions, (val) => {
                    if (val.isFriendPromotion && val.friend_event_valid) {
                        reqBody['promotion'].push({
                            promotion_code: val.code,
                            center_code: this.center.code,
                        })
                    } else if (!val.isFriendPromotion && val.code) {
                        reqBody['promotion'].push({
                            promotion_code: val.code,
                        })
                    }
                })
            }
            console.log('purchaseItems -- reqBody : ', reqBody)
            this.centerPaymentsService.createPayment(this.center.id, reqBody).subscribe((v) => {
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
                            this.callbackService
                                .checkAndSavePayment({
                                    imp_uid: rsp.imp_uid,
                                    merchant_uid: rsp.merchant_uid,
                                })
                                .subscribe(() => {
                                    this.setCurCenter(() => {
                                        this.showPaymentResultModal = true
                                        this.isPurchaseInProcess = false
                                        // this.router.navigate([`${this.center.name}`, 'main'])
                                    })
                                })
                        } else {
                            this.openPaymentErrorModal()
                            this.isPurchaseInProcess = false
                        }
                    }
                )
            })
        } else if (this.paymentItemInfo.itemInfo.productCode == 'subscription_membership' && this.paymentAgree) {
            this.centerPaymentsService.createPaymentSubscribe(this.center.id).subscribe((v) => {
                console.log('centerPaymentsService.createPaymentSubscribe return : ', v)
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

    onCancelPayment() {
        console.log('on cancel payment : ', this.router, this.location)
        this.router.navigate(['redwhale-home'])
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
        let monthArr = []
        switch (productCode) {
            case '1_years_membership':
                monthArr = Array.from({ length: 12 }, (_, idx) => idx + 1)
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')

                    const startCountDate = dayjs(this.center.product_end_date).subtract(3, 'day').add(1, 'day')
                    const endDate = startCountDate
                    _.forEach(monthArr, (number, idx) => {
                        const daysInMonth = startCountDate.add(idx, 'month').daysInMonth()
                        endDate.add(daysInMonth, 'day')
                    })
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
                    const startCountDate = dayjs()
                    const endDate = startCountDate
                    _.forEach(monthArr, (number, idx) => {
                        const daysInMonth = startCountDate.add(idx, 'month').daysInMonth()
                        endDate.add(daysInMonth, 'day')
                    })
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                }

                break
            case '2_years_membership':
                monthArr = Array.from({ length: 12 * 2 }, (_, idx) => idx + 1)
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')
                    const startCountDate = dayjs(this.center.product_end_date).subtract(3, 'day').add(1, 'day')
                    const endDate = startCountDate
                    _.forEach(monthArr, (number, idx) => {
                        const daysInMonth = startCountDate.add(idx, 'month').daysInMonth()
                        endDate.add(daysInMonth, 'day')
                    })
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
                    const startCountDate = dayjs()
                    const endDate = startCountDate
                    _.forEach(monthArr, (number, idx) => {
                        const daysInMonth = startCountDate.add(idx, 'month').daysInMonth()
                        endDate.add(daysInMonth, 'day')
                    })
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                }
                break
            // 월 이용권
            default:
                monthArr = [0]
                if (
                    !_.isEmpty(this.center.product_code) &&
                    dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
                ) {
                    const startDate = dayjs(this.center.product_end_date)
                        .subtract(3, 'day')
                        .add(1, 'day')
                        .format('YYYY.MM.DD HH:mm:ss')
                    const startCountDate = dayjs(this.center.product_end_date).subtract(3, 'day').add(1, 'day')
                    const endDate = startCountDate
                    _.forEach(monthArr, (number, idx) => {
                        const daysInMonth = startCountDate.add(idx, 'month').daysInMonth()
                        endDate.add(daysInMonth, 'day')
                    })
                    this.paymentItemInfo.period = {
                        startDate: startDate,
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
                    }
                } else {
                    const endDate = dayjs()
                    const daysInMonth = dayjs().daysInMonth()
                    endDate.add(daysInMonth, 'day')
                    this.paymentItemInfo.period = {
                        startDate: dayjs().format('YYYY.MM.DD HH:mm:ss'),
                        endDate: endDate.format('YYYY.MM.DD HH:mm:ss'),
                        dateStr: `${dayjs().format('YYYY.MM.DD')} ~ ${endDate.format('YYYY.MM.DD')}`,
                    }
                }
                break
        }
        console.log('init membership date period : ', this.paymentItemInfo)
        // switch (productCode) {
        //     case '1_years_membership':
        //         if (
        //             !_.isEmpty(this.center.product_code) &&
        //             dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
        //         ) {
        //             const startDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             const endDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .add(1, 'year')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             this.paymentItemInfo.period = {
        //                 startDate: startDate,
        //                 endDate: endDate,
        //                 dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
        //             }
        //         } else {
        //             const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
        //             const endDate = dayjs().add(1, 'year').format('YYYY.MM.DD HH:mm:ss')
        //             this.paymentItemInfo.period = {
        //                 startDate: startDate,
        //                 endDate: endDate,
        //                 dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
        //             }
        //         }
        //
        //         break
        //     case '2_years_membership':
        //         if (
        //             !_.isEmpty(this.center.product_code) &&
        //             dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
        //         ) {
        //             const startDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             const endDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .add(2, 'year')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             this.paymentItemInfo.period = {
        //                 startDate: startDate,
        //                 endDate: endDate,
        //                 dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
        //             }
        //         } else {
        //             const startDate = dayjs().format('YYYY.MM.DD HH:mm:ss')
        //             const endDate = dayjs().add(2, 'year').format('YYYY.MM.DD HH:mm:ss')
        //             this.paymentItemInfo.period = {
        //                 startDate: startDate,
        //                 endDate: endDate,
        //                 dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
        //             }
        //         }
        //         break
        //     // 월 이용권
        //     default:
        //         if (
        //             !_.isEmpty(this.center.product_code) &&
        //             dayjs().isBefore(dayjs(this.center.product_end_date).subtract(3, 'day'), 'day')
        //         ) {
        //             const startDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             const endDate = dayjs(this.center.product_end_date)
        //                 .subtract(3, 'day')
        //                 .add(1, 'day')
        //                 .add(1, 'month')
        //                 .format('YYYY.MM.DD HH:mm:ss')
        //             this.paymentItemInfo.period = {
        //                 startDate: startDate,
        //                 endDate: endDate,
        //                 dateStr: `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`,
        //             }
        //         } else {
        //             this.paymentItemInfo.period = {
        //                 startDate: dayjs().format('YYYY.MM.DD HH:mm:ss'),
        //                 endDate: dayjs().add(1, 'month').format('YYYY.MM.DD HH:mm:ss'),
        //                 dateStr: `${dayjs().format('YYYY.MM.DD')} ~ ${dayjs().add(1, 'month').format('YYYY.MM.DD')}`,
        //             }
        //         }
        //         break
        // }
    }
    getPaymentPromotion(centerId: string, productCode: ProductCode) {
        this.paymentItemLoading.promotion = 'pending'
        this.centerProductsService.getPromotion(this.center.id, this.selectedPaymentItem.type).subscribe({
            next: (promotions) => {
                this.paymentItemInfo.promotions = _.map(promotions, (value) => {
                    value.description = this.domSanitizer.bypassSecurityTrustHtml(
                        _.replace(value.description as string, /(\r\n|\r|\n)/g, '<br />')
                    )
                    if (value.code == '2_years_friend_event' || value.code == '1_years_friend_event') {
                        value.isFriendPromotion = true
                        value.friend_event_valid = false
                        value.friend_event_error = ''
                        value.friend_event_center_code = ''
                        value.friend_event_loading = 'idle'
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

                this.getTotalDiscountPrice()
                this.paymentItemLoading.promotion = 'done'
                console.log('centerProductsService.getPromotion -- ', this.paymentItemInfo)
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

    public paymentCardSubject = new Subject<PaymentCard>()
    public selectedPaymentCard: PaymentCard = undefined
    public paymentCardList: PaymentCard[] = []
    getPaymentMethod() {
        this.paymentItemLoading.paymentMethod = 'pending'
        this.centerCustomersService.getCustomer(this.center.id).subscribe({
            next: (paymentCards) => {
                if (paymentCards.length > 0) {
                    const checkIdx = _.findIndex(paymentCards, (v) => v.checked)
                    this.selectedPaymentCard = paymentCards[checkIdx]
                }
                this.paymentCardList = paymentCards
                this.paymentItemLoading.paymentMethod = 'idle'
                this.getTotalDiscountPrice()
            },
            error: () => {
                this.paymentItemLoading.paymentMethod = 'idle'
            },
        })
    }
    onPaymentCardChanged(card: PaymentCard) {
        this.paymentCardSubject.next(card)
    }

    protected readonly undefined = undefined
}
