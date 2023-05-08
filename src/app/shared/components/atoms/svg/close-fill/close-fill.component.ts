import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-close-fill',
    templateUrl: './close-fill.component.svg',
    styleUrls: ['./close-fill.component.scss'],
})
export class CloseFillComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
