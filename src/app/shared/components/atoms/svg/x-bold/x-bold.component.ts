import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-x-bold',
    templateUrl: './x-bold.component.svg',
    styleUrls: ['./x-bold.component.scss'],
})
export class XBoldComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
