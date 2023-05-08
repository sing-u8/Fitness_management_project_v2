import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { CommonModule, Location } from '@angular/common'
import { Router } from '@angular/router'
import { Auth, authState, signInWithCustomToken } from '@angular/fire/auth'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'
import { Registration } from '@schemas/appStore/registration.interface'

// rxjs
import { Observable, Subscription } from 'rxjs'
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators'
// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
import { registrationSelector } from '@store/app/selectors/selectors'
import { SharedModule } from '@shared/shared.module'
import { Observe } from '@shared/helper/decorator/Observe'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwp-reg-email',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './reg-email.component.html',
    styleUrls: ['./reg-email.component.scss'],
})
export class RegEmailComponent implements OnInit, AfterViewInit, OnDestroy {
    TAG = '회원가입'

    public registration: Registration

    public email: string
    public verificationCode = ''
    @Observe('verificationCode') verificationCode$: Observable<string>
    public verificationStatus: 'warning' | 'error' | 'none' = 'none'
    public error: string
    public isNumberValid = false

    public timeLeft = 0
    public interval: NodeJS.Timeout

    subscription: Subscription

    constructor(
        private location: Location,
        private router: Router,
        private nxStore: Store,
        private authService: AuthService,
        private fireAuth: Auth,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.checkRegistration()) {
            this.email = this.registration.email
            this.sendVerificationCodeMail(false)
        } else {
            this.email = ''
        }
        this.subscription = authState(this.fireAuth).subscribe((firebaseUser) => {
            if (firebaseUser) {
                this.storageService.setSignInMethod('email')
            }
        })

        this.verificationCode$
            .pipe(
                distinctUntilChanged(),
                debounceTime(300),
                filter((v) => v.length == 4 && this.email.length > 0)
            )
            .subscribe({
                next: (v) => {
                    this.authService
                        .checkVerificationCodeMail({
                            email: this.email,
                            verification_code: Number(this.verificationCode),
                        })
                        .subscribe({
                            next: () => {
                                this.isNumberValid = true
                            },
                            error: () => {
                                this.error = '인증번호가 일치하지 않습니다.'
                                this.verificationStatus = 'error'
                            },
                        })
                },
            })
    }

    ngAfterViewInit() {}
    ngOnDestroy(): void {}

    startTimer() {
        this.error = ''
        this.verificationStatus = 'none'

        this.timeLeft = 3 * 60
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--
            } else {
                this.stopTimer()
            }
        }, 1000)
    }

    stopTimer() {
        this.error = '입력 시간이 지났어요. 아래 [재전송하기]를 눌러주세요!'
        this.verificationStatus = 'error'
        this.verificationCode = ''

        clearInterval(this.interval)
    }

    formCheck() {
        let isValid = false

        if (this.checkRegistration() && this.isNumberValid) {
            this.verificationStatus = 'none'
            this.error = ''
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeMail(isShowModal: boolean) {
        this.verificationCode = ''
        this.authService.sendVerificationCodeMail({ email: this.email }).subscribe({
            next: (v) => {
                if (isShowModal) {
                    this.nxStore.dispatch(showToast({ text: '인증번호 메일이 전송되었어요.' }))
                }

                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: e.message }))
            },
        })
    }

    back() {
        this.router.navigateByUrl('/auth/registration/info')
    }

    public nextButtonStatus: Loading = 'idle'
    next() {
        this.nextButtonStatus = 'pending'
        const body = {
            name: this.registration.name,
            email: this.registration.email,
            verification_code: Number(this.verificationCode),
            password: this.registration.password,
            privacy: this.registration.privacy,
            service_terms: this.registration.service_terms,
            sms_marketing: this.registration.sms_marketing,
            email_marketing: this.registration.email_marketing,
        }

        this.authService.registration(body).subscribe({
            next: (user: User) => {
                signInWithCustomToken(this.fireAuth, user.custom_token)
                this.nextButtonStatus = 'idle'
                this.router.navigateByUrl('/auth/registration/phone')
            },
            error: (e) => {
                this.nextButtonStatus = 'idle'
            },
        })
    }

    checkRegistration() {
        let isValid = false

        if (
            this.registration &&
            this.registration.service_terms &&
            this.registration.privacy &&
            this.registration.name &&
            this.registration.email &&
            this.registration.emailValid &&
            this.registration.password &&
            this.registration.passwordValid
        ) {
            isValid = true
        }

        return isValid
    }
}
