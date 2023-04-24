import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-gear',
    templateUrl: './gear.component.svg',
    styleUrls: ['./gear.component.scss'],
})
export class GearComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
