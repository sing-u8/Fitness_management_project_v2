import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'

import { InputHelperService } from '@services/helper/input-helper.service'

import { AsyncValidatorFn, ValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
    selector: 'rwa-number-text-field',
    templateUrl: './number-text-field.component.html',
    styleUrls: ['./number-text-field.component.scss'],
})
export class NumberTextFieldComponent implements OnChanges, AfterViewInit {
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

    public textField: FormControl = this.fb.control('')
    public isSetInInputChangeFn = false
    resetTextField() {
        this.textField.setValue('')
        this.input_el.nativeElement.focus()
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
        this.textField.valueChanges.subscribe((v) => {
            this.textField.setValue(
                String(v)
                    .replace(/[^0-9]/gi, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                { emitEvent: false }
            )
            this.onValueChange.emit(this.textField.value)
        })
    }
    ngAfterViewInit() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'disable', (disable) => {
            if (disable) {
                this.textField.disable()
            } else {
                this.textField.enable()
            }
        })
        detectChangesOn(changes, 'value', (v) => {
            this.textField.setValue(v, { emitEvent: false })
        })
    }

    restrictToNumber(event) {
        return this.inputHelper.restrictToNumber(event)
    }
}
