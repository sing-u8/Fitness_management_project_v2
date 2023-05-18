import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-up-outline',
    templateUrl: './caret-up.component.svg',
    styleUrls: ['./caret-up.component.scss'],
})
export class CaretUpComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() innerColor = 'var(--gray-90)'
    @Input() innerOpacity = 0.2
    @Input() width = '16px'
    @Input() height = '16px'
    @Input() margin = '0 0 0 0'
}
