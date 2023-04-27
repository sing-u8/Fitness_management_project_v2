import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core'

@Component({
    selector: 'rwa-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
    @Input() checked = false
    @Input() disable = false
    @Input() label = ''

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