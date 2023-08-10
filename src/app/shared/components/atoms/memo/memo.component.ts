import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core'
import {  Subject } from 'rxjs'
import { FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'

import _ from 'lodash'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rwa-memo',
    templateUrl: './memo.component.html',
    styleUrls: ['./memo.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: MemoComponent,
        },
    ],
})
export class MemoComponent implements OnDestroy {
    public value = this.fb.control('')
    @Input() placeholder = '메모를 입력해 주세요.'
    @Input() bgColor = 'var(--white)'

    @Input() showButton = false
    @Input() buttonDisable = false
    @Input() buttonText = '저장'
    @Input() buttonWidth = '62px'
    @Input() buttonHeight = '43px'
    @Output() onButtonClick = new EventEmitter<any>()

    @Input() width = '340px'
    @Input() height = '254px'

    @ViewChild('textarea') textarea_el: ElementRef
    onTextAreaLayoutFocus() {
        this.textarea_el.nativeElement.focus()
    }
    public textAreaFocused = false

    public unSubscriber$ = new Subject<boolean>()

    constructor(private fb: FormBuilder) {}
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    touched = false

    // Custom Form Controls: ControlValueAccessor 와 관련된 메서드
    // 참고 링크 : https://blog.angular-university.io/angular-custom-form-controls/
    // onChange = (_) => {}
    onTouched = () => {}

    writeValue(text: string) {
        if (text) {
            this.value.setValue(text, { emitEvent: false })
        }
    }

    registerOnChange(onChange: any) {
        this.value.valueChanges.pipe(takeUntil(this.unSubscriber$)).subscribe(onChange)
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
            this.value.disable()
        } else {
            this.value.enable()
        }
    }
}
