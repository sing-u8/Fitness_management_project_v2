import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'

// services
import { AuthService } from '@services/auth.service'

// modules
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
import { ModalInput } from '@schemas/components/modal'

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

    constructor(
        private router: Router,
        private location: Location,
        private authService: AuthService,
        private nxStore: Store
    ) {}

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
                } else if (e.code == 'FUNCTION_AUTH_008') {
                    this.modalSendLink = true
                } else {
                    this.nxStore.dispatch(showToast({ text: e.message }))
                }
            },
        })
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
