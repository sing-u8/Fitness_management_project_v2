import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { RouterService } from '@services/auth/router.service'
import { AuthService } from '@services/auth.service'
import { InputHelperService } from '@services/helper/input-helper.service'
import { AuthErrors } from '@schemas/errors/auth-errors'

import { User } from '@schemas/user'
import { Registration } from '@schemas/appStore/registration.interface'
import { Status } from '@schemas/components/status'

import { Observe } from '@shared/helper/decorator/Observe'

import { TextFieldComponent } from '@shared/components/atoms/text-field/text-field.component'

// rxjs
import { BehaviorSubject, Subscription, Observable, Subject } from 'rxjs'
import { distinctUntilChanged, debounceTime, filter, map, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import { setRegistration } from '@store/app/actions/registration.action'
import { registrationSelector } from '@store/app/selectors/selectors'
import { showToast } from '@store/app/actions/toast.action'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwp-reg-phone',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './reg-phone.component.html',
    styleUrls: ['./reg-phone.component.scss'],
})
export class RegPhoneComponent implements OnInit, AfterViewInit, OnDestroy {
    TAG = '회원가입'

    @ViewChild('phoneNumberRef')
    phoneNumberRef: TextFieldComponent

    @ViewChild('verificationCodeRef')
    public verificationCodeRef: any

    public user: User
    public isSocialUser = false

    public registration: Registration

    public phoneNumber = ''
    onPhoneNumberChange(v: string) {
        this.phoneNumber = String(v).replace(/[^0-9]/gi, '')
        console.log('onPhoneNumberChange -- ', v, ' -- after : ', this.phoneNumber)
    }
    public phoneNumberValid: boolean
    public phoneNumberError: string
    public phoneNumberStatus: Status = 'none'
    public verificationCode = ''
    onVerifCodeChange(v: string) {
        this.verificationCode = String(v).replace(/[^0-9]/gi, '')
        console.log('onPhoneNumberChange -- ', v, ' -- after : ', this.verificationCode)
    }
    public verifTextType: 'normal' | 'timeLimit' | 'wordLimit' = 'normal'

    public timeLeft: number
    public interval: NodeJS.Timeout

    public routerSubscription: Subscription
    public isSocial: boolean

    public sendVerifCodeStatus: Loading = 'idle'
    public finishVerificationStatus: Loading = 'idle'

    public unDescriber$ = new Subject<boolean>()

    constructor(
        private router: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private authService: AuthService,
        private routerService: RouterService,
        private inputHelper: InputHelperService
    ) {
        this.routerSubscription = this.routerService.initUserDataWhenPopstate()
        this.isSocialUser = this.storageService.isSocialUser()
    }

    ngOnInit(): void {
        this.user = this.storageService.getUser()
        this.isSocial = !(this.user == null || (this.user != null && this.user.provider == 'redwhale.xyz'))
        this.timeLeft = -1

        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.registration) {
            this.nxStore.dispatch(
                setRegistration({
                    registration: {
                        regCompleted: true,
                    },
                })
            )
        }
    }
    ngAfterViewInit() {
        this.phoneNumberRef.input_el.nativeElement.focus()
    }
    ngOnDestroy() {
        this.stopTimer()
        this.routerSubscription.unsubscribe()
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    async backToLogin() {
        await this.routerService.backToLogin()
    }

    public isTimeOut = false
    startTimer() {
        this.verificationCode = ''
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
        this.phoneNumberError = '입력 시간이 초과되었어요. [인증번호 받기] 버튼을 다시 눌러주세요!'
        this.phoneNumberStatus = 'error'
        this.isTimeOut = true
        this.verificationCode = ''
        this.verifTextType = 'timeLimit'
        clearInterval(this.interval)
    }

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }

    checkPhoneNumber() {
        const phoneNumberRegex = /^\d{10,11}$/
        if (phoneNumberRegex.test(this.phoneNumber)) {
            this.phoneNumberValid = true
        } else {
            this.phoneNumberValid = false
        }
    }

    formCheck() {
        let isValid = false

        const verificationCode = this.verificationCode + ''
        if (this.phoneNumberValid && verificationCode && verificationCode.length == 4 && this.timeLeft > 0) {
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeSMSChange() {
        if (!this.phoneNumberValid) {
            return
        }

        this.verificationCode = ''
        this.phoneNumberError = ''
        this.phoneNumberStatus = 'none'
        this.verificationCodeRef.valueAccessor.input_el.nativeElement.focus()
        this.sendVerifCodeStatus = 'pending'
        this.authService.sendVerificationCodeSMSChange({ phone_number: this.phoneNumber }).subscribe({
            next: (v) => {
                this.sendVerifCodeStatus = 'idle'
                this.nxStore.dispatch(showToast({ text: '카톡으로 인증번호가 전송되었습니다.' }))
                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            error: (e) => {
                this.sendVerifCodeStatus = 'idle'
                this.nxStore.dispatch(showToast({ text: AuthErrors[e.code].message }))
            },
        })
    }

    back() {
        this.router.navigateByUrl('/auth/registration/email')
    }

    next() {
        this.finishVerificationStatus = 'pending'
        this.authService
            .checkVerificationCodeSMSChange({
                verification_code: Number(this.verificationCode),
            })
            .subscribe({
                next: (v) => {
                    this.finishVerificationStatus = 'done'
                    this.user.phone_number = this.phoneNumber
                    this.user.phone_number_verified = true
                    this.phoneNumberStatus = 'none'
                    this.phoneNumberError = ''
                    this.storageService.setUser(this.user)
                    this.router.navigateByUrl('/auth/registration/completed')
                },
                error: (e) => {
                    this.finishVerificationStatus = 'idle'
                    if (e.code == 'FUNCTION_AUTH_006') {
                        this.phoneNumberError = '인증번호를 잘못 입력하셨습니다.'
                    } else if (e.code == 'FUNCTION_AUTH_007') {
                        this.phoneNumberError = '입력 시간이 초과되었어요. [인증번호 받기] 버튼을 다시 눌러주세요!'
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
                if (this.phoneNumberValid) {
                    this.sendVerificationCodeSMSChange()
                }
            } else {
                this.checkPhoneNumber()
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
