import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'

@Component({
    selector: 'rwa-text-button',
    templateUrl: './text-button.component.html',
    styleUrls: ['./text-button.component.scss'],
})
export class TextButtonComponent implements AfterViewInit, OnChanges {
    @Output() onClick = new EventEmitter<any>()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.onClick.emit()
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

    @Input() fontSize = '15px'
    @Input() lineHeight = '23px'
    @Input() fontWeight = '500'
    @Input() color = 'var(--gray-90)'
    @Input() showUnderLine = false

    @Input() disable = false
    @Input() disableColor = 'var(--gray-60)'

    @Input() hoverColor = 'var(--font-color)'

    @ViewChild('l_button') l_button_el: ElementRef

    public isHover = false
    onHover() {
        this.isHover = true
        this.renderer.setStyle(this.l_button_el.nativeElement, 'color', this.hoverColor)
    }
    onHoverOut() {
        this.isHover = false
        this.renderer.setStyle(this.l_button_el.nativeElement, 'color', this.color)
    }

    constructor(private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewInit() {}
}
