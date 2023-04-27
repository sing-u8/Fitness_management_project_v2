import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-cr',
    templateUrl: './caret-cr.component.svg',
    styleUrls: ['./caret-cr.component.scss'],
})
export class CaretCrComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
