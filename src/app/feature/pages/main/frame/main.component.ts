import { Component, OnInit, AfterViewInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'

import { SharedModule } from '../../../../shared/shared.module'

import { MainTabletHeaderComponent } from '../../../molecules/main/main-tablet-header/main-tablet-header.component'
import { MainMenuComponent } from '../../../molecules/main/main-menu/main-menu.component'

import { StorageService } from '../../../../core/services/storage.service'

import { User } from '../../../../core/schemas/user'
import { ViewDrawer } from '../../../../core/schemas/components/main/ViewDrawer'
import { MainDrawerComponent } from '../../../templates/main/main-drawer/main-drawer.component'

@Component({
    standalone: true,
    selector: 'rwp-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [
        RouterOutlet,
        CommonModule,
        SharedModule,
        MainTabletHeaderComponent,
        MainMenuComponent,
        MainDrawerComponent,
    ],
})
export class MainComponent implements OnInit, AfterViewInit {
    public user: User

    public showPhoneVerifModal = false
    onPhoneVerifModalConfirm() {
        this.showPhoneVerifModal = false
    }

    constructor(private storageService: StorageService) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            if (!this.user.phone_number_verified) {
                this.showPhoneVerifModal = true
            }
        })
    }

    public showDrawer = false
    public viewDrawer: ViewDrawer = undefined
    onDrawerButtonClick(viewDrawer: ViewDrawer) {
        this.showDrawer = true
        this.viewDrawer = viewDrawer
    }
    onShowDrawerChange(e: { showDrawer: boolean; viewDrawer: ViewDrawer }) {
        this.showDrawer = e.showDrawer
        this.viewDrawer = e.viewDrawer
    }
}
