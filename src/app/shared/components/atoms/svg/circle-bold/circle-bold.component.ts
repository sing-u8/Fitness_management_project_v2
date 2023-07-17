import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-circle-bold',
    templateUrl: './circle-bold.component.svg',
    styleUrls: ['./circle-bold.component.scss'],
})
export class CircleBoldComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
