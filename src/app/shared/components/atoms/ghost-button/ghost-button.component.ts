import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Directive,
    TemplateRef,
    ContentChild,
} from '@angular/core'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { Observe } from '@shared/helper/decorator/Observe'
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
export class GhostButtonComponent implements AfterViewInit {
    @Output() onClick = new EventEmitter<any>()
    _onClick() {
        this.onClick.emit()
    }
    @Input() hoverBgColor = 'var(--gray-30)'
    @Input() hoverBorderColor = '--gray-60'
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

    @Input() bgColor = 'var(--white)'
    @Input() progressPercent = 0 // 0 ~ 100
    @Input() progressBgColor = 'var(--red-200)'
    @Input() fontColor = 'var(--gray-90)'
    @Input() sizeType: 'lg' | 'md' = 'lg'

    @Input() disable = false
    @Input() disableFontColor = 'var(--gray-60)'
    @Input() disableBgColor = 'var(--gray-50)'
    @Input() disableBorderColor = 'var(--gray-60)'

    @Input() loadingSize: Size = 'small'
    @Input() loadingColor = 'var(--white)'
    @Input() loadingName = 'ghost-button-loading'

    @Input() borderRadius = '14px'
    @Input() borderColor = '--gray-60'

    @Input() status: Loading = 'idle'
    @Input() padding = '9px 10px 7px 10px' // padding prop
    @Input() width = '230px' // ex) 20px, 2rem
    @Input() height = '45px' // ex) 40px 4rem

    @Observe('status') status$: Observable<Loading>
    @Observe('disable') disable$: Observable<boolean>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('fontColor') fontColor$: Observable<string>

    @ViewChild('l_button') l_button_el: ElementRef
    @ViewChild('progress') progress_el: ElementRef

    @ContentChild(GhostButtonIdleContentDirective) idleRef!: GhostButtonIdleContentDirective
    @ContentChild(GhostButtonPendingContentDirective) pendingRef!: GhostButtonPendingContentDirective
    @ContentChild(GhostButtonDoneContentDirective) doneRef!: GhostButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
    ngAfterViewInit() {
        this.status$.subscribe((status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', this.borderColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })

        this.fontColor$.subscribe((fontColor) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'color', fontColor)
        })
        this.bgColor$.subscribe((bgColor) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', bgColor)
        })

        this.disable$.subscribe((disable) => {
            if (disable) {
                this.renderer.setStyle(this.l_button_el.nativeElement, 'color', `${this.disableFontColor}`)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', `${this.disableBgColor}`)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', `${this.disableBorderColor}`)
            } else {
                this.renderer.setStyle(this.l_button_el.nativeElement, 'color', `${this.fontColor}`)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', `${this.bgColor}`)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'borderColor', `${this.borderColor}`)
            }
        })
    }
}
