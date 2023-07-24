import { Component, Input } from "@angular/core";

@Component({
    selector: 'rwa-svg-folder-open',
    templateUrl: './folder-open.component.svg',
    styleUrls: ['./folder-open.component.scss'],
})
export class FolderOpenComponent {
    @Input() bgColor = 'none'
    @Input() color = 'var(--gray-90)'
    @Input() width = '24px'
    @Input() height = '24px'
    @Input() margin = '0 0 0 0'
}
