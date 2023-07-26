import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
    AfterViewInit,
    OnDestroy,
} from '@angular/core'

import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import { StorageService } from '@services/storage.service'
import { CreateCustomerReqBody, UsersCustomersService } from '@services/users-customers.service'
import { PaymentMethodManagementService } from '@services/helper/payment-method-management.service'
import { Center } from '@schemas/center'
import { PaymentCard } from '@schemas/payment/payment-card'
import _ from 'lodash'
import { User } from '@schemas/user'
import { Loading } from '@schemas/loading'

import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
import { ButtonEmit } from '@schemas/components/button'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rwm-payment-method-management-modal',
    templateUrl: './payment-method-management-modal.component.html',
    styleUrls: ['./payment-method-management-modal.component.scss'],
})
export class PaymentMethodManagementModalComponent implements OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public user: User
    public cardList: PaymentCard[] = []
    public cardListLoading: Loading = 'idle'

    public unSubscriber$ = new Subject<boolean>()

    // initPaymentMethods() {
    //     this.cardListLoading = 'pending'
    //     this.usersCustomersService.getCustomer(this.user.id).subscribe({
    //         next: (cards) => {
    //             this.cardListLoading = 'done'
    //             this.cardList = cards
    //             this.initSelectedCard(this.cardList)
    //             console.log('initPaymentMethods - ', this.cardList)
    //         },
    //         error: (err) => {
    //             this.cardListLoading = 'idle'
    //         },
    //     })
    // }

    public selectedCard: PaymentCard = undefined
    initSelectedCard(cardList: PaymentCard[]) {
        this.selectedCard = _.find(cardList, (v) => v.checked)
    }
    // setCardSelect(paymentCard: PaymentCard) {
    //     _.forEach(this.cardList, (v, idx) => {
    //         this.cardList[idx].checked = v.id == paymentCard.id
    //     })
    // }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private usersCustomersService: UsersCustomersService,
        private storageService: StorageService,
        private paymentMethodManagementService: PaymentMethodManagementService,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
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
                if (this.cardListLoading == 'idle') {
                    this.paymentMethodManagementService.initPaymentMethods(this.user.id)
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
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    onSelectPaymentCard(paymentCard: PaymentCard) {
        this.usersCustomersService.selectCustomer(this.user.id, paymentCard.id).subscribe((v) => {
            console.log('onSelectPaymentCard -- ', v)
            this.paymentMethodManagementService.setCardSelect(paymentCard)

            this.nxStore.dispatch(showToast({ text: '자동 결제 수단이 변경되었어요.' }))
        })
    }
    onRemovePaymentCard(paymentCard: PaymentCard) {
        // 월 이용권에 따른 분기 설정 필요
        this.usersCustomersService.deleteCustomer(this.user.id, paymentCard.id).subscribe((v) => {
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
        this.usersCustomersService.createCustomer(this.user.id, res.reqBody).subscribe({
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
