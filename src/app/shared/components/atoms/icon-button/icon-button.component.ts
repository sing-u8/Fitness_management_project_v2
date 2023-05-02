import {
    AfterViewInit,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    RendererStyleFlags2,
    TemplateRef,
    ViewChild,
    ContentChild,
} from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import { Loading } from '@schemas/loading'
import { NgxSpinnerService, Size } from 'ngx-spinner'

@Directive({
    selector: '[iconBtIdleContent]',
})
export class IconButtonIdleContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[iconBtPendingContent]',
})
export class IconButtonPendingContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[iconBtDoneContent]',
})
export class IconButtonDoneContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: 'rwa-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements AfterViewInit {
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

    @Input() loadingSize: Size = 'small'
    @Input() loadingColor = 'var(--white)'
    @Input() loadingName = 'icon-button-loading'
    @Input() loadingMargin = '0 5px 0 0'

    @Input() status: Loading = 'idle'

    @Observe('sizeType') sizeType$: Observable<'lg' | 'md' | 'sm'>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('borderRadius') borderRadius$: Observable<string>
    @Observe('status') status$: Observable<Loading>

    @ViewChild('l_button') l_button_el: ElementRef

    @ContentChild(IconButtonIdleContentDirective) idleRef!: IconButtonPendingContentDirective
    @ContentChild(IconButtonPendingContentDirective) pendingRef!: IconButtonPendingContentDirective
    @ContentChild(IconButtonDoneContentDirective) doneRef!: IconButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
    ngAfterViewInit() {
        this.borderRadius$.subscribe((bdr) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'borderRadius', bdr)
        })
        this.status$.subscribe((status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
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
        this.bgColor$.subscribe((bg) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
        })
    }
}
