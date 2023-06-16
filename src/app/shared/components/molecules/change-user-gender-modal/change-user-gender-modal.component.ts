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

export type ChangeUserGenderOutput = {
    loadingFn: ModalOutPut
    value: string
}

@Component({
    selector: 'rwm-change-user-gender-modal',
    templateUrl: './change-user-gender-modal.component.html',
    styleUrls: ['./change-user-gender-modal.component.scss'],
})
export class ChangeUserGenderModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() gender = ''
    public _gender = ''
    @Output() onGenderConfirm = new EventEmitter<ChangeUserGenderOutput>()
    onConfirm() {
        this.onGenderConfirm.emit({
            loadingFn: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            value: this._gender,
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
                // this._gender = this.gender
                // this.getGender()
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this._gender = this.gender
                this.getGender()
            }
        })
        detectChangesOn(changes, 'gender', (v) => {
            this._gender = this.gender
            this.getGender()
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    public isMale = false
    public isFeMale = false
    onMaleClick() {
        this.isMale = true
        this.isFeMale = false
        this.getGenderStr()
    }
    onFemaleClick() {
        this.isMale = false
        this.isFeMale = true
        this.getGenderStr()
    }
    getGender() {
        if (this.gender == 'male') {
            this.isMale = true
            this.isFeMale = false
        } else if (this.gender == 'female') {
            this.isMale = false
            this.isFeMale = true
        } else {
            this.isMale = false
            this.isFeMale = false
        }
    }
    getGenderStr() {
        if (this.isFeMale) {
            this._gender = 'female'
        } else if (this.isMale) {
            this._gender = 'male'
        } else {
            this._gender = null
        }
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
