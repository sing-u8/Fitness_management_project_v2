import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnChanges,
    Output,
    SimpleChanges,
    Input,
    ViewChild,
    ElementRef,
    Renderer2,
    OnDestroy,
} from '@angular/core'
import { Center } from '@schemas/center'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import { CenterProductInfo, InfoState } from '@schemas/components/center-product-info/center-product-info'
import dayjs from 'dayjs'
import _ from 'lodash'

@Component({
    selector: 'rwm-center-product-info-toast',
    templateUrl: './center-product-info-toast.component.html',
    styleUrls: ['./center-product-info-toast.component.scss'],
})
export class CenterProductInfoToastComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() center: Center

    @Output() onPurchaseCenterMembershipClick = new EventEmitter()
    @Output() onPaymentMethodClick = new EventEmitter()

    @ViewChild('center_info_toast') center_info_toast_el: ElementRef
    constructor(private renderer: Renderer2) {}

    public resizeListener: () => void = () => {}

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', () => {
            this.getCenterInfo()
            this.setPosition()
        })
        // changesOn(changes, 'center', () => {
        //     this.getCenterInfo()
        //     this.setPosition()
        // })
    }
    ngAfterViewInit() {
        this.getCenterInfo()
        this.setPosition()

        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            this.setPosition()
        })
    }

    ngOnDestroy() {
        this.resizeListener()
    }

    setPosition() {
        if (_.isEmpty(this.center_info_toast_el)) return
        const hostPos = document.body.getBoundingClientRect()
        const toastPos = this.center_info_toast_el.nativeElement.getBoundingClientRect()
        const x = hostPos.width / 2 - toastPos.width / 2
        console.log('setPosition - ', hostPos, toastPos, x)
        this.renderer.setStyle(this.center_info_toast_el.nativeElement, 'left', `${x}px`)
    }

    public state: InfoState = 'normal'
    public productInfoData: Record<Exclude<InfoState, 'normal'>, CenterProductInfo> = {
        freeTrialEndExpected: {
            title: '일 후 무료 체험이 종료돼요.',
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        freeTrialEndToday: {
            title: '오늘 무료 체험이 종료돼요.',
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
        },
        expirationExpected: {
            title: '일 후 이용권이 만료돼요.',
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        expiredToday: {
            title: '오늘 이용권이 만료돼요.',
            desc: `이용권 만료 후에는
                센터에 입장할 수 없어요.`,
            btText: '이용권 구매하기',
            btFn: () => {
                this.onPurchaseCenterMembershipClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
            day: 0,
        },
        subEndExpected: {
            title: '일 후 이용권이 만료돼요.',
            btText: '결제 수단 관리',
            btFn: () => {
                this.onPaymentMethodClick.emit()
            },
            bgColor: 'var(--state-warning-5)',
            borderColor: 'var(--state-warning-100)',
            day: 0,
        },
        subEndToday: {
            title: '오늘 이용권이 만료돼요.',
            btText: '결제 수단 관리',
            btFn: () => {
                this.onPaymentMethodClick.emit()
            },
            bgColor: 'var(--state-error-5)',
            borderColor: 'var(--state-error-100)',
        },
    }
    public curInfoData: CenterProductInfo = {
        title: '',
        desc: ``,
        btText: '',
        btFn: () => {},
        bgColor: 'var(--state-warning-5)',
        borderColor: 'var(--state-warning-100)',
        day: 0,
    }
    getCenterInfo() {
        const dayRemains = dayjs(this.center.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day') + 1
        if (this.center.product_code == 'free_trial_membership') {
            if (dayRemains > 14) {
                this.state = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.productInfoData.freeTrialEndExpected.day = dayRemains
                this.curInfoData = this.productInfoData.freeTrialEndExpected
                this.state = 'freeTrialEndExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.freeTrialEndToday
                this.state = 'freeTrialEndToday'
            }
        } else if (this.center.product_code == 'subscription_membership') {
            if (dayRemains > 5) {
                this.state = 'normal'
            } else if (dayRemains <= 5 && dayRemains > 1) {
                this.productInfoData.subEndExpected.day = dayRemains
                this.curInfoData = this.productInfoData.subEndExpected
                this.state = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.subEndToday
                this.state = 'expiredToday'
            }
        } else {
            // 1, 2년 구독
            if (dayRemains > 14) {
                this.state = 'normal'
            } else if (dayRemains <= 14 && dayRemains > 1) {
                this.productInfoData.expirationExpected.day = dayRemains
                this.curInfoData = this.productInfoData.expirationExpected
                this.state = 'expirationExpected'
            } else if (dayRemains == 1) {
                this.curInfoData = this.productInfoData.expiredToday
                this.state = 'expiredToday'
            }
        }
    }

    protected readonly undefined = undefined
}
