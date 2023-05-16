import { Component, Input, Output, OnInit, Renderer2, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Router, RouterLink } from '@angular/router'

@Component({
    selector: 'rwm-main-menu',
    standalone: true,
    imports: [CommonModule, SharedModule, RouterLink],
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, AfterViewInit, OnDestroy {
    public productOpen = false
    onProductCategClick() {
        if (!this.productOpen) {
            this.route.navigateByUrl('/main/product/membership')
        }
        this.productOpen = !this.productOpen
    }
    public smsOpen = false
    onSmsCategClick() {
        if (!this.smsOpen) {
            this.route.navigateByUrl('/main/sms/general-transmit')
        }
        this.smsOpen = !this.smsOpen
    }

    public user: User
    public centerUser: CenterUser
    public center: Center

    public resizeListener: () => void = undefined

    // vars for html tags
    @Input() mode: 'tablet' | 'pc' = 'pc'
    @Input() showTabletNav = false
    @Output() onShowTabletClose = new EventEmitter()
    onRouteClick() {
        if (this.mode == 'tablet') {
            this.onShowTabletClose.emit()
        }
    }

    btWidth = '235px'

    constructor(private renderer: Renderer2, private storageService: StorageService, public route: Router) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.centerUser = this.storageService.getCenterUser()
        this.center = this.storageService.getCenter()
    }
    ngAfterViewInit() {
        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            if (window.innerWidth < 1920) {
                if (this.mode == 'tablet') {
                } else if (this.mode == 'pc') {
                    // this.menuWidth = '80px'
                }
            } else if (window.innerWidth >= 1920) {
                if (this.mode == 'tablet') {
                } else if (this.mode == 'pc') {
                    // this.menuWidth = '275px'
                }
            }
        })
    }
    ngOnDestroy() {
        this.resizeListener()
    }

    isActive(url: string) {
        return this.route.isActive(url, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        })
    }
}
