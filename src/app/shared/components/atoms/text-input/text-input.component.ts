import { Component, Input, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Subject } from 'rxjs'

import {
    AsyncValidatorFn,
    ValidatorFn,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    FormBuilder,
    FormControl,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms'
import { takeUntil } from 'rxjs/operators'

import { Status } from '@schemas/components/status'

@Component({
    selector: 'rwa-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TextInputComponent,
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: TextInputComponent,
        },
    ],
})
export class TextInputComponent implements AfterViewInit {
    @Input() textFieldType: 'normal' | 'password' | 'search' = 'normal'
    @Input() type: 'normal' | 'timeLimit' | 'wordLimit' = 'normal'
    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() placeholder = ''
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: Status = 'none'
    @Input() statusText = ''
    @Input() isImportant = false

    @Input() maxLength: number = undefined

    @Input() timeLimit = 0

    @Input() width = '400px'
    @Input() height = '48px'

    @Input() passwordVisible = false

    @ViewChild('input') input_el: ElementRef

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

    constructor(private fb: FormBuilder, private renderer: Renderer2) {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    // for NG_VALUE_ACCESSOR
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
