import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-warning',
    templateUrl: './warning.component.svg',
    styleUrls: ['./warning.component.scss'],
})
export class WarningComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
