import {
    AfterViewInit,
    Component,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    RendererStyleFlags2,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import _ from 'lodash'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { Loading } from '@schemas/loading'

@Directive({
    selector: '[iconGhostBtIdleContent]',
})
export class IconGhostButtonIdleContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[iconGhostBtPendingContent]',
})
export class IconGhostButtonPendingContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[iconGhostBtDoneContent]',
})
export class IconGhostButtonDoneContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

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
    @Input() borderWidth = '1.5px'

    @Input() loadingSize: Size = 'small'
    @Input() loadingColor = 'var(--white)'
    @Input() loadingName = 'icon-ghost-button-loading'
    @Input() loadingMargin = '0 0 0 0'

    @Input() status: Loading = 'idle'

    @Observe('sizeType') sizeType$: Observable<'lg' | 'md' | 'sm'>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('border') border$: Observable<string>
    @Observe('borderRadius') borderRadius$: Observable<string>
    @Observe('status') status$: Observable<Loading>

    @ViewChild('l_button') l_button_el: ElementRef

    @ContentChild(IconGhostButtonIdleContentDirective) idleRef!: IconGhostButtonIdleContentDirective
    @ContentChild(IconGhostButtonPendingContentDirective) pendingRef!: IconGhostButtonPendingContentDirective
    @ContentChild(IconGhostButtonDoneContentDirective) doneRef!: IconGhostButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
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
        this.status$.subscribe((status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })
    }
}
