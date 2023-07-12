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
} from '@angular/core'

import { changesOn, detectChangesOn } from '@shared/helper/component-helper'
import { StorageService } from '@services/storage.service'
import { Center } from '@schemas/center'
import { PaymentCard } from '@schemas/payment/payment-card'
import _ from 'lodash'

@Component({
    selector: 'rwm-payment-method-management-modal',
    templateUrl: './payment-method-management-modal.component.html',
    styleUrls: ['./payment-method-management-modal.component.scss'],
})
export class PaymentMethodManagementModalComponent {
    @Input() center: Center
    @Input() cardList: PaymentCard[] = []

    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Input() blockClickOutside = true

    @Output() addPaymentMethod = new EventEmitter<any>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public selectedCard: PaymentCard = undefined
    initSelectedCard(cardList: PaymentCard[]) {
        this.selectedCard = _.find(cardList, (v) => v.checked)
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {}

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
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        })
        detectChangesOn(changes, 'cardList', (cardList) => {
            this.initSelectedCard(cardList)
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    onSelectPaymentCard(paymentCard: PaymentCard) {

    }

    // -----------------------------------------------------------------------------------------------------------
    @Output() close = new EventEmitter()
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
}
