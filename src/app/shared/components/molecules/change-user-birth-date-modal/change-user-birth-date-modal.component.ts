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
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { changesOn } from '@shared/helper/component-helper'
import { passwordValidator } from '@shared/helper/form-helper'
import dayjs from 'dayjs'
import _ from 'lodash'

export type ChangeBirthDateOutput = {
    loadingFn: ModalOutPut
    value: string
}

@Component({
    selector: 'rwm-change-user-birth-date-modal',
    templateUrl: './change-user-birth-date-modal.component.html',
    styleUrls: ['./change-user-birth-date-modal.component.scss'],
})
export class ChangeUserBirthDateModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() birthDate = ''
    public _birthDate = ''
    @Output() onBirthDateConfirm = new EventEmitter<ChangeBirthDateOutput>()
    onConfirm() {
        this.onBirthDateConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: this.birthDateForm.value,
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

    public birthDateForm = this.fb.control(this.birthDate, {
        validators: [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
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
                if (!_.isEmpty(this.birthDate)) this._birthDate = dayjs(this.birthDate).format('YYMMDD')
                this.birthDateForm.setValue(this._birthDate)
            }
        })
        changesOn(changes, 'visible', (v) => {
            if (!_.isEmpty(this.birthDate)) this._birthDate = dayjs(this.birthDate).format('YYMMDD')
            this.birthDateForm.setValue(this._birthDate)
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
