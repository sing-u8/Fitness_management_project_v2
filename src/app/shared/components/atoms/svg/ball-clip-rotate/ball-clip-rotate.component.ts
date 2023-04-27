import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-ball-clip-rotate',
    templateUrl: './ball-clip-rotate.component.svg',
    styleUrls: ['./ball-clip-rotate.component.scss'],
})
export class BallClipRotateComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--white)'
    @Input() width = '18px'
    @Input() height = '18px'
}
