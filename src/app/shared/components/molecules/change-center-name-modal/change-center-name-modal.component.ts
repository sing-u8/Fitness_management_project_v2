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
import { AsyncValidatorFn, ValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms'

import { Loading } from '@schemas/loading'
import { ModalOutPut } from '@schemas/components/modal'
import { changesOn } from '@shared/helper/component-helper'
import { ChangeUserNameOutput } from '@shared/components/molecules/change-user-name-modal/change-user-name-modal.component'

export type ChangeCenterNameOutput = {
    loadingFn: ModalOutPut
    value: string
}

@Component({
    selector: 'rwm-change-center-name-modal',
    templateUrl: './change-center-name-modal.component.html',
    styleUrls: ['./change-center-name-modal.component.scss'],
})
export class ChangeCenterNameModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() name = ''
    @Output() onNameConfirm = new EventEmitter<ChangeUserNameOutput>()
    onConfirm() {
        this.onNameConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: this.nameForm.value,
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

    public nameForm = this.fb.control(this.name, {
        validators: [Validators.required],
    })

    constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder) {}

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
                this.nameForm.setValue(this.name)
            }
        })
        changesOn(changes, 'visible', (v) => {
            this.nameForm.setValue(this.name)
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
