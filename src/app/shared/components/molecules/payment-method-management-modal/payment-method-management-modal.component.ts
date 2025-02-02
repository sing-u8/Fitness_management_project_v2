import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewChild,
    OnDestroy,
} from '@angular/core'

import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import { StorageService } from '@services/storage.service'
import { CreateCustomerReqBody, CenterCustomersService } from '@services/center-customers.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'
import { Center } from '@schemas/center'
import { PaymentCard } from '@schemas/payment/payment-card'
import _ from 'lodash'
import { Loading } from '@schemas/loading'

import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/app.actions'
import { ButtonEmit } from '@schemas/components/button'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rwm-payment-method-management-modal',
    templateUrl: './payment-method-management-modal.component.html',
    styleUrls: ['./payment-method-management-modal.component.scss'],
})
export class PaymentMethodManagementModalComponent implements OnDestroy {
    @Input() center: Center

    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public cardList: PaymentCard[] = []
    public cardListLoading: Loading = 'idle'

    public curCenter: Center = undefined
    public prevCenter: Center = undefined

    public unSubscriber$ = new Subject<boolean>()

    public selectedCard: PaymentCard = undefined
    initSelectedCard(cardList: PaymentCard[]) {
        this.selectedCard = _.find(cardList, (v) => v.checked)
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerCustomersService: CenterCustomersService,
        private storageService: StorageService,
        private paymentMethodManagementService: PaymentMethodManagementService,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
        this.paymentMethodManagementService.cardList$
            .asObservable()
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((paymentCards) => {
                this.cardList = paymentCards
                this.initSelectedCard(paymentCards)
            })
        this.paymentMethodManagementService.cardListLoading$
            .asObservable()
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((loading) => {
                this.cardListLoading = loading
            })
    }

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                    this.bodyElement.nativeElement.scrollTo({ top: this.scrollTop })
                }, 0)
                console.log(
                    'ngOnChanges - payment method management modal : ',
                    this.prevCenter,
                    this.curCenter,
                    this.cardListLoading
                )
                if (this.prevCenter?.id != this.curCenter.id) {
                    this.paymentMethodManagementService.initPaymentMethods(this.center.id)
                    this.prevCenter = this.curCenter
                }
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        })

        changesOn(changes, 'center', (curCenter) => {
            this.curCenter = curCenter
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    onSelectPaymentCard(paymentCard: PaymentCard) {
        this.centerCustomersService.selectCustomer(this.center.id, paymentCard.id).subscribe((v) => {
            this.paymentMethodManagementService.setCardSelect(paymentCard)

            this.nxStore.dispatch(showToast({ text: '자동 결제 수단이 변경되었어요.' }))
        })
    }
    onRemovePaymentCard(paymentCard: PaymentCard) {
        // 월 이용권에 따른 분기 설정 필요
        this.centerCustomersService.deleteCustomer(this.center.id, paymentCard.id).subscribe((v) => {
            this.paymentMethodManagementService.removePaymentCard(paymentCard)
            this.nxStore.dispatch(showToast({ text: '선택한 결제 수단이 삭제되었어요.' }))
        })
    }

    // -----------------------------------------------------------------------------------------------------------
    // register card vars and funcs
    public showRegisterCardModal = false
    public isRegisterCardError = false
    openRegisterCardModal() {
        this.close.emit()
        this.showRegisterCardModal = true
    }
    onRegisterCardCancel() {
        this.showRegisterCardModal = false
        this.open.emit()
    }
    onRegisterCardConfirm(res: { btLoading: ButtonEmit; reqBody: CreateCustomerReqBody }) {
        res.btLoading.showLoading()
        this.centerCustomersService.createCustomer(this.center.id, res.reqBody).subscribe({
            next: (paymentCard) => {
                this.isRegisterCardError = false
                this.showRegisterCardModal = false
                this.open.emit()
                res.btLoading.hideLoading()
                // this.cardList.unshift(paymentCard)
                // this.setCardSelect(paymentCard)

                this.paymentMethodManagementService.addPaymentCard(paymentCard)
                this.paymentMethodManagementService.setCardSelect(paymentCard)

                this.nxStore.dispatch(showToast({ text: '결제 수단이 추가되었어요.' }))
            },
            error: () => {
                this.isRegisterCardError = true
                res.btLoading.hideLoading()
            },
        })
    }

    // -----------------------------------------------------------------------------------------------------------
    @Output() close = new EventEmitter()
    @Output() open = new EventEmitter()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
    }

    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    protected readonly undefined = undefined
}
