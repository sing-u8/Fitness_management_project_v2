import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { Registration } from '@schemas/appStore/registration.interface'

// ngrx
import { select, Store } from '@ngrx/store'
import { registrationSelector } from '@appStore/selectors/selectors'
import { debugLog } from '@appStore/actions/log.action'
import { take } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class RegCompletedGuard implements CanActivate {
    constructor(private router: Router, private nxStore: Store) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let registration: Registration = undefined
        this.nxStore.pipe(select(registrationSelector), take(1)).subscribe((reg) => {
            registration = reg
        })

        this.nxStore.dispatch(debugLog({ log: [`reg-completed guard : , ${registration}`] }))

        if (registration && registration.regCompleted) {
            return true
        } else {
            this.router.navigateByUrl('/redwhale-home')
            return false
        }
    }
}
