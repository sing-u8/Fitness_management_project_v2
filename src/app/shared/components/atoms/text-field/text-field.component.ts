import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'

import { AsyncValidatorFn, ValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'rwa-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent implements AfterViewInit {
    @Input() value = ''
    @Output() onValueChange = new EventEmitter<string>()

    @Input() type: 'normal' | 'timeLimit' | 'wordLimit' = 'normal'
    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() placeholder = ''
    @Input() disable = false
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: 'warning' | 'error' | 'success' | 'none' = 'none'
    @Input() statusText = ''

    @Input() inputLimit = 500

    @Input() timeLimit = 0

    @Input() width = '400px'
    @Input() height = '48px'

    @ViewChild('input') input_el: ElementRef

    @Observe('value') value$: Observable<string>
    @Observe('inputLimit') inputLimit$: Observable<number>
    @Observe('width') width$: Observable<string>
    @Observe('height') height$: Observable<string>
    @Observe('disable') disable$: Observable<boolean>

    public textField: FormControl = this.fb.control('')
    resetTextField() {
        this.textField.setValue('')
    }

    constructor(private fb: FormBuilder, private renderer: Renderer2) {
        this.value$.subscribe((v) => {
            this.textField.setValue(v, { emitEvent: false })
        })
        this.textField.valueChanges.subscribe((v) => {
            if (this.textField.value.length > this.inputLimit) {
                this.textField.setValue(String(this.textField.value).slice(0, this.inputLimit), { emitEvent: false })
                return
            }
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
}
