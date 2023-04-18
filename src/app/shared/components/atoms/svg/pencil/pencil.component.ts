import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-pencil',
    templateUrl: './pencil.component.svg',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '17px'
    @Input() height = '17px'
    @Input() margin = '2.5px 0 0 0'
}
