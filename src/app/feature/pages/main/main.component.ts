import { Component, OnInit, AfterViewInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'

import { SharedModule } from '@shared/shared.module'

import { MainTabletHeaderComponent } from '@feature/molecules/main/main-tablet-header/main-tablet-header.component'
import { MainMenuComponent } from '@feature/molecules/main/main-menu/main-menu.component'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    standalone: true,
    selector: 'rwp-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    imports: [RouterOutlet, CommonModule, SharedModule, MainTabletHeaderComponent, MainMenuComponent],
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
}
