import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    RendererStyleFlags2,
    ViewChild,
} from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import _ from 'lodash'

@Component({
    selector: 'rwa-icon-ghost-button',
    templateUrl: './icon-ghost-button.component.html',
    styleUrls: ['./icon-ghost-button.component.scss'],
})
export class IconGhostButtonComponent implements AfterViewInit {
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

    @Input() hoverBgColor = 'var(--gray-30)'
    onHover() {
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.hoverBgColor)
    }
    onHoverOut() {
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
    }

    @Input() width = '50px'
    @Input() height = '50px'
    @Input() bgColor = 'var(--white)'
    @Input() sizeType: 'lg' | 'md' | 'sm' = undefined
    @Input() borderRadius = '15px'
    @Input() borderColor = 'var(--gray-60)'

    @Observe('sizeType') sizeType$: Observable<'lg' | 'md' | 'sm'>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('border') border$: Observable<string>
    @Observe('borderRadius') borderRadius$: Observable<string>

    @ViewChild('l_button') l_button_el: ElementRef
    constructor(private renderer: Renderer2) {}
    ngAfterViewInit() {
        this.borderRadius$.subscribe((bdr) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'borderRadius', bdr)
        })
        this.sizeType$.subscribe((type) => {
            switch (type) {
                case 'lg':
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'width',
                        '50px',
                        RendererStyleFlags2.Important
                    )
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'height',
                        '50px',
                        RendererStyleFlags2.Important
                    )
                    break
                case 'md':
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'width',
                        '42px',
                        RendererStyleFlags2.Important
                    )
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'height',
                        '42px',
                        RendererStyleFlags2.Important
                    )
                    break
                case 'sm':
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'width',
                        '37px',
                        RendererStyleFlags2.Important
                    )
                    this.renderer.setStyle(
                        this.l_button_el.nativeElement,
                        'height',
                        '37px',
                        RendererStyleFlags2.Important
                    )
                    break
            }
        })
        this.border$.subscribe((bd) => {
            if (!_.isEmpty(bd)) {
                this.renderer.setStyle(this.l_button_el.nativeElement, 'border', bd)
            }
        })
        this.bgColor$.subscribe((bg) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
        })
    }
}
