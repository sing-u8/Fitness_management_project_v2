import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-gear',
    templateUrl: './gear.component.svg',
    styleUrls: ['./gear.component.scss'],
})
export class GearComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() innerColor = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
