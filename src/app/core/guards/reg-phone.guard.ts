import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class RegPhoneGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.storageService.getUser()

        if (_.isEmpty(user)) {
            this.router.navigateByUrl('/auth/terms')
            return false
        } else if (!_.isEmpty(user) && user.phone_number_verified) {
            this.router.navigateByUrl('/main')
            return false
        } else return user && !user.phone_number_verified
    }
}
