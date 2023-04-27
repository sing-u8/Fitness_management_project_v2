import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-user-list',
    templateUrl: './user-list.component.svg',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
