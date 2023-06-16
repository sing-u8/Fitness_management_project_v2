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
import { NgxSpinnerService } from 'ngx-spinner'

import { Loading } from '@schemas/loading'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'

export type ChangeUserMarketingOutput = {
    loadingFn: ModalOutPut
    value: {
        email: boolean
        sms: boolean
    }
}

@Component({
    selector: 'rwm-change-user-marketing-modal',
    templateUrl: './change-user-marketing-modal.component.html',
    styleUrls: ['./change-user-marketing-modal.component.scss'],
})
export class ChangeUserMarketingModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() email = false
    @Input() sms = false
    public checkObj = {
        email: false,
        sms: false,
    }
    @Output() onMarketingConfirm = new EventEmitter<ChangeUserMarketingOutput>()
    onConfirm() {
        this.onMarketingConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: {
                ...this.checkObj,
            },
        })
    }

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() close = new EventEmitter<any>()
    onClose(): void {
        this.close.emit({})
    }

    public confirmButtonLoading: Loading = 'idle'
    showLoading() {
        this.confirmButtonLoading = 'pending'
    }
    hideLoading() {
        this.confirmButtonLoading = 'idle'
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
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.checkObj = {
                    email: this.email,
                    sms: this.sms,
                }
            }
        })
        changesOn(changes, 'visible', (v) => {
            this.checkObj = {
                email: this.email,
                sms: this.sms,
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
