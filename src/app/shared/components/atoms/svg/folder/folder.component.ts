import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-folder',
    templateUrl: './folder.component.svg',
    styleUrls: ['./folder.component.scss'],
})
export class FolderComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
