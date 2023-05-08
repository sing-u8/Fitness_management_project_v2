import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-warning',
    templateUrl: './warning.component.svg',
    styleUrls: ['./warning.component.scss'],
})
export class WarningComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
