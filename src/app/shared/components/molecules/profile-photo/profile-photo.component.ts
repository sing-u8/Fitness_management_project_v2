import { Component, Input } from '@angular/core'
import { User } from '@schemas/user'

@Component({
    selector: 'rwm-profile-photo',
    templateUrl: './profile-photo.component.html',
    styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent {
    @Input() user: User
    constructor() {}
}
