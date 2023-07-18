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
} from '@angular/core'
import { PaymentItemInfo } from '@schemas/payment/payment-item'
import { PaymentCard } from '@schemas/payment/payment-card'
import dayjs from 'dayjs'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import _ from 'lodash'

@Component({
    selector: 'rwm-payment-result-modal',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './payment-result-modal.component.html',
    styleUrls: ['./payment-result-modal.component.scss'],
})
export class PaymentResultModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() paymentItem: PaymentItemInfo
    @Input() paymentCard: PaymentCard
    @Input() totalDiscountPrice = 0
    @Input() totalTax = 0
    @Input() totalPay = 0

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public cardNumber = '(0000)'
    getCardNumber() {
        if (_.isObject(this.paymentCard)) this.cardNumber = `(${this.paymentCard.card_number.slice(0, 4)})`
    }

    changed: boolean

    public isMouseModalDown: boolean
    public day = dayjs().format('D')

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
                this.day = dayjs().format('D')
                this.getCardNumber()
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
