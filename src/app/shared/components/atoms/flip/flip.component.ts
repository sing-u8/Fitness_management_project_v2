import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'rwa-flip',
    templateUrl: './flip.component.html',
    styleUrls: ['./flip.component.scss'],
})
export class FlipComponent {
    @Input() open = false
    @Output() openChange = new EventEmitter<boolean>()

    @Input() disable = false

    @Output() onClick = new EventEmitter()
    _onClick() {
        this.onClick.emit()
    }
}
