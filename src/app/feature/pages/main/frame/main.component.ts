import { Component, OnInit, AfterViewInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

import { MainTabletHeaderComponent } from '@feature/molecules/main/main-tablet-header/main-tablet-header.component'
import { MainMenuComponent } from '@feature/molecules/main/main-menu/main-menu.component'

import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'

import { User } from '@schemas/user'
import { ViewDrawer } from '@schemas/components/main/ViewDrawer'
import { MainDrawerComponent } from '@feature/templates/main/main-drawer/main-drawer.component'

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

    constructor(private storageService: StorageService, private usersCenterService: UsersCenterService) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        // this.getCenterForTest()
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            if (!this.user.phone_number_verified) {
                this.showPhoneVerifModal = true
                if (!this.user?.sawVerificationPhoneOnce) {
                    this.user['sawVerificationPhoneOnce'] = true
                    this.storageService.setUser(this.user)
                }
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

    // temporary for dev
    getCenterForTest() {
        this.usersCenterService.getCenterList(this.user.id).subscribe((centers) => {
            console.log('get center list : ', centers)
            this.storageService.setCenter(centers[0])
        })
    }
}
