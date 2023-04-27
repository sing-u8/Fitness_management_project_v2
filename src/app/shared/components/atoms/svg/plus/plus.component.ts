import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-plus',
    templateUrl: './plus.component.svg',
    styleUrls: ['./plus.component.scss'],
})
export class PlusComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--red-100)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
