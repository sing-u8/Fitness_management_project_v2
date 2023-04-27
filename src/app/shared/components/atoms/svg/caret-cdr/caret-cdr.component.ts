import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-cdr',
    templateUrl: './caret-cdr.component.svg',
    styleUrls: ['./caret-cdr.component.scss'],
})
export class CaretCdrComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
