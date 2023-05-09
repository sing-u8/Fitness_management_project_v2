import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'

import { InputHelperService } from '@services/helper/input-helper.service'

import { AsyncValidatorFn, ValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'rwa-number-text-field',
    templateUrl: './number-text-field.component.html',
    styleUrls: ['./number-text-field.component.scss'],
})
export class NumberTextFieldComponent {
    @Input() value = ''
    @Output() onValueChange = new EventEmitter<string>()

    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() placeholder = '0'
    @Input() disable = false
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: 'warning' | 'error' | 'none' = 'none'
    @Input() statusText = ''

    @Input() width = '400px'
    @Input() height = '48px'

    @ViewChild('input') input_el: ElementRef

    @Observe('value') value$: Observable<string>
    @Observe('inputLimit') inputLimit$: Observable<number>
    @Observe('width') width$: Observable<string>
    @Observe('height') height$: Observable<string>
    @Observe('disable') disable$: Observable<boolean>

    public textField: FormControl = this.fb.control('')
    public isSetInInputChangeFn = false
    resetTextField() {
        this.textField.setValue('')
    }

    public isMouseOn = false
    public isMouseDown = false
    public isFocused = false
    onFocus() {
        this.isFocused = true
    }
    onFocusOut() {
        if (!this.isMouseDown) this.isFocused = false
    }


    constructor(private fb: FormBuilder, private renderer: Renderer2, private inputHelper: InputHelperService) {
        this.value$.subscribe((v) => {
            this.textField.setValue(v, { emitEvent: false })
        })
        this.textField.valueChanges.subscribe((v) => {
            this.textField.setValue(
                String(v)
                    .replace(/[^0-9]/gi, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                { emitEvent: false }
            )
            this.onValueChange.emit(this.textField.value)
        })

        this.disable$.subscribe((disable) => {
            if (disable) {
                this.textField.disable()
            } else {
                this.textField.enable()
            }
        })
    }
    ngAfterViewInit() {
        this.width$.subscribe((w) => {
            this.renderer.setStyle(this.input_el.nativeElement, 'width', w)
        })
        this.height$.subscribe((h) => {
            this.renderer.setStyle(this.input_el.nativeElement, 'height', h)
        })
    }

    restrictToNumber(event) {
        return this.inputHelper.restrictToNumber(event)
    }
}
