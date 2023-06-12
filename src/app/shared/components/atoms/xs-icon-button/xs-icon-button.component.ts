import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwa-xs-icon-button',
    templateUrl: './xs-icon-button.component.html',
    styleUrls: ['./xs-icon-button.component.scss'],
})
export class XsIconButtonComponent {
    @ViewChild('l_button') l_button_el: ElementRef

    @Input() type: 'border' | 'fill' = 'border'
    @Input() borderRadius = '2px'
    @Input() status: Loading = 'idle'
    @Input() width = '24px' // ex) 20px, 2rem
    @Input() height = '24px' // ex) 40px 4rem

    @Output() onClick = new EventEmitter<any>()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.onClick.emit()
    }
    constructor(private renderer: Renderer2) {}

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    onFocus(el: any) {
        if (!this.isMouseDown) this.renderer.addClass(el, 'focused')
    }
    onFocusOut(el: any) {
        this.renderer.removeClass(el, 'focused')
    }
}
