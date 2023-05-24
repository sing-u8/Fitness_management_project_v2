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
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import { changesOn } from '@shared/helper/component-helper'

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
export class ButtonComponent implements AfterViewInit, OnChanges {
    @Output() onClick = new EventEmitter<any>()
    _onClick() {
        this.l_button_el.nativeElement.blur()
        this.onClick.emit()
    }

    @Input() hoverBgColor = 'var(--red-200)'
    onHover() {
        if (this.disable || this.status == 'pending') return
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.hoverBgColor)
    }
    onHoverOut() {
        if (this.disable) return
        this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
    }

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
    @Input() loadingMargin = '0 10px 0 0'

    @Input() borderRadius = '14px'
    @Input() status: Loading = 'idle'
    @Input() padding = '7.5px 16px 5.5px 16px' // padding prop
    @Input() width // ex) 20px, 2rem
    @Input() height = '45px' // ex) 40px 4rem

    @Observe('width') width$: Observable<string>
    @Observe('height') height$: Observable<string>
    @Observe('status') status$: Observable<Loading>
    @Observe('disable') disable$: Observable<boolean>
    @Observe('bgColor') bgColor$: Observable<string>
    @Observe('fontColor') fontColor$: Observable<string>
    @Observe('progressBgColor') progressBgColor$: Observable<string>
    @Observe('sizeType') sizeType$: Observable<'lg' | 'md'>

    @ViewChild('l_button') l_button_el: ElementRef
    @ViewChild('progress') progress_el: ElementRef

    @ContentChild(ButtonIdleContentDirective) idleRef!: ButtonIdleContentDirective
    @ContentChild(ButtonPendingContentDirective) pendingRef!: ButtonPendingContentDirective
    @ContentChild(ButtonDoneContentDirective) doneRef!: ButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2) {}
    ngOnChanges(changes: SimpleChanges) {
        // console.log('ngOnChanges in button -- ', changes)
        changesOn(changes, 'status', (status) => {
            if (status == 'pending') {
                this.spinner.show(this.loadingName)
                this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
            } else {
                this.spinner.hide(this.loadingName)
            }
        })

        changesOn(changes, 'sizeType', (v) => {
            if (v == 'lg' && !this.height) {
                this.height = '45px'
            } else if (v == 'md' && !this.height) {
                this.height = '42px'
            }
        })
    }
    ngAfterViewInit() {
        if (this.status == 'pending') {
            this.spinner.show(this.loadingName)
            this.renderer.setStyle(this.l_button_el.nativeElement, 'backgroundColor', this.bgColor)
        } else {
            this.spinner.hide(this.loadingName)
        }
        if (this.sizeType == 'lg' && !this.height) {
            this.height = '45px'
        } else if (this.sizeType == 'md' && !this.height) {
            this.height = '42px'
        }
    }
}
