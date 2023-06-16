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
import { Observable } from 'rxjs'
import { TextAreaModalOutPut } from '@schemas/components/modal'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwa-textarea-modal',
    templateUrl: './textarea-modal.component.html',
    styleUrls: ['./textarea-modal.component.scss'],
})
export class TextareaModalComponent {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() resetText = '초기화'
    @Input() confirmText = '저장하기'
    @Input() type: 'oneButton' | 'twoButton' = 'twoButton'
    @Input() loadingName = 'textarea-loading'

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<TextAreaModalOutPut>()

    @Input() title = '타이틀'
    @Input() text = ''
    public textValue = ''

    @Input() placeholder = '내용을 입력해 주세요.'

    public changed: boolean

    public isMouseModalDown = false

    public confirmButtonLoading: Loading = 'idle'
    showLoading() {
        this.confirmButtonLoading = 'pending'
    }
    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private spinner: NgxSpinnerService) {}

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
                this.textValue = this.text
            }
        })

        detectChangesOn(changes, 'text', (v) => {
            this.textValue = v
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    onReset(): void {
        this.textValue = ''
    }
    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({
            loading: {
                showLoading: this.showLoading.bind(this),
                hideLoading: this.hideLoading.bind(this),
            },
            textValue: this.textValue,
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
