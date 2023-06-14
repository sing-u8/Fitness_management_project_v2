import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { TextFieldComponent } from '@shared/components/atoms/text-field/text-field.component'

import { AuthService } from '@services/auth.service'
import { Registration } from '@schemas/appStore/registration.interface'

import _ from 'lodash'

// helper
import { isEmail, isPassword } from '@shared/helper/form-helper'

// ngrx
import { Store, select } from '@ngrx/store'
import { registrationSelector } from '@store/app/selectors/selectors'
import { setRegistration } from '@store/app/actions/registration.action'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwp-reg-info',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './reg-info.component.html',
    styleUrls: ['./reg-info.component.scss'],
})
export class RegInfoComponent implements OnInit, AfterViewInit {
    TAG = '회원가입'

    @ViewChild('emailInput') emailInput: TextFieldComponent
    public keyup$: Observable<any>

    public registration: Registration

    public name = ''
    public email = ''
    public emailError = ''
    public emailValid = false
    public password = ''
    public passwordVisible = false
    public passwordError = ''
    public passwordValid = false
    public passwordStatus: 'warning' | 'error' | 'success' | 'none' = 'none'

    public nextButtonStatus: Loading = 'idle'

    public errorModalData = {
        title: '',
        desc: '',
    }
    public existedEmailErrData = {
        title: `이미 사용 중인 이메일입니다.`,
        desc: `기존 계정으로 로그인하시거나,
            다른 이메일 주소로 가입해 주세요.`,
    }
    public linkedEmailErrData = {
        title: `이메일에 연동된 계정이 있어요.`,
        desc: `기존에 가입한 소셜 계정으로 로그인하실 수 있어요. 계속해서 회원가입을 하시면, 기존
                소셜 계정의 모든 정보가 연동됩니다.`,
    }
    public linkedAccountStr = ''
    getLinkedAccountStr(str: string) {
        let linkedAccountArr = _.map(_.split(str, ','), _.trim)
        linkedAccountArr = _.map(linkedAccountArr, (v) => {
            if (v == 'google.com') {
                return '구글'
            } else if (v == 'apple.com') {
                return '애플'
            } else if (v == 'kakao.com') {
                return '카카오'
            } else {
                return '레드웨일'
            }
        })
        this.linkedAccountStr = _.join(linkedAccountArr, ', ')
    }

    constructor(
        private location: Location,
        private router: Router,
        private nxStore: Store,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.password = ''

        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.registration) {
            this.name = this.registration.name
            this.email = this.registration.email
            this.emailValid = this.registration.emailValid
            this.password = this.registration.password ? this.registration.password : ''
            this.passwordValid = this.registration.passwordValid

            this.formCheck()
        }
    }

    ngAfterViewInit() {}

    changePasswordVisible(passwordVisible: boolean) {
        this.passwordVisible = passwordVisible
    }

    formCheck() {
        let isValid = false

        if (this.checkRegistration() && this.name && isEmail(this.email) && this.checkPasswordPattern(this.password)) {
            isValid = true
        }

        return isValid
    }

    checkEmailPattern() {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (emailRegex.test(this.email)) {
            isValid = true
        }

        return isValid
    }

    checkPassword() {
        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (this.password.length == 0) {
            this.passwordError = ''
            this.passwordValid = false
            this.passwordStatus = 'none'
        } else if (pattern4.test(this.password)) {
            this.passwordError = '공백을 포함할 수 없어요.'
            this.passwordStatus = 'warning'
            this.passwordValid = false
        } else if (this.password.length < 8) {
            this.passwordError = '비밀번호가 너무 짧아요. (8자 이상)'
            this.passwordStatus = 'warning'
            this.passwordValid = false
        } else if (!pattern1.test(this.password) || !pattern2.test(this.password) || !pattern3.test(this.password)) {
            this.passwordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
            this.passwordStatus = 'warning'
            this.passwordValid = false
        } else {
            this.passwordError = ''
            this.passwordStatus = 'success'
            this.passwordValid = true
        }
    }

    checkPasswordPattern(password: string) {
        let isValid = false

        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (
            pattern1.test(password) &&
            pattern2.test(password) &&
            pattern3.test(password) &&
            !pattern4.test(password) &&
            8 <= password.length &&
            password.length <= 15
        ) {
            isValid = true
        }

        return isValid
    }

    // modal vars and funcs
    public showEmailExistModal = false
    setShowEmailExistModal(flag: boolean) {
        this.showEmailExistModal = flag
    }
    goBackToInfo() {
        this.showEmailExistModal = false
        this.email = ''
        this.emailInput.input_el.nativeElement.focus()
    }
    goLogin() {
        this.router.navigateByUrl('/auth/login')
    }
    //
    back() {
        this.router.navigateByUrl('/auth/terms')
    }
    next() {
        this.nextButtonStatus = 'pending'
        this.authService.checkDuplicateMail({ email: this.email }).subscribe(
            (v) => {
                this.nextButtonStatus = 'idle'
                if (_.isEmpty(v)) {
                    this.goNextPage()
                } else {
                    this.errorModalData = this.linkedEmailErrData
                    this.emailError = '이미 사용중인 이메일입니다.'
                    this.setShowEmailExistModal(true)
                    this.getLinkedAccountStr(v)
                }
            },
            (e) => {
                this.errorModalData = this.existedEmailErrData
                this.linkedAccountStr = ''
                this.emailError = '이미 사용중인 이메일입니다.'
                this.setShowEmailExistModal(true)
                this.nextButtonStatus = 'idle'
            }
        )
    }
    goNextPage() {
        this.linkedAccountStr = ''
        this.emailValid = true
        this.nxStore.dispatch(
            setRegistration({
                registration: {
                    name: this.name.trim(),
                    email: this.email,
                    emailValid: this.emailValid,
                    password: this.password,
                    passwordValid: this.passwordValid,
                },
            })
        )
        this.router.navigateByUrl('/auth/registration/email')
    }

    onKeyup(event, type: string) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.next()
            }
        } else {
            if (event.key != 'Tab' && type == 'password') {
                this.checkPassword()
            }
        }
    }

    checkRegistration() {
        let isValid = false

        if (this.registration && this.registration.service_terms && this.registration.privacy) {
            isValid = true
        }

        return isValid
    }
}

// checkDuplicateMail(key: string, email: string) {
//     if (key == 'Tab') {
//         return
//     }
//
//     if (key == 'Enter') {
//         if (this.formCheck()) {
//             this.next()
//         }
//         return
//     }
//
//     this.emailError = ''
//     if (!this.checkEmailPattern()) {
//         this.emailValid = false
//         return
//     }
//
//     this.authService.checkDuplicateMail({ email: email }).subscribe(
//         (v) => {
//             this.emailValid = true
//         },
//         (e) => {
//             this.emailError = '이미 사용중인 이메일입니다.'
//         }
//     )
// }
