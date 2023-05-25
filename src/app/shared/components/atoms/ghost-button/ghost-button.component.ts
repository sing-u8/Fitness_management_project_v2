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
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { changesOn } from '@shared/helper/component-helper'
import { Observable } from 'rxjs'

import { Loading } from '@schemas/loading'

@Directive({
    selector: '[gbtIdleContent]',
})
export class GhostButtonIdleContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[gbtPendingContent]',
})
export class GhostButtonPendingContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[gbtDoneContent]',
})
export class GhostButtonDoneContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: 'rwa-ghost-button',
    templateUrl: './ghost-button.component.html',
    styleUrls: ['./ghost-button.component.scss'],
})
export class GhostButtonComponent implements AfterViewInit, OnChanges {
    @Output() onClick = new EventEmitter<any>()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.onClick.emit()
    }
    @Input() hoverBgColor = 'var(--gray-30)'
    @Input() hoverBorderColor = 'var(--gray-60)'
    onHover() {
        if (this.disable || this.status == 'pending') return
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.hoverBgColor)
        this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', this.hoverBorderColor)
    }
    onHoverOut() {
        if (this.disable) return
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
        this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', this.borderColor)
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

    @Input() bgColor = 'var(--white)'
    @Input() progressPercent = 0 // 0 ~ 100
    @Input() progressBgColor = 'var(--red-200)'
    @Input() fontColor = 'var(--gray-90)'

    @Input() disable = false
    @Input() disableFontColor = 'var(--gray-60)'
    @Input() disableBgColor = 'var(--white)'
    @Input() disableBorderColor = 'var(--gray-60)'

    @Input() loadingSize: Size = 'small'
    @Input() loadingColor = 'var(--white)'
    @Input() loadingName = 'ghost-button-loading'

    @Input() borderRadius = '14px'
    @Input() borderColor = 'var(--gray-60)'
    @Input() borderWidth = '1px'

    @Input() status: Loading = 'idle'
    @Input() padding = '9px 10px 7px 10px' // padding prop
    @Input() width // ex) 20px, 2rem
    @Input() height = '45px' // ex) 40px 4rem

    @ViewChild('l_button') l_button_el: ElementRef
    @ViewChild('progress') progress_el: ElementRef

    @ContentChild(GhostButtonIdleContentDirective) idleRef!: GhostButtonIdleContentDirective
    @ContentChild(GhostButtonPendingContentDirective) pendingRef!: GhostButtonPendingContentDirective
    @ContentChild(GhostButtonDoneContentDirective) doneRef!: GhostButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'status', (status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', this.borderColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })
    }

    ngAfterViewInit() {
        if (this.status == 'pending') {
            this.spinner.show(this.loadingName)
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
            this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', this.borderColor)
        } else {
            this.spinner.hide(this.loadingName)
        }
    }
}
