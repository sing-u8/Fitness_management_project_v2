import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-arrow-right-bold',
    templateUrl: './arrow-right-bold.component.svg',
    styleUrls: ['./arrow-right-bold.component.scss'],
})
export class ArrowRightBoldComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
