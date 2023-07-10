import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { Auth, authState } from '@angular/fire/auth'

// ngrx
import { Store, select } from '@ngrx/store'
import { modalSelector, toastSelector } from '@store/app/selectors/selectors'
import { hideModal } from '@store/app/actions/modal.action'
import { hideToast } from '@store/app/actions/toast.action'

// schemas
import { Modal } from '@schemas/appStore/modal.interface'
import { Toast } from '@schemas/appStore/toast.interface'
import { RoleModal } from '@schemas/appStore/modal.interface'

import _ from 'lodash'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public unSubscriber$ = new Subject<void>()

    public modalState: Modal
    public toastState: Toast
    public roleModalState: RoleModal

    constructor(private nxStore: Store, private fireAuth: Auth) {
        this.nxStore.pipe(select(modalSelector), takeUntil(this.unSubscriber$)).subscribe((modal) => {
            this.modalState = modal
        })
        this.nxStore.pipe(select(toastSelector), takeUntil(this.unSubscriber$)).subscribe((toast) => {
            this.toastState = toast
        })
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    hideToast() {
        this.nxStore.dispatch(hideToast())
    }
}
