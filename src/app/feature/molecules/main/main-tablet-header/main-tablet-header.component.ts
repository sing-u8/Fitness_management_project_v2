import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core'
import { MainMenuComponent } from '@feature/molecules/main/main-menu/main-menu.component'
import { NavigationEnd, Router } from '@angular/router'

import { CommonModule } from '@angular/common'

import { ViewDrawer } from '@schemas/components/main/ViewDrawer'
import { matchRoute, MainPath } from '@routes/main.routes'
import { Subscription } from 'rxjs'

@Component({
    selector: 'rwm-main-tablet-header',
    standalone: true,
    imports: [CommonModule, MainMenuComponent],
    templateUrl: './main-tablet-header.component.html',
    styleUrls: ['./main-tablet-header.component.scss'],
})
export class MainTabletHeaderComponent implements OnDestroy {
    @Output() onDrawerButtonClick = new EventEmitter<ViewDrawer>()

    public routeSub: Subscription = undefined
    public routeName = ''

    public showNavDrawer = false
    toggleShowNavDrawer() {
        this.showNavDrawer = !this.showNavDrawer
    }

    constructor(private route: Router) {
        this.routeSub = this.route.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log('navigation end event : ', event)
                this.routeName = matchRoute(event.url)
            }
        })
    }
    ngOnDestroy() {
        this.routeSub.unsubscribe()
    }
}
