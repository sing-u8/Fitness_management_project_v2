import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'rw-auth-header',
    templateUrl: './auth-header.component.html',
    styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent {
    constructor(private router: Router) {}

    goRouterLink(link: string) {
        this.router.navigateByUrl(link)
    }
}
