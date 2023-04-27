import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-caret-cdl',
    templateUrl: './caret-cdl.component.svg',
    styleUrls: ['./caret-cdl.component.scss'],
})
export class CaretCdlComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
