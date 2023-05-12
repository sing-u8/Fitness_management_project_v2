import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-avatar-smiley',
    templateUrl: './avatar-smiley.component.svg',
    styleUrls: ['./avatar-smiley.component.scss'],
})
export class AvatarSmileyComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--white)'
    @Input() width = '20px'
    @Input() height = '20px'
    @Input() margin = '0 0 0 0'
}
