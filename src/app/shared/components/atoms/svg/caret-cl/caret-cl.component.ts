import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-cl',
    templateUrl: './caret-cl.component.svg',
    styleUrls: ['./caret-cl.component.scss'],
})
export class CaretClComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
