import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    ViewChild,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core'
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms'

import { InputHelperService } from '@services/helper/input-helper.service'

import _ from 'lodash'
import { Subscription } from 'rxjs'

@Component({
    selector: 'rwa-verification-field',
    templateUrl: './verification-field.component.html',
    styleUrls: ['./verification-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: VerificationFieldComponent,
        },
    ],
})
export class VerificationFieldComponent implements OnChanges, OnDestroy {
    @Input() value = ''
    @Output() onValueChange = new EventEmitter<string>()

    @Input() labelVisible = true
    @Input() label = '필드 레이블'

    @Input() hint = ''
    @Input() status: 'warning' | 'error' | 'none' = 'none'
    @Input() statusText = ''

    @ViewChild('one') one_el: ElementRef
    @ViewChild('two') two_el: ElementRef
    @ViewChild('three') three_el: ElementRef
    @ViewChild('four') four_el: ElementRef

    public form = this.fb.group({
        one: '',
        two: '',
        three: '',
        four: '',
    })

    public onChangeSubs: Subscription[] = []

    get one() {
        return this.form.get('one')
    }
    get two() {
        return this.form.get('two')
    }
    get three() {
        return this.form.get('three')
    }
    get four() {
        return this.form.get('four')
    }

    constructor(private fb: FormBuilder, private renderer: Renderer2, private inputHelper: InputHelperService) {
        this.one.valueChanges.subscribe((v) => {
            this.one.setValue(String(v).replace(/[^0-9]/gi, ''), { emitEvent: false })
            this.emitNumber()
        })
        this.two.valueChanges.subscribe((v) => {
            this.two.setValue(String(v).replace(/[^0-9]/gi, ''), { emitEvent: false })
            this.emitNumber()
        })
        this.three.valueChanges.subscribe((v) => {
            this.three.setValue(String(v).replace(/[^0-9]/gi, ''), { emitEvent: false })
            this.emitNumber()
        })
        this.four.valueChanges.subscribe((v) => {
            this.four.setValue(String(v).replace(/[^0-9]/gi, ''), { emitEvent: false })
            this.emitNumber()
        })
    }
    ngOnChanges(changes: SimpleChanges) {}
    ngOnDestroy() {
        for (const sub of this.onChangeSubs) {
            sub.unsubscribe()
        }
    }

    whenKeyDelete(position: 'one' | 'two' | 'three' | 'four') {
        if (position == 'two') {
            this.one_el.nativeElement.focus()
        } else if (position == 'three') {
            this.two_el.nativeElement.focus()
        } else if (position == 'four') {
            this.three_el.nativeElement.focus()
        }
    }
    whenKeyUp(event, position: 'one' | 'two' | 'three' | 'four') {
        if (event.key == 'Tab') return
        if (position == 'one') {
            this.one.setValue(event.key)
            if (!_.isEmpty(this.one.value)) this.two_el.nativeElement.focus()
        } else if (position == 'two') {
            this.two.setValue(event.key)
            if (!_.isEmpty(this.two.value)) this.three_el.nativeElement.focus()
        } else if (position == 'three' && this.three.value.length == 1) {
            this.three.setValue(event.key)
            if (!_.isEmpty(this.three.value)) this.four_el.nativeElement.focus()
        } else if (position == 'four' && this.four.value.length == 1) {
            this.four.setValue(event.key)
        }
    }

    emitNumber() {
        this.onValueChange.emit(this.one.value + this.two.value + this.three.value + this.four.value)
    }

    restrictToNumber(event) {
        return this.inputHelper.restrictToNumber(event)
    }

    //
    // Custom Form Controls: ControlValueAccessor 와 관련된 메서드
    // 참고 링크 : https://blog.angular-university.io/angular-custom-form-controls/
    onTouched: () => void = () => {}
    registerOnChange(onChange: any) {
        const sub = this.form.valueChanges.subscribe(onChange)
        this.onChangeSubs.push(sub)
    }

    registerOnTouched(onTouched: () => void) {
        this.onTouched = onTouched
    }

    setDisabledState(disabled: boolean) {
        if (disabled) {
            this.form.disable()
        } else {
            this.form.enable()
        }
    }

    writeValue(value: any) {
        if (value) {
            this.form.setValue(value, { emitEvent: false })
        }
    }
}
