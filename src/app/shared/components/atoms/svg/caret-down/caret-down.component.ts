import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-down',
    templateUrl: './caret-down.component.svg',
    styleUrls: ['./caret-down.component.scss'],
})
export class CaretDownComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '20px'
    @Input() height = '20px'
    @Input() margin = '0 0 0 0'
}
