import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-coin',
    templateUrl: './coin.component.svg',
    styleUrls: ['./coin.component.scss'],
})
export class CoinComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '22px'
    @Input() height = '22px'
    @Input() margin = '0 0 0 0'
}
