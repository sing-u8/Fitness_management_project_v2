import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'

import { UsersService } from '@services/users.service'
// import { WsChatService } from '@services/web-socket/ws-chat.service'

import { User } from '@schemas/user'

import _ from 'lodash'

// ngrx
import { Store, select } from '@ngrx/store'
import { registrationSelector } from '@appStore/selectors/selectors'
import { showModal } from '@appStore/actions/modal.action'
import { setRegistration } from '@appStore/actions/registration.action'

@Component({
    selector: 'rw-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit, OnDestroy {
    public user: User
    public isUserEmpty = false
    public isSocialUser = false
    public registration: any

    public all = false
    public termsEULA = false
    public termsPrivacy = false
    public marketing = false
    public marketingSMS = false
    public marketingEmail = false

    public termsEULAVisible = false
    public termsPrivacyVisible = false

    public unSubscriber$ = new Subject<void>()

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
            this.marketingSMS = reg.sms_marketing
            this.marketingEmail = reg.email_marketing
            this.marketing = this.marketingSMS && this.marketingEmail
            this.all = this.marketing && this.termsEULA && this.termsPrivacy
            this.formCheck()
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

        this.marketing = this.marketingSMS || this.marketingEmail
        this.all = this.termsEULA && this.termsPrivacy && this.marketingSMS && this.marketingEmail
        this.formCheck()
    }

    public isValid = false
    formCheck(): boolean {
        this.isValid = this.termsEULA && this.termsPrivacy
        return this.isValid
    }

    next() {
        this.nxStore.dispatch(
            setRegistration({
                registration: {
                    service_terms: this.termsEULA,
                    privacy: this.termsPrivacy,
                    sms_marketing: this.marketingSMS,
                    email_marketing: this.marketingEmail,
                },
            })
        )

        if (!this.isUserEmpty) {
            const requestBody = {
                service_terms: this.termsEULA,
                privacy: this.termsPrivacy,
                sms_marketing: this.marketingSMS,
                email_marketing: this.marketingEmail,
            }

            this.usersService.updateUser(this.user.id, requestBody).subscribe({
                next: (user) => {
                    if (this.user.phone_number_verified) {
                        this.router.navigateByUrl('/redwhale-home')
                    } else {
                        this.router.navigateByUrl('/auth/registration/phone')
                    }
                },
                error: (err) => {
                    this.nxStore.dispatch(showModal({ data: { text: '약관 동의', subText: err.message } }))
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
