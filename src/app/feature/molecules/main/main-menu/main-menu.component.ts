import { Component, Input, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

@Component({
    selector: 'rwm-main-menu',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, AfterViewInit, OnDestroy {
    public productOpen = false
    public smsOpen = false

    btWidth = '235px'
    toggleBtWidth() {
        if (this.btWidth == '235px') {
            this.btWidth = '46px'
        } else {
            this.btWidth = '235px'
        }
    }

    public user: User
    public centerUser: CenterUser
    public center: Center

    public resizeListener: () => void = undefined

    // vars for html tags
    @Input() mode: 'tablet' | 'pc' = 'pc'
    @Input() showTabletNav = false

    public menuWidth = ''

    constructor(private renderer: Renderer2, private storageService: StorageService) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.centerUser = this.storageService.getCenterUser()
        this.center = this.storageService.getCenter()
    }
    ngAfterViewInit() {
        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            if (window.innerWidth < 1920) {
                if (this.mode == 'tablet') {
                } else if (this.mode == 'pc' && this.menuWidth != '80px') {
                    // this.menuWidth = '80px'
                }
            } else if (window.innerWidth >= 1920) {
                if (this.mode == 'tablet') {
                } else if (this.mode == 'pc' && this.menuWidth != '275px') {
                    // this.menuWidth = '275px'
                }
            }
        })
    }
    ngOnDestroy() {
        this.resizeListener()
    }
}
