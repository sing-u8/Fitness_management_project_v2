import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subject } from 'rxjs'
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
import _ from 'lodash'

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

declare let Kakao: any

@Component({
    selector: 'rwp-login',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    constructor(
        private router: Router,
        private fireAuth: Auth,
        private storageService: StorageService,
        private authService: AuthService,
        private nxStore: Store
    ) {}

    ngOnInit() {
        // const email = localStorage.getItem('email')
        // if (email) {
        //     this.email = email
        //     this.emailChecked = true
        // }
        // this.password = ''

        this.nxStore.dispatch(removeRegistration())
        if (!Kakao.isInitialized()) {
            Kakao.init(`${environment.kakao['appKey']['javascript']}`)
        }
    }
    ngOnDestroy() {
        // this.unsubscribe$.next(true)
        // this.unsubscribe$.complete()
    }

    public signInMethod: string

    // //  email login vars and functions
    // public email: string
    // public emailChecked: boolean
    // public password: string
    // public passwordVisible: boolean
    // @ViewChild('login_button_el') login_button_el: ButtonComponent
    //
    // signInWithEmail() {
    //     this.login_button_el.showLoading()
    //
    //     this.signInMethod = 'email'
    //     this.authService.signInWithEmail({ email: this.email, password: this.password }).subscribe({
    //         next: (user) => {
    //             if (this.emailChecked) {
    //                 localStorage.setItem('email', this.email)
    //             } else {
    //                 localStorage.removeItem('email')
    //             }
    //             signInWithCustomToken(this.fireAuth, user.custom_token)
    //                 .then((userCredential) => {
    //                     this.storageService.setSignInMethod(this.signInMethod)
    //                     this.router.navigateByUrl('/redwhale-home')
    //                 })
    //                 .finally(() => {
    //                     this.login_button_el.hideLoading()
    //                 })
    //         },
    //         error: (e) => {
    //             this.nxStore.dispatch(showToast({ text: '입력하신 정보를 다시 확인해주세요.' }))
    //             this.login_button_el.hideLoading()
    //         },
    //     })
    // }
    //
    // changePasswordVisible(passwordVisible: boolean) {
    //     this.passwordVisible = passwordVisible
    // }
    //
    // toggleRememberMe() {
    //     this.emailChecked = !this.emailChecked
    // }
    //
    // formCheck(): boolean {
    //     return isEmail(this.email) && isPassword(this.password)
    // }
    //
    // // social login vars and functions
    // public unsubscribe$ = new Subject<boolean>()
    // signInWithGoogle(btLoadingFns: ClickEmitterType) {
    //     btLoadingFns.showLoading()
    //     this.signInMethod = 'google'
    //     signInWithPopup(this.fireAuth, new GoogleAuthProvider())
    //         .then((userCredential) => {
    //             this.loginWithSocial(userCredential, btLoadingFns)
    //         })
    //         .finally(() => {
    //             btLoadingFns.hideLoading()
    //         })
    // }
    //
    // signInWithApple(btLoadingFns: ClickEmitterType) {
    //     btLoadingFns.showLoading()
    //     this.signInMethod = 'apple'
    //     signInWithPopup(this.fireAuth, new OAuthProvider('apple.com'))
    //         .then((userCredential) => {
    //             this.loginWithSocial(userCredential, btLoadingFns)
    //         })
    //         .finally(() => {
    //             btLoadingFns.hideLoading()
    //         })
    // }
    //
    // public kakaoBtLoadingFns: ClickEmitterType
    // signInWithKakao(btLoadingFns: ClickEmitterType) {
    //     this.kakaoBtLoadingFns = btLoadingFns
    //     this.signInMethod = 'kakao'
    //     const kakao$ = new Observable(function subscribe(observer) {
    //         Kakao.Auth.loginForm({
    //             success: function (response) {
    //                 observer.next(response)
    //                 observer.complete()
    //             },
    //             fail: function (error) {
    //                 observer.error(error)
    //             },
    //             always: function () {},
    //             persistAccessToken: false,
    //             persistRefreshToken: false,
    //         })
    //     })
    //
    //     kakao$.subscribe({
    //         next: (user) => {
    //             const accessToken = user['access_token']
    //             this.kakaoBtLoadingFns.showLoading()
    //             this.authService.signInWithKakao({ accessToken }).subscribe({
    //                 next: (user) => {
    //                     signInWithCustomToken(this.fireAuth, String(user.custom_token)).then(() => {
    //                         this.storageService.setSignInMethod(this.signInMethod)
    //                         this.kakaoBtLoadingFns.hideLoading()
    //                         this.router.navigateByUrl('/redwhale-home')
    //                     })
    //                 },
    //                 error: () => {
    //                     this.kakaoBtLoadingFns.hideLoading()
    //                 },
    //             })
    //         },
    //         error: (e) => {
    //             this.kakaoBtLoadingFns.hideLoading()
    //             this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
    //         },
    //     })
    // }
    //
    // // helper
    // loginWithSocial(uc: UserCredential, btLoadingFns?: ClickEmitterType) {
    //     uc.user.getIdToken().then((accessToken) => {
    //         this.authService.signInWithFirebase({ accessToken }).subscribe({
    //             next: (user) => {
    //                 this.storageService.setSignInMethod(this.signInMethod)
    //                 this.router.navigateByUrl('/redwhale-home')
    //                 if (!_.isEmpty(btLoadingFns)) {
    //                     btLoadingFns.hideLoading()
    //                 }
    //             },
    //             error: (e) => {
    //                 this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
    //                 if (!_.isEmpty(btLoadingFns)) {
    //                     btLoadingFns.hideLoading()
    //                 }
    //             },
    //         })
    //     })
    // }
}
