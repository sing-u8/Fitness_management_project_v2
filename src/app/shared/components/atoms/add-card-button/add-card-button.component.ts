import { Component, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'rwa-add-card-button',
    templateUrl: './add-card-button.component.html',
    styleUrls: ['./add-card-button.component.scss'],
})
export class AddCardButtonComponent {
    @Output() onClick = new EventEmitter()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.onClick.emit()
    }

    @ViewChild('l_button') l_button_el: ElementRef
    constructor(private renderer: Renderer2) {}
    onHover() {
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', 'var(--red-5)')
    }
    onHoverOut() {
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', 'var(--white)')
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    onFocus() {
        if (!this.isMouseDown) this.renderer.addClass(this.l_button_el.nativeElement, 'focused')
    }
    onFocusOut() {
        this.renderer.removeClass(this.l_button_el.nativeElement, 'focused')
    }
}
