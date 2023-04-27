import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-dots-three',
    templateUrl: './dots-three.component.svg',
    styleUrls: ['./dots-three.component.scss'],
})
export class DotsThreeComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '17px'
    @Input() height = '17px'
    @Input() margin = '0 0 0 0'
}
