import { CommonModule } from '@angular/common'

import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SharedModule } from '@shared/shared.module'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'rwp-reg-completed',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './reg-completed.component.html',
    styleUrls: ['./reg-completed.component.scss'],
})
export class RegCompletedComponent implements OnInit {
    TAG = '회원가입'

    user: User

    constructor(private router: Router, private storageService: StorageService) {}

    ngOnInit(): void {
        this.user = this.storageService.getUser()
    }

    next() {
        this.router.navigateByUrl('/redwhale-home')
    }
}
