import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-close',
    templateUrl: './close.component.svg',
    styleUrls: ['./close.component.scss'],
})
export class CloseComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
