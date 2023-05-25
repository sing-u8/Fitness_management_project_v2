import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'

@Directive({
    selector: '[rwTooltip]',
})
export class TooltipDirective implements OnDestroy, AfterViewInit, OnChanges {
    @Input() rwTooltipTitle: string
    @Input() rwTooltipPlacement: 'top' | 'right' | 'bottom' | 'left' | 'bottom-right'
    @Input() rwTooltipDelay: number
    @Input() rwTooltipDisabled: boolean
    @Input() offset = '5'
    @Input() detailAdj = 0
    @Input() showTail = false
    @Input() parent: any = document.body

    @Input() keepTooltipWhenOut = false

    @Input() tooltipRemoveFlag = true

    private tooltip: HTMLElement
    private isInit = false

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.rwTooltipTitle = 'Tooltip'
        this.rwTooltipPlacement = 'left'
        this.rwTooltipDelay = 200
        this.rwTooltipDisabled = false
    }
    ngAfterViewInit() {}
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['tooltipRemoveFlag'] &&
            !changes['tooltipRemoveFlag'].firstChange &&
            changes['tooltipRemoveFlag'].previousValue != changes['tooltipRemoveFlag'].currentValue &&
            this.tooltipRemoveFlag == false
        ) {
            this.removeTooltip()
        }
    }
    ngOnDestroy(): void {
        this.removeTooltip()
    }

    removeTooltip() {
        if (this.tooltip) {
            this.renderer.removeChild(this.parent, this.tooltip)
            this.tooltip = null
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        if (!this.rwTooltipDisabled) {
            this.create()
            this.setPosition()
            this.isInit = true
            setTimeout(() => {
                if (this.tooltip) {
                    this.renderer.addClass(this.tooltip, 'rw-tooltip-show')
                }
            }, 0)
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.keepTooltipWhenOut) return
        this.removeTooltip()
    }

    create() {
        this.tooltip = this.renderer.createElement('div')
        this.renderer.appendChild(this.tooltip, this.renderer.createText(this.rwTooltipTitle))
        this.renderer.appendChild(this.parent, this.tooltip)

        this.renderer.addClass(this.tooltip, 'rw-tooltip')
        if (this.showTail) this.renderer.addClass(this.tooltip, `rw-tooltip-${this.rwTooltipPlacement}`)
        this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.rwTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.rwTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.rwTooltipDelay}ms`)
        this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.rwTooltipDelay}ms`)
    }

    setPosition() {
        const hostPos = this.el.nativeElement.getBoundingClientRect()
        const toolTipPos = this.tooltip.getBoundingClientRect()

        if (this.rwTooltipPlacement == 'top') {
            const adjusment =
                hostPos.width > toolTipPos.width
                    ? hostPos.width / 2 - toolTipPos.width / 2
                    : (toolTipPos.width / 2 - hostPos.width / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top - toolTipPos.height - Number(this.offset)}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left + adjusment}px`)
        } else if (this.rwTooltipPlacement == 'right') {
            const adjusment =
                hostPos.height > toolTipPos.height
                    ? hostPos.height / 2 - toolTipPos.height / 2
                    : (toolTipPos.height / 2 - hostPos.height / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top + adjusment}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.right + Number(this.offset)}px`)
        } else if (this.rwTooltipPlacement == 'bottom' || this.rwTooltipPlacement == 'bottom-right') {
            const adjusment =
                hostPos.width > toolTipPos.width
                    ? hostPos.width / 2 - toolTipPos.width / 2
                    : (toolTipPos.width / 2 - hostPos.width / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.bottom + Number(this.offset)}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left + adjusment + this.detailAdj}px`)
        } else if (this.rwTooltipPlacement == 'left') {
            const adjusment =
                hostPos.height > toolTipPos.height
                    ? hostPos.height / 2 - toolTipPos.height / 2
                    : (toolTipPos.height / 2 - hostPos.height / 2) * -1
            this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top + adjusment}px`)
            this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left - toolTipPos.width - Number(this.offset)}px`)
        }
    }
}
