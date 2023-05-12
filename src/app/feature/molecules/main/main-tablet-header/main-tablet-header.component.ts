import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MainMenuComponent } from '@feature/molecules/main/main-menu/main-menu.component'

import { ViewDrawer } from '@schemas/components/main/ViewDrawer'

@Component({
    selector: 'rwm-main-tablet-header',
    standalone: true,
    imports: [CommonModule, MainMenuComponent],
    templateUrl: './main-tablet-header.component.html',
    styleUrls: ['./main-tablet-header.component.scss'],
})
export class MainTabletHeaderComponent {
    @Output() onDrawerButtonClick = new EventEmitter<ViewDrawer>()

    public showNavDrawer = false
    toggleShowNavDrawer() {
        this.showNavDrawer = !this.showNavDrawer
    }

    constructor() {}
}
