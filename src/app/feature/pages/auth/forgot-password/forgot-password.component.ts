import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Location } from '@angular/common'

// services
import { AuthService } from '@services/auth.service'

// modules
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'

@Component({
    selector: 'rwp-forgot-password',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
    TAG = '비밀번호 찾기'

    email = ''

    constructor(private location: Location, private authService: AuthService, private nxStore: Store) {}

    ngOnInit() {}

    goBack() {
        this.location.back()
    }

    formCheck() {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (emailRegex.test(this.email)) {
            isValid = true
        }

        return isValid
    }

    sendResetPasswordLinkMail() {
        this.authService.sendResetPasswordLinkMail({ email: this.email }).subscribe({
            next: (v) => {
                this.nxStore.dispatch(showToast({ text: '메일이 발송되었습니다. 메일함을 확인해주세요!' }))
            },
            error: (e) => {
                if (e.code == 'FUNCTION_AUTH_002') {
                    this.nxStore.dispatch(showToast({ text: '가입되어 있지 않은 이메일이에요.' }))
                } else {
                    this.nxStore.dispatch(showToast({ text: e.message }))
                }
            },
        })
    }
}
