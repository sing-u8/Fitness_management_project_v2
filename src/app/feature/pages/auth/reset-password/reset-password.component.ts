import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

// schemas
import { User } from '@schemas/user'

// services
import { AuthService } from '@services/auth.service'

// modules
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
import { ModalInput } from '@schemas/components/modal'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwp-reset-password',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    TAG = '비밀번호 변경'

    token: string
    isTokenValid: boolean

    password: string
    passwordVisible: boolean

    passwordStatus: 'warning' | 'error' | 'success' | 'none' = 'none'
    passwordError: string
    passwordValid: boolean
    confirmPassword: string
    confirmPasswordVisible: boolean

    confirmPasswordStatus: 'warning' | 'error' | 'success' | 'none' = 'none'
    confirmPasswordError: string
    confirmPasswordValid: boolean

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private nxStore: Store,
        private location: Location
    ) {
        this.password = ''
        this.confirmPassword = ''
    }

    ngOnInit() {
        this.token = this.activatedRoute.snapshot.queryParams['token']

        console.log('checkResetPasswordLinkMail --  ngOnInit ', this.token)
        if (!this.token) {
            this.isTokenValid = false
        } else {
            this.checkResetPasswordLinkMail()
        }
    }

    goBack() {
        this.location.back()
    }

    changePasswordVisible(passwordVisible: boolean) {
        this.passwordVisible = passwordVisible
    }

    changeConfirmPasswordVisible(confirmPasswordVisible: boolean) {
        this.confirmPasswordVisible = confirmPasswordVisible
    }

    formCheck() {
        let isValid = false

        if (
            this.isTokenValid &&
            this.checkPasswordPattern(this.password) &&
            this.checkPasswordPattern(this.confirmPassword) &&
            this.password == this.confirmPassword
        ) {
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
            this.passwordValid = false
            this.passwordStatus = 'warning'
        } else if (this.password.length < 8) {
            this.passwordError = '비밀번호가 너무 짧아요. (8자 이상)'
            this.passwordValid = false
            this.passwordStatus = 'warning'
        } else if (!pattern1.test(this.password) || !pattern2.test(this.password) || !pattern3.test(this.password)) {
            this.passwordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
            this.passwordValid = false
            this.passwordStatus = 'warning'
        } else {
            this.passwordError = ''
            this.passwordValid = true
            this.passwordStatus = 'success'
        }

        this.checkConfrimPassword()
    }

    checkConfrimPassword() {
        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (this.confirmPassword.length == 0) {
            this.confirmPasswordError = ''
            this.confirmPasswordValid = false
            this.confirmPasswordStatus = 'none'
        } else if (pattern4.test(this.confirmPassword)) {
            this.confirmPasswordError = '공백을 포함할 수 없어요.'
            this.confirmPasswordValid = false
            this.confirmPasswordStatus = 'warning'
        } else if (this.confirmPassword.length < 8) {
            this.confirmPasswordError = '비밀번호가 너무 짧아요. (8자 이상)'
            this.confirmPasswordValid = false
            this.confirmPasswordStatus = 'warning'
        } else if (
            !pattern1.test(this.confirmPassword) ||
            !pattern2.test(this.confirmPassword) ||
            !pattern3.test(this.confirmPassword)
        ) {
            this.confirmPasswordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
            this.confirmPasswordValid = false
            this.confirmPasswordStatus = 'warning'
        } else if (this.password != this.confirmPassword) {
            this.confirmPasswordError = '비밀번호가 일치하지 않아요.'
            this.confirmPasswordValid = false
            this.confirmPasswordStatus = 'error'
        } else {
            this.confirmPasswordError = ''
            this.confirmPasswordValid = true
            this.confirmPasswordStatus = 'success'
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

    checkResetPasswordLinkMail() {
        console.log('checkResetPasswordLinkMail -- ')
        this.authService.checkResetPasswordLinkMail({ token: this.token }).subscribe({
            next: (v) => {
                this.isTokenValid = true
            },
            error: (e) => {
                this.isTokenValid = false
                console.log('checkResetPasswordLinkMail -- ', this.isTokenValid)
                if (e.code == 'FUNCTION_AUTH_008') {
                    this.modalSendLink = true
                } else if (e.code == 'FUNCTION_AUTH_011') {
                    this.nxStore.dispatch(showToast({ text: '유효하지 않은 토큰입니다.' }))
                }
                // this.router.navigateByUrl('/auth/forgot-password')
            },
        })
    }

    public changePwStatus: Loading = 'idle'
    changePassword() {
        this.changePwStatus = 'pending'
        this.authService.changePassword({ token: this.token, new_password: this.password }).subscribe({
            next: (user: User) => {
                this.nxStore.dispatch(showToast({ text: '비밀번호가 변경되었어요.' }))
                this.changePwStatus = 'idle'
                this.router.navigateByUrl('/redwhale-home')
            },
            error: (e) => {
                this.changePwStatus = 'idle'
                if (e.code == 'FUNCTION_AUTH_008') {
                    this.modalSendLink = true
                } else if (e.code == 'FUNCTION_AUTH_011') {
                    this.nxStore.dispatch(showToast({ text: '유효하지 않은 토큰입니다.' }))
                } else {
                    this.nxStore.dispatch(showToast({ text: e.message }))
                }
            },
        })
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.changePassword()
            }
        } else {
            if (event.key != 'Tab' && type == 'password') {
                this.checkPassword()
            } else if (event.key != 'Tab' && type == 'confirmPassword') {
                this.checkConfrimPassword()
            }
        }
    }

    public modalSendLink = false
    public modalSendLinkData: ModalInput = {
        title: '비밀번호 재설정 링크의\n' + '유효 시간이 만료되었어요.',
        desc:
            '비밀번호 재설정 링크 전송 후 5분이 지나\n' +
            '링크가 만료되었어요. 이전 화면으로 돌아가\n' +
            '비밀번호 재설정 링크를 다시 요청해 주세요.',
        cancel: '취소',
        confirm: '링크 재요청하기',
    }
    onModalSendLinkConfirm() {
        this.modalSendLink = false
        this.router.navigateByUrl('/auth/forgot-password')
    }
}
