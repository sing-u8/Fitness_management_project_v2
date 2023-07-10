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
import { FormBuilder, Validators } from '@angular/forms'

import { Loading } from '@schemas/loading'

import { ModalOutPut } from '@schemas/components/modal'
import { InputHelperService } from '@services/helper/input-helper.service'
import { ChangeUserNameOutput } from '@shared/components/molecules/change-user-name-modal/change-user-name-modal.component'
import { changesOn } from '@shared/helper/component-helper'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import _ from 'lodash'
import { TextFieldComponent } from '@shared/components/atoms/text-field/text-field.component'

export type ChangeCenterPhoneNumberOutput = {
    loadingFn: ModalOutPut
    value: string
}

@Component({
    selector: 'rwm-change-center-phone-number-modal',
    templateUrl: './change-center-phone-number-modal.component.html',
    styleUrls: ['./change-center-phone-number-modal.component.scss'],
})
export class ChangeCenterPhoneNumberModalComponent implements OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() phoneNumber = ''
    @Output() onPhoneNumberConfirm = new EventEmitter<ChangeUserNameOutput>()

    public phoneNumberForm = this.fb.control('', {
        validators: [Validators.pattern(/^\d{3}-\d{4}-\d{4}$/), Validators.required],
    })
    onConfirm() {
        this.onPhoneNumberConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: _.replace(this.phoneNumberForm.value, /[^0-9]/gi, ''),
        })
    }

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement
    @ViewChild('phoneNumberRef') phoneNumberRef: TextFieldComponent

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

    public unDescriber$ = new Subject<boolean>()

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private inputHelper: InputHelperService
    ) {
        this.phoneNumberForm.valueChanges.pipe(takeUntil(this.unDescriber$)).subscribe((v) => {
            let value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
            if (value.length > 0) {
                if (value.length > 3 && value.length < 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3)
                } else if (value.length >= 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
                }
            }
            this.phoneNumberForm.setValue(value, { emitEvent: false })
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
                }, 0)
                this.phoneNumberRef.input_el.nativeElement.focus()
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.phoneNumberForm.setValue(this.phoneNumber)
            }
        })
        changesOn(changes, 'visible', (v) => {
            this.phoneNumberForm.setValue(this.phoneNumber)
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // -------------------------------------------------------------

    save() {}
    formCheck() {
        let isValid = false
        if (this.phoneNumberForm.valid) {
            isValid = true
        }
        return isValid
    }
    restrictToNumber(event) {
        return this.inputHelper.restrictToNumber(event)
    }
}
