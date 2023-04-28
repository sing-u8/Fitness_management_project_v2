import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-arrow-left-bold',
    templateUrl: './arrow-left-bold.component.svg',
    styleUrls: ['./arrow-left-bold.component.scss'],
})
export class ArrowLeftBoldComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '18px'
    @Input() height = '18px'
    @Input() margin = '0 0 0 0'
}
