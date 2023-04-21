import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-close-fill',
    templateUrl: './close-fill.component.svg',
    styleUrls: ['./close-fill.component.scss'],
})
export class CloseFillComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '2.5px 0 0 0'
}
