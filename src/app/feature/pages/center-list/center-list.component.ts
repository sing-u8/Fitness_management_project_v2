import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { StorageService } from '@services/storage.service'
import { User } from '@schemas/user'

@Component({
    selector: 'rwp-center-list',
    standalone: true,
    imports: [CommonModule, SharedModule, NgOptimizedImage],
    templateUrl: './center-list.component.html',
    styleUrls: ['./center-list.component.scss'],
})
export class CenterListComponent {
    public user: User

    public showCreateCenterModal = false
    constructor(private storageService: StorageService) {
        this.user = storageService.getUser()
    }
}
