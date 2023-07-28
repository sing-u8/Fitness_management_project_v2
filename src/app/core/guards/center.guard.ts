import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'
import _ from 'lodash'

import { Center } from '@schemas/center'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'
import { debugLog } from '@store/app/actions/app.actions'

@Injectable({
    providedIn: 'root',
})
export class CenterGuard implements CanActivate {
    public addrData = {
        addr: '',
        isChecked: false,
    }

    constructor(
        private router: Router,
        private CenterService: CenterService,
        private storageService: StorageService,
        private nxStore: Store
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const centerName = route.params['center-name']
        const center: Center = this.storageService.getCenter()

        this.nxStore.dispatch(
            debugLog({
                log: ['address in center guard : ', centerName, center, center.name == centerName],
            })
        )
        if (_.isObject(center) && center.name == centerName) {
            return of(true)
        } else {
            this.router.navigate(['redwhale-home'])
            return of(false)
        }
    }
}
