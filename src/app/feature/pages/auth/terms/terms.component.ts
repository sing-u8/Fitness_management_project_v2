import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { UsersService } from '@services/users.service'
import { WsChatService } from '@services/web-socket/ws-chat.service'

import { User } from '@schemas/user'

import _ from 'lodash'

// ngrx
import { Store, select } from '@ngrx/store'
import { registrationSelector } from '@store/app/selectors/selectors'
import { showModal } from '@store/app/actions/modal.action'
import { setRegistration } from '@store/app/actions/registration.action'
import { showToast } from '@store/app/actions/toast.action'

@Component({
    selector: 'rwp-terms',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit, OnDestroy {
    TAG = '약관 동의'

    public unSubscriber$ = new Subject<void>()

    user: User
    isUserEmpty: boolean
    isSocialUser: boolean

    registration: any

    all: boolean
    termsEULA: boolean
    termsPrivacy: boolean
    marketing: boolean
    marketingSMS: boolean
    marketingEmail: boolean

    termsEULAVisible: boolean
    termsPrivacyVisible: boolean

    constructor(
        private router: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private usersService: UsersService // private wsChatService: WsChatService
    ) {
        this.user = this.storageService.getUser()

        this.isUserEmpty = this.storageService.isUserEmpty()
        this.isSocialUser = this.storageService.isSocialUser()

        this.nxStore.pipe(select(registrationSelector), takeUntil(this.unSubscriber$)).subscribe((reg) => {
            this.termsEULA = reg.service_terms
            this.termsPrivacy = reg.privacy
            this.marketingSMS = reg.marketing_sms
            this.marketingEmail = reg.marketing_email
            this.marketing = this.marketingSMS && this.marketingEmail
            this.all = this.marketing && this.termsEULA && this.termsPrivacy
        })
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    onClick(item: string) {
        if (item == 'all') {
            if (this.all) {
                this.all = false
                this.termsEULA = false
                this.termsPrivacy = false
                this.marketingSMS = false
                this.marketingEmail = false
            } else {
                this.all = true
                this.termsEULA = true
                this.termsPrivacy = true
                this.marketingSMS = true
                this.marketingEmail = true
            }
        } else if (item == 'termsEULA') {
            this.termsEULA = !this.termsEULA
        } else if (item == 'termsPrivacy') {
            this.termsPrivacy = !this.termsPrivacy
        } else if (item == 'marketing') {
            if ((this.marketingSMS && this.marketingEmail) || (!this.marketingSMS && !this.marketingEmail)) {
                this.marketing = !this.marketing
                this.marketingSMS = this.marketing
                this.marketingEmail = this.marketing
            } else {
                this.marketingSMS = true
                this.marketingEmail = true
            }
        } else if (item == 'marketingSMS') {
            this.marketingSMS = !this.marketingSMS
        } else if (item == 'marketingEmail') {
            this.marketingEmail = !this.marketingEmail
        }

        if (this.marketingSMS || this.marketingEmail) {
            this.marketing = true
        } else {
            this.marketing = false
        }

        if (this.termsEULA && this.termsPrivacy && this.marketingSMS && this.marketingEmail) {
            this.all = true
        } else {
            this.all = false
        }
    }

    formCheck() {
        let isValid = false

        if (this.termsEULA && this.termsPrivacy) {
            isValid = true
        }

        return isValid
    }

    next() {
        this.nxStore.dispatch(
            setRegistration({
                registration: {
                    service_terms: this.termsEULA,
                    privacy: this.termsPrivacy,
                    marketing_sms: this.marketingSMS,
                    marketing_email: this.marketingEmail,
                },
            })
        )

        if (!this.isUserEmpty) {
            const requestBody = {
                service_terms: this.termsEULA,
                privacy: this.termsPrivacy,
                marketing_sms: this.marketingSMS,
                marketing_email: this.marketingEmail,
            }

            this.usersService.updateUser(this.user.id, requestBody).subscribe({
                next: (user) => {
                    this.nxStore.dispatch(showToast({ text: '🎉  회원가입이 완료되었어요.' }))
                    this.router.navigateByUrl('/main')
                },
                error: (err) => {
                    this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: err.message } }))
                },
            })
        } else {
            this.router.navigateByUrl('/auth/registration/info')
        }
    }

    cancelWhenSocialUser() {
        this.storageService.logout()
        // this.wsChatService.closeChatWs()
    }

    showModal(name: string) {
        if (name == 'termsEULA') {
            this.termsEULAVisible = true
        } else if (name == 'termsPrivacy') {
            this.termsPrivacyVisible = true
        }
    }

    hideModal(name: string) {
        if (name == 'termsEULA') {
            this.termsEULAVisible = false
        } else if (name == 'termsPrivacy') {
            this.termsPrivacyVisible = false
        }
    }
}
