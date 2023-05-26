import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'

import { Store } from '@ngrx/store'
import { debugLog } from '@store/app/actions/log.action'
import { Registration } from '@schemas/appStore/registration.interface'
import { registrationSelector } from '@store/app/selectors/selectors'
import { take } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    public reg: Registration = undefined

    constructor(private router: Router, private storageService: StorageService, private nxStore: Store) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url = state.url.split('/')
        const user = this.storageService.getUser()
        const isUserEmpty = this.storageService.isUserEmpty()
        this.nxStore
            .select(registrationSelector)
            .pipe(take(1))
            .subscribe((_reg) => {
                this.reg = _reg
            })
        this.nxStore.dispatch(debugLog({ log: ['auth guard : ', url, user, isUserEmpty] }))
        if (!isUserEmpty) {
            if (!user.service_terms || !user.privacy) {
                this.router.navigateByUrl('/auth/terms')
                return false
            } else if (url[1] == 'auth' && url[2] != 'reset-password') {
                // 로그인 되었을 때, 비밀번호 재설정 페이지일 경우는 제외
                this.router.navigateByUrl('/main')
                return false
            } else if (!user.phone_number_verified && user.sawVerificationPhoneOnce) {
                this.storageService.logout()
                return false
            } else {
                return true
            }
        } else {
            if (url[1] == 'auth') {
                if (url[2] == 'registration' && this.canActivateBy(route.routeConfig.path)) {
                    return true
                } else if (url[2] == 'registration') {
                    this.router.navigateByUrl('/auth/terms')
                    return false
                } else {
                    return true
                }
            } else {
                this.router.navigateByUrl('/auth/login')
                return true
            }
        }
    }

    canActivateBy(path: string): boolean {
        switch (path) {
            case 'info':
                return this.reg.service_terms && this.reg.privacy
            case 'email':
                return this.reg.service_terms && this.reg.privacy && this.reg.emailValid && this.reg.passwordValid
            case 'phone':
                return (
                    this.reg.service_terms &&
                    this.reg.privacy &&
                    this.reg.emailValid &&
                    this.reg.passwordValid &&
                    this.reg.regCompleted
                )
            default:
                return false
        }
    }
}
