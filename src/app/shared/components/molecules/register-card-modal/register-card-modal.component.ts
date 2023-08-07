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
    ChangeDetectorRef,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

import { InputHelperService } from '@services/helper/input-helper.service'

import { ButtonEmit } from '@schemas/components/button'
import { Loading } from '@schemas/loading'
import { CreateCustomerReqBody } from '@services/center-customers.service'

@Component({
    selector: 'rwm-register-card-modal',
    templateUrl: './register-card-modal.component.html',
    styleUrls: ['./register-card-modal.component.scss'],
})
export class RegisterCardModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() blockClickOutside = false
    @Input() isError = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{
        btLoading: ButtonEmit
        reqBody: CreateCustomerReqBody
    }>()

    public changed: boolean

    public isMouseModalDown: boolean

    public buttonLoading: Loading = 'idle'

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private inputHelperService: InputHelperService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
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

                this.formGroup.reset()
            }
            this.cd.detectChanges()
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        this.isError = false
    }

    onConfirm(): void {
        this.confirm.emit({
            btLoading: {
                showLoading: () => {
                    this.buttonLoading = 'pending'
                },
                hideLoading: () => {
                    this.buttonLoading = 'idle'
                },
            },
            reqBody: {
                card_number: String(
                    this.formGroup.get('cardNumber').get('one').value +
                        '-' +
                        this.formGroup.get('cardNumber').get('two').value +
                        '-' +
                        this.formGroup.get('cardNumber').get('three').value +
                        '-' +
                        this.formGroup.get('cardNumber').get('four').value
                ),
                expiry: String(
                    '20' +
                        this.formGroup.get('expirationDate').get('two').value +
                        '-' +
                        this.formGroup.get('expirationDate').get('one').value
                ),
                birth: String(this.formGroup.get('birthDate').value),
                pwd_2digit: String(this.formGroup.get('password').value),
                cvc: String(this.formGroup.get('cvc').value),
            },
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    //
    restrictToNumber(event) {
        return this.inputHelperService.restrictToNumber(event)
    }

    commonValidators = (minLen: number, maxLen: number) => [
        Validators.required,
        Validators.maxLength(maxLen),
        Validators.minLength(minLen),
    ]
    public formGroup = this.fb.group({
        cardNumber: this.fb.group({
            one: ['', { validators: this.commonValidators(4, 4) }],
            two: ['', { validators: this.commonValidators(4, 4) }],
            three: ['', { validators: this.commonValidators(4, 4) }],
            four: ['', { validators: this.commonValidators(4, 4) }],
        }),
        expirationDate: this.fb.group({
            one: ['', { validators: this.commonValidators(2, 2) }],
            two: ['', { validators: this.commonValidators(2, 2) }],
        }),
        cvc: ['', { validators: [Validators.required, Validators.maxLength(3)] }],
        birthDate: ['', { validators: this.commonValidators(6, 6) }],
        password: ['', { validators: this.commonValidators(2, 2) }],
    })

    public infoTooltipText = {
        title: `카드 등록 후 해당 카드는 자동 결제 수단으로 지정되며,
                [센터 설정 > 이용권 결제 관리 > 결제 수단 관리]에서
                등록한 결제 수단을 관리하실 수 있어요.`,
    }
}
