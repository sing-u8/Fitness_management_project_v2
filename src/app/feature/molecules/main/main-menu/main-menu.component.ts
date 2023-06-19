import { Component, Input, Output, OnInit, Renderer2, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Router, RouterLink } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

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
            this.smsOpen = false
        }
        this.productOpen = !this.productOpen
    }
    public smsOpen = false
    onSmsCategClick() {
        if (!this.smsOpen) {
            this.productOpen = false
        }
        this.smsOpen = !this.smsOpen
    }
    closeCategs() {
        this.smsOpen = false
        this.productOpen = false
    }

    public user: User
    public centerUser: CenterUser
    public center: Center

    public unDescriber$ = new Subject()

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

    constructor(private renderer: Renderer2, private storageService: StorageService, public route: Router) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.centerUser = this.storageService.getCenterUser()
        this.center = this.storageService.getCenter()

        this.storageService.userChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe(() => {
            this.user = this.storageService.getUser()
            this.centerUser = this.storageService.getCenterUser()
            console.log('main-menu console in userChangeSubject : ', this.user, this.centerUser)
        })
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
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    isActive(url: string) {
        return this.route.isActive(url, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        })
    }

    public showMyInformation = false
    openMyInfoModal() {
        this.showMyInformation = true
    }
    closeMyInfoModal() {
        this.showMyInformation = false
    }
}
