import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import {
    Auth,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithCustomToken,
    UserCredential,
} from '@angular/fire/auth'

import { environment } from '@environments/environment'

// utils
import { Observable, Subject } from 'rxjs'
import _ from 'lodash'

// helper
import { isEmail, isPassword } from '@shared/helper/form-helper'

// services
import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

// modules
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@store/app/actions/toast.action'
import { showModal } from '@store/app/actions/modal.action'
import { removeRegistration } from '@store/app/actions/registration.action'

// schemas
import { Loading } from '@schemas/loading'
import { ButtonEmit } from '@schemas/components/button'

declare let Kakao: any

@Component({
    selector: 'rwp-login',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public TAG = '로그인'
    constructor(
        private router: Router,
        private fireAuth: Auth,
        private storageService: StorageService,
        private authService: AuthService,
        private nxStore: Store
    ) {}

    ngOnInit() {
        const email = localStorage.getItem('email')
        if (email) {
            this.email = email
            this.emailChecked = true
        }
        this.password = ''

        this.nxStore.dispatch(removeRegistration())
        if (!Kakao.isInitialized()) {
            Kakao.init(`${environment.kakao['appKey']['javascript']}`)
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    public signInMethod: string

    //  email login vars and functions
    public email: string
    public emailChecked = false
    public password: string

    // button vars
    public loginBtStatus: Loading = 'idle'
    public kakaoBtStatus: Loading = 'idle'
    public googleBtStatus: Loading = 'idle'
    public appleBtStatus: Loading = 'idle'

    public kakaoTc = false
    public googleTc = false
    public appleTc = false

    signInWithEmail() {
        this.loginBtStatus = 'pending'

        this.signInMethod = 'email'
        this.authService.signInWithEmail({ email: this.email, password: this.password }).subscribe({
            next: (user) => {
                if (this.emailChecked) {
                    localStorage.setItem('email', this.email)
                } else {
                    localStorage.removeItem('email')
                }
                signInWithCustomToken(this.fireAuth, user.custom_token)
                    .then((userCredential) => {
                        this.storageService.setSignInMethod(this.signInMethod)
                        this.router.navigateByUrl('/main')
                    })
                    .finally(() => {
                        this.loginBtStatus = 'idle'
                    })
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: '입력한 정보를 다시 확인해 주세요.' }))
                this.loginBtStatus = 'idle'
            },
        })
    }

    toggleRememberMe(flag: boolean) {
        this.emailChecked = flag
    }

    formCheck(): boolean {
        return isEmail(this.email) && isPassword(this.password)
    }

    // social login vars and functions
    public unsubscribe$ = new Subject<boolean>()
    signInWithGoogle() {
        this.googleBtStatus = 'pending'
        this.signInMethod = 'google'
        signInWithPopup(this.fireAuth, new GoogleAuthProvider())
            .then((userCredential) => {
                this.loginWithSocial(userCredential, () => {
                    this.googleBtStatus = 'idle'
                })
            })
            .finally(() => {
                this.googleBtStatus = 'idle'
            })
    }

    signInWithApple() {
        this.appleBtStatus = 'pending'
        this.signInMethod = 'apple'
        signInWithPopup(this.fireAuth, new OAuthProvider('apple.com'))
            .then((userCredential) => {
                this.loginWithSocial(userCredential, () => {
                    this.appleBtStatus = 'idle'
                })
            })
            .finally(() => {
                this.appleBtStatus = 'idle'
            })
    }

    public kakaoBtLoadingFns: ButtonEmit
    signInWithKakao() {
        this.kakaoBtLoadingFns = {
            showLoading: () => {
                this.kakaoBtStatus = 'pending'
            },
            hideLoading: () => {
                this.kakaoBtStatus = 'idle'
            },
        }
        this.signInMethod = 'kakao'
        const kakao$ = new Observable(function subscribe(observer) {
            Kakao.Auth.loginForm({
                success: function (response) {
                    observer.next(response)
                    observer.complete()
                },
                fail: function (error) {
                    observer.error(error)
                },
                always: function () {},
                persistAccessToken: false,
                persistRefreshToken: false,
            })
        })

        kakao$.subscribe({
            next: (user) => {
                const access_token = user['access_token']
                this.kakaoBtLoadingFns.showLoading()
                this.authService.signInWithKakao({ access_token }).subscribe({
                    next: (user) => {
                        signInWithCustomToken(this.fireAuth, String(user.custom_token)).then(() => {
                            this.storageService.setSignInMethod(this.signInMethod)
                            this.kakaoBtLoadingFns.hideLoading()
                            this.router.navigateByUrl('/main')
                        })
                    },
                    error: () => {
                        this.kakaoBtLoadingFns.hideLoading()
                    },
                })
            },
            error: (e) => {
                this.kakaoBtLoadingFns.hideLoading()
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }

    // helper
    loginWithSocial(uc: UserCredential, cb?: () => void) {
        uc.user.getIdToken().then((access_token) => {
            this.authService.signInWithFirebase({ access_token }).subscribe({
                next: (user) => {
                    this.storageService.setSignInMethod(this.signInMethod)
                    this.router.navigateByUrl('/main')
                    if (!_.isEmpty(cb)) {
                        cb()
                    }
                },
                error: (e) => {
                    this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
                    if (!_.isEmpty(cb)) {
                        cb()
                    }
                },
            })
        })
    }

    routeTo(url: string) {
        this.router.navigateByUrl(url)
    }
}
