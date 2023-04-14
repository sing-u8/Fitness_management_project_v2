import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'rwm-main-tablet-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './main-tablet-header.component.html',
    styleUrls: ['./main-tablet-header.component.scss'],
})
export class MainTabletHeaderComponent {
    public showNavDrawer = false
    toggleShowNavDrawer() {
        this.showNavDrawer = !this.showNavDrawer
    }

    constructor() {}
}
