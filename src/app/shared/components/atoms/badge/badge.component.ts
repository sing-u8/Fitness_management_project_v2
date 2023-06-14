import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-badge',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
    @Input() bgColor = 'var(--gray-50)'
    @Input() color = 'var(--font-color)'
    @Input() fontWeight = '400'
    @Input() lineHeight = '19px'
    @Input() fontSize = '1.4rem'
    @Input() padding = '5px 9px 4px'
    @Input() borderRadius = '20px'
    constructor() {}
}
