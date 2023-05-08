import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable, Subject } from 'rxjs'
import _ from 'lodash'

import {
    NG_VALUE_ACCESSOR,
    FormBuilder,
    FormControl,
    AbstractControl,
    ValidationErrors,
    NG_VALIDATORS,
} from '@angular/forms'
import { takeUntil } from 'rxjs/operators'

import { Status } from '@schemas/components/status'

@Component({
    selector: 'rwa-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TextFieldComponent,
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: TextFieldComponent,
        },
    ],
})
export class TextFieldComponent implements AfterViewInit {
    @Input() value = ''
    @Output() onValueChange = new EventEmitter<string>()

    @Input() textFieldType: 'normal' | 'password' | 'search' = 'normal'
    @Input() type: 'normal' | 'timeLimit' | 'wordLimit' = 'normal'
    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() placeholder = ''
    @Input() disable = false
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: Status = 'none'
    @Input() statusText = ''
    @Input() isImportant = false

    @Input() inputLimit = 500

    @Input() timeLimit = 0

    @Input() width = '400px'
    @Input() height = '48px'

    @Input() passwordVisible = false

    @ViewChild('input') input_el: ElementRef

    @Observe('value') value$: Observable<string>
    @Observe('inputLimit') inputLimit$: Observable<number>
    @Observe('width') width$: Observable<string>
    @Observe('height') height$: Observable<string>
    @Observe('disable') disable$: Observable<boolean>

    public unSubscriber$ = new Subject<boolean>()

    public textField: FormControl = this.fb.control('')
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

    constructor(private fb: FormBuilder, private renderer: Renderer2) {
        this.value$.subscribe((v) => {
            this.textField.setValue(v, { emitEvent: false })
        })
        this.textField.valueChanges.subscribe((v) => {
            if (!_.isEmpty(this.textField.value) && this.textField.value.length > this.inputLimit) {
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
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    touched = false

    // onChange = (_) => {}
    onTouched = () => {}

    writeValue(text: string) {
        this.textField.setValue(text, { emitEvent: false })
    }

    registerOnChange(onChange: any) {
        this.textField.valueChanges.pipe(takeUntil(this.unSubscriber$)).subscribe(onChange)
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched
    }

    markAsTouched() {
        if (!this.touched) {
            this.onTouched()
            this.touched = true
        }
    }

    setDisabledState(disabled: boolean) {
        if (disabled) {
            this.textField.disable()
        } else {
            this.textField.enable()
        }
    }

    // for NG_VALIDATORS
    validate(control: AbstractControl): ValidationErrors | null {
        return null
    }
}
