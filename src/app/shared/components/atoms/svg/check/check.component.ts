import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-check',
    templateUrl: './check.component.svg',
    styleUrls: ['./check.component.scss'],
})
export class CheckComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--white)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
