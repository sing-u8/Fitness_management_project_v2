import {
    AfterViewInit,
    Component,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    RendererStyleFlags2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import { changesOn } from '@shared/helper/component-helper'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { Loading } from '@schemas/loading'

// 해당 컴포넌트의 각 로딩 상태에 따라 다른 내용을 보여주게 하기 위한 디렉티브
// html 파일에서 <ng-template [ngTemplateOutlet]="idleRef.templateRef"></ng-template> 와 비슷한 부분 참고
// 해당 ts 파일에서 @ContentChild(IconGhostButtonIdleContentDirective) idleRef!: IconGhostButtonIdleContentDirective 와 비슷한 부분 참고 부분 참고
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
export class IconGhostButtonComponent implements AfterViewInit, OnChanges {
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
        if (this.disabled) return
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.hoverBgColor)
    }
    onHoverOut() {
        if (this.disabled) return
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

    @Input() disabled = false

    @Input() status: Loading = 'idle'

    @ViewChild('l_button') l_button_el: ElementRef

    @ContentChild(IconGhostButtonIdleContentDirective) idleRef!: IconGhostButtonIdleContentDirective
    @ContentChild(IconGhostButtonPendingContentDirective) pendingRef!: IconGhostButtonPendingContentDirective
    @ContentChild(IconGhostButtonDoneContentDirective) doneRef!: IconGhostButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'status', (status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })
        changesOn(changes, 'sizeType', (type: 'lg' | 'md' | 'sm') => {
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
    }

    ngAfterViewInit() {
        switch (this.sizeType) {
            case 'lg':
                this.renderer.setStyle(this.l_button_el.nativeElement, 'width', '50px', RendererStyleFlags2.Important)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'height', '50px', RendererStyleFlags2.Important)
                break
            case 'md':
                this.renderer.setStyle(this.l_button_el.nativeElement, 'width', '42px', RendererStyleFlags2.Important)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'height', '42px', RendererStyleFlags2.Important)
                break
            case 'sm':
                this.renderer.setStyle(this.l_button_el.nativeElement, 'width', '37px', RendererStyleFlags2.Important)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'height', '37px', RendererStyleFlags2.Important)
                break
        }

        if (this.status == 'pending') {
            this.spinner.show(this.loadingName)
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
        } else {
            this.spinner.hide(this.loadingName)
        }
    }
}
