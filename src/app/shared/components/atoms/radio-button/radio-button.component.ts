import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core'

@Component({
    selector: 'rwa-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {
    @Input() checked = false
    @Input() disable = false
    @Input() label = ''

    @Input() lookNormalWhenDisabled = false

    @ViewChild('l_button') l_button_el: ElementRef

    @Output() onClick = new EventEmitter<boolean>()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.checked = !this.checked
        this.onClick.emit(this.checked)
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }

    constructor(renderer: Renderer2) {}
}
