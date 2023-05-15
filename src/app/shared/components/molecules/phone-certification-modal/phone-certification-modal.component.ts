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
    OnInit,
    ViewChild,
    AfterViewInit,
    OnDestroy,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

import { Observe } from '@shared/helper/decorator/Observe'

import { Loading } from '@schemas/loading'
import { User } from '@schemas/user'

import { Observable, Subject } from 'rxjs'
import { ModalOutPut } from '@schemas/components/modal'
import { TextFieldComponent } from '@shared/components/atoms/text-field/text-field.component'
import { Registration } from '@schemas/appStore/registration.interface'
import { Status } from '@schemas/components/status'
import { select, Store } from '@ngrx/store'
import { registrationSelector } from '@store/app/selectors/selectors'
import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'
import { InputHelperService } from '@services/helper/input-helper.service'
import { showToast } from '@store/app/actions/toast.action'
import { AuthErrors } from '@schemas/errors/auth-errors'
import { takeUntil } from 'rxjs/operators'
import _ from 'lodash'

@Component({
    selector: 'rwm-phone-certification-modal',
    templateUrl: './phone-certification-modal.component.html',
    styleUrls: ['./phone-certification-modal.component.scss'],
})
export class PhoneCertificationModalComponent implements OnChanges, OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() visible = false
    @Observe('visible') visible$: Observable<boolean>
    @Output() visibleChange = new EventEmitter<boolean>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() confirm = new EventEmitter<ModalOutPut>()

    public changed: boolean

    // ------------------------------------------------------------------------------
    @ViewChild('phoneNumberRef')
    phoneNumberRef: TextFieldComponent

    @ViewChild('verificationCodeRef')
    public verificationCodeRef: any

    public user: User
    public registration: Registration

    public phoneNumber = this.fb.control('', {
        validators: [Validators.pattern(/^\d{3}-\d{4}-\d{4}$/), Validators.required],
    })

    public phoneNumberError: string
    public phoneNumberStatus: Status = 'none'
    public verificationCode = this.fb.control('')

    public verifTextType: 'normal' | 'timeLimit' | 'wordLimit' = 'normal'

    public timeLeft: number
    public interval: NodeJS.Timeout

    public sendVerifCodeStatus: Loading = 'idle'
    public finishVerificationStatus: Loading = 'idle'

    public unDescriber$ = new Subject<boolean>()

    // ------------------------------------------------------------------------------

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private renderer: Renderer2,
        private nxStore: Store,
        private storageService: StorageService,
        private authService: AuthService,
        private inputHelper: InputHelperService
    ) {}

    ngOnInit() {
        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        this.user = this.storageService.getUser()
    }
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['visible'] &&
            !changes['visible'].firstChange &&
            changes['visible'].previousValue != changes['visible'].currentValue
        ) {
            this.changed = true
        }

        this.phoneNumber.valueChanges.pipe(takeUntil(this.unDescriber$)).subscribe((v) => {
            let value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
            if (value.length > 0) {
                if (value.length > 3 && value.length < 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3)
                } else if (value.length >= 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
                }
            }
            this.phoneNumber.setValue(value, { emitEvent: false })
        })
        this.verificationCode.valueChanges.pipe(takeUntil(this.unDescriber$)).subscribe((v) => {
            const value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
            this.verificationCode.setValue(value, { emitEvent: false })
        })
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

                this.user = this.storageService.getUser()
                this.phoneNumberRef.input_el.nativeElement.focus()
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.reset()
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    onCancel(): void {}

    onConfirm(): void {}

    // ------------------------------------------------------------------------------

    public isTimeOut = false
    startTimer() {
        this.verificationCode.setValue('')
        this.phoneNumberError = ''
        this.isTimeOut = false

        this.timeLeft = 3 * 60
        const startTime = new Date().getTime()
        const endTime = startTime + 3 * 60 * 1000 // getTime() = ms

        this.verifTextType = 'timeLimit'
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--
                this.timeLeft = Math.round((endTime - new Date().getTime()) / 1000)
            } else {
                this.stopTimer()
            }
        }, 200)
    }

    stopTimer() {
        this.phoneNumberError = '입력 시간이 지났어요. [인증번호 받기] 버튼을 눌러주세요!'
        this.phoneNumberStatus = 'error'
        this.isTimeOut = true
        this.verifTextType = 'timeLimit'
        clearInterval(this.interval)
    }

    reset() {
        this.isTimeOut = false

        this.phoneNumber.setValue('')
        this.verificationCode.setValue('')
        this.phoneNumberError = ''
        this.phoneNumberStatus = 'none'
        this.verifTextType = 'normal'
        this.sendVerifCodeStatus = 'idle'
        this.finishVerificationStatus = 'idle'
        clearInterval(this.interval)
    }

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        return !(code < 48 || code > 57)
    }

    formCheck() {
        let isValid = false

        const verificationCode = this.verificationCode.value
        if (this.phoneNumber.valid && verificationCode && verificationCode.length == 4 && this.timeLeft > 0) {
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeSMSChange() {
        if (!this.phoneNumber.valid || this.sendVerifCodeStatus == 'pending') {
            return
        }

        this.verificationCode.setValue('')
        this.phoneNumberError = ''
        this.phoneNumberStatus = 'none'
        this.verificationCodeRef.input_el.nativeElement.focus()
        this.sendVerifCodeStatus = 'pending'
        this.authService
            .sendVerificationCodeSMSChange({ phone_number: _.replace(this.phoneNumber.value, /[^0-9]/gi, '') })
            .subscribe({
                next: (v) => {
                    this.sendVerifCodeStatus = 'idle'
                    this.nxStore.dispatch(showToast({ text: '인증번호가 전송되었어요.' }))
                    if (this.interval) {
                        this.stopTimer()
                    }
                    this.startTimer()
                    this.phoneNumberStatus = 'none'
                },
                error: (e) => {
                    this.sendVerifCodeStatus = 'idle'
                    this.nxStore.dispatch(showToast({ text: AuthErrors[e.code].message }))
                },
            })
    }

    next() {
        this.finishVerificationStatus = 'pending'
        this.authService
            .checkVerificationCodeSMSChange({
                verification_code: Number(this.verificationCode.value),
            })
            .subscribe({
                next: (v) => {
                    this.finishVerificationStatus = 'idle'
                    this.user.phone_number = this.phoneNumber.value
                    this.user.phone_number_verified = true
                    this.phoneNumberStatus = 'none'
                    this.phoneNumberError = ''
                    this.storageService.setUser(this.user)
                    this.nxStore.dispatch(showToast({ text: '전화번호가 추가되었어요.' }))
                    setTimeout(() => {
                        this.reset()
                    })
                    this.confirm.emit()
                },
                error: (e) => {
                    this.finishVerificationStatus = 'idle'
                    if (e.code == 'FUNCTION_AUTH_006') {
                        this.phoneNumberError = '인증번호가 일치하지 않아요.'
                    } else if (e.code == 'FUNCTION_AUTH_007') {
                        this.phoneNumberError = '입력 시간이 지났어요. [인증번호 받기] 버튼을 눌러주세요!'
                    }
                    this.phoneNumberStatus = 'error'
                },
            })
    }

    onKeyup(event, type) {
        if (!this.isTimeOut) {
            this.phoneNumberError = ''
            this.phoneNumberStatus = 'none'
        }

        if (type == 'phoneNumber') {
            if (event.key == 'Enter') {
                if (this.phoneNumber.valid) {
                    this.sendVerificationCodeSMSChange()
                }
            }
        } else if (type == 'verificationCode') {
            if (event.key == 'Enter') {
                if (this.formCheck()) {
                    this.next()
                }
            }
            this.user.phone_number_verified = false
        }
    }

    restrictToNumber(event) {
        return this.inputHelper.restrictToNumber(event)
    }
}
