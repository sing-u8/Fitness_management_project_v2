import {
    Component,
    Input,
    Output,
    EventEmitter,
    RendererStyleFlags2,
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
    selector: '[btIdleContent]',
})
export class ButtonIdleContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[btPendingContent]',
})
export class ButtonPendingContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}
@Directive({
    selector: '[btDoneContent]',
})
export class ButtonDoneContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: 'rwa-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements AfterViewInit {
    @Output() onClick = new EventEmitter<any>()

    @Input() bgColor = 'var(--red-100)'
    @Input() progressPercent = 0 // 0 ~ 100
    @Input() progressBgColor = 'var(--red-200)'
    @Input() fontColor = 'var(--white)'
    @Input() sizeType: 'lg' | 'md' = 'lg'

    @Input() disable = false
    @Input() disableFontColor = 'var(--white)'
    @Input() disableBgColor = 'var(--gray-50)'

    @Input() loadingSize: Size = 'small'
    @Input() loadingColor = 'var(--white)'
    @Input() loadingName = 'button-loading'

    @Input() borderRadius: string = '14px'
    @Input() status: Loading = 'idle'
    @Input() padding = '7.5px 16px 5.5px 16px' // padding prop
    @Input() width = '110px' // ex) 20px, 2rem
    @Input() height = '45px' // ex) 40px 4rem

    @Observe('status') status$: Observable<Loading>
    @Observe('disable') disable$: Observable<boolean>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('fontColor') fontColor$: Observable<string>
    @Observe('progressBgColor') progressBgColor$: Observable<string>

    @ViewChild('l_button') l_button_el: ElementRef
    @ViewChild('progress') progress_el: ElementRef

    @ContentChild(ButtonIdleContentDirective) idleRef!: ButtonIdleContentDirective
    @ContentChild(ButtonPendingContentDirective) pendingRef!: ButtonPendingContentDirective
    @ContentChild(ButtonDoneContentDirective) doneRef!: ButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
    ngAfterViewInit() {
        this.status$.subscribe((status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })
        this.disable$.subscribe((disable) => {
            if (disable) {
                this.renderer.setStyle(this.l_button_el.nativeElement, 'color', `${this.disableFontColor}`)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', `${this.disableBgColor}`)
            } else {
                this.renderer.removeStyle(this.l_button_el.nativeElement, 'color')
                this.renderer.removeStyle(this.l_button_el.nativeElement, 'backgroundColor')
            }
        })
        this.fontColor$.subscribe((fontColor) => {
            this.renderer.setStyle(this.l_button_el.nativeElement, 'color', fontColor)
        })
        this.bgColor$.subscribe((bgColor) => {
            if (bgColor == 'red') {
                this.loadingColor = 'var(--white)'
                this.renderer.addClass(this.l_button_el.nativeElement, 'red-bg')
            } else if (bgColor == 'gray') {
                this.loadingColor = 'var(--white)'
                this.renderer.addClass(this.l_button_el.nativeElement, 'gray-bg')
            } else if (bgColor == 'white') {
                this.loadingColor = 'var(--font-color)'
                this.renderer.addClass(this.l_button_el.nativeElement, 'white-bg')
            } else {
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', bgColor)
            }
        })
    }
}
