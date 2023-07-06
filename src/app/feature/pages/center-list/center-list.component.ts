import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { User } from '@schemas/user'
import { Loading } from '@schemas/loading'
import { Center } from '@schemas/center'
import { forkJoin, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rwp-center-list',
    standalone: true,
    imports: [CommonModule, SharedModule, NgOptimizedImage],
    templateUrl: './center-list.component.html',
    styleUrls: ['./center-list.component.scss'],
})
export class CenterListComponent implements OnInit, OnDestroy {
    public user: User
    public unDescriber$ = new Subject()

    public showCreateCenterModal = false
    onCreatedCenter(center: Center) {
        this.centerList.unshift(center)
    }

    public centerLoading: Loading = 'idle'
    public centerList: Center[] = []
    public invitedCenterList: Center[] = []
    constructor(private storageService: StorageService, private usersCenterService: UsersCenterService) {}
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.storageService.userChangeSubject.pipe(takeUntil(this.unDescriber$)).subscribe(() => {
            this.user = this.storageService.getUser()
        })
        this.getCenterList()
    }
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    getCenterList() {
        this.centerLoading = 'pending'
        forkJoin([this.usersCenterService.getCenterList(this.user.id)]).subscribe({
            next: ([centerList]) => {
                this.centerList = centerList
                this.centerLoading = 'idle'
                console.log('center lsit : ', centerList)
            },
            error: (err) => {
                this.centerLoading = 'idle'
            },
        })
    }

    // --------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------

    public showMyInformation = false
    openMyInfoModal() {
        this.showMyInformation = true
    }
    closeMyInfoModal() {
        this.showMyInformation = false
    }
}
