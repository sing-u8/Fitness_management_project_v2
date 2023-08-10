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
    ChangeDetectorRef,
} from '@angular/core'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { changesOn, detectChangesOn } from '@shared/helper/component-helper'

import { Loading } from '@schemas/loading'

// 해당 컴포넌트의 각 로딩 상태에 따라 다른 내용을 보여주게 하기 위한 디렉티브
// html 파일에서 <ng-container [ngTemplateOutlet]="idleRef.templateRef"></ng-container> 와 비슷한 부분 참고 - line 17
// ts 파일에서 @ContentChild(ButtonIdleContentDirective) idleRef!: ButtonIdleContentDirective 와 비슷한 부분 참고 - line 90
// 참고 링크 : https://angular.io/guide/content-projection
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
    @Input() sizeType: 'lg' | 'md' | 'sm' = 'lg'

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
    @Input() height // ex) 40px 4rem

    @ViewChild('l_button') l_button_el: ElementRef
    @ViewChild('progress') progress_el: ElementRef

    @ContentChild(ButtonIdleContentDirective) idleRef!: ButtonIdleContentDirective
    @ContentChild(ButtonPendingContentDirective) pendingRef!: ButtonPendingContentDirective
    @ContentChild(ButtonDoneContentDirective) doneRef!: ButtonDoneContentDirective

    constructor(private spinner: NgxSpinnerService, private renderer: Renderer2, private cd: ChangeDetectorRef) {}
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
                if (!this.padding) this.padding = '9px 25px 7px'
            } else if (v == 'md' && !this.height) {
                this.height = '42px'
                if (!this.padding) this.padding = '7.5px 16px 5.5px'
            } else if (v == 'sm' && !this.height) {
                this.height = '37px'
                if (!this.padding) this.padding = '5px 11px 3px'
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
            if (!this.padding) this.padding = '9px 25px 7px'
        } else if (this.sizeType == 'md' && !this.height) {
            this.height = '42px'
            if (!this.padding) this.padding = '7.5px 16px 5.5px'
        } else if (this.sizeType == 'sm' && !this.height) {
            this.height = '37px'
            if (!this.padding) this.padding = '5px 11px 3px'
        }

        this.cd.detectChanges()
    }
}
