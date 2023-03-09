import { Component } from '@angular/core'

import { StorageService } from '@services/storage.service'

@Component({
    selector: 'main-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    constructor(private storageService: StorageService) {}

    logout() {
        this.storageService.logout()
    }
}
