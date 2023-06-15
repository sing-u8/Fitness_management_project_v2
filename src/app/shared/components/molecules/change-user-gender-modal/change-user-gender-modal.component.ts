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
import { changesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwm-change-user-gender-modal',
    templateUrl: './change-user-gender-modal.component.html',
    styleUrls: ['./change-user-gender-modal.component.scss'],
})
export class ChangeUserGenderModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() gender = ''
    @Output() onNameConfirm = new EventEmitter<{
        loadingFn: ModalOutPut
        value: string
    }>()
    onConfirm() {
        this.onNameConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: this.gender,
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
