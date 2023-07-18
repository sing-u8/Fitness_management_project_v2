import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-info',
    templateUrl: './info.component.svg',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
