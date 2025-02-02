import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    Output,
    Renderer2,
    OnDestroy,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { detectChangesOn } from '@shared/helper/component-helper'

import _ from 'lodash'

@Directive({
    selector: '[rwEllipsisDropdown]',
})
export class EllipsisDropdownDirective implements AfterViewInit, OnDestroy, OnChanges {
    @Input() lineClamp = 1
    @Input() deviation = 0
    @Input() edText = ''
    @Input() additionalEdText = ''
    @Input() additionalDropDownWidth = ''

    public spanEl: HTMLSpanElement = undefined
    public dropdownEl: HTMLDivElement = undefined

    public dropDownMouseOverUnlistener: () => void = () => {}
    public dropDownMouseLeaveUnlistener: () => void = () => {}

    public resizeListener: () => void = () => {}

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'edText', (v) => {
            if (_.isElement(this.spanEl) && _.isElement(this.dropdownEl)) {
                const element = this.elementRef.nativeElement
                this.spanEl.innerText = this.edText
                this.dropdownEl.innerHTML = this.edText + this.additionalEdText
                if (this.additionalDropDownWidth) {
                    this.renderer.setStyle(this.dropdownEl, 'width', `calc(100% + ${this.additionalDropDownWidth})`)
                }
                this.initDropDownListener(element)
            }
        })
        detectChangesOn(changes, 'additionalEdText', (v) => {
            if (_.isElement(this.spanEl) && _.isElement(this.dropdownEl)) {
                const element = this.elementRef.nativeElement
                this.spanEl.innerText = this.edText
                this.dropdownEl.innerHTML = this.edText + this.additionalEdText
                if (this.additionalDropDownWidth) {
                    this.renderer.setStyle(this.dropdownEl, 'width', `calc(100% + ${this.additionalDropDownWidth})`)
                }
                this.initDropDownListener(element)
            }
        })
    }

    ngAfterViewInit(): void {
        const element = this.elementRef.nativeElement
        this.renderer.setStyle(element, 'position', 'relative')

        this.spanEl = this.renderer.createElement('span')
        element.innerText = ''
        this.spanEl.innerText = this.edText
        this.renderer.appendChild(element, this.spanEl)

        this.dropdownEl = this.renderer.createElement('div')
        this.dropdownEl.innerHTML = this.edText + this.additionalEdText
        this.renderer.appendChild(element, this.dropdownEl)
        this.renderer.addClass(this.dropdownEl, 'ellipsis-dropdown')
        if (this.additionalDropDownWidth) {
            this.renderer.setStyle(this.dropdownEl, 'width', `calc(100% + ${this.additionalDropDownWidth})`)
        }
        // this.renderer.setStyle(this.dropdownEl, 'bottom', `-${this.dropdownEl.offsetHeight + 5}px`)
        this.renderer.setStyle(this.dropdownEl, 'z-index', `5`)
        this.renderer.setStyle(this.dropdownEl, 'display', 'none')

        this.renderer.setStyle(element, 'position', 'relative')
        this.renderer.addClass(this.spanEl, 'line-ellipsis')
        this.renderer.setStyle(this.spanEl, '-webkit-line-clamp', `${this.lineClamp}`)

        setTimeout(() => {
            this.initDropDownListener(element)
        }, 10)

        this.resizeListener = this.renderer.listen(window, 'resize', (e) => {
            this.initDropDownListener(element)
        })
    }

    initDropDownListener(element) {
        if (_.isFunction(this.dropDownMouseOverUnlistener)) this.dropDownMouseOverUnlistener()
        if (_.isFunction(this.dropDownMouseLeaveUnlistener)) this.dropDownMouseLeaveUnlistener()

        if (this.checkIsOverFlow(this.spanEl, this.lineClamp, this.deviation)) {
            this.renderer.addClass(this.spanEl, 'cursor-pointer')
            if (_.isFunction(this.dropDownMouseOverUnlistener)) this.dropDownMouseOverUnlistener()
            this.dropDownMouseOverUnlistener = this.renderer.listen(element, 'mouseover', (e) => {
                this.renderer.setStyle(this.dropdownEl, 'display', 'flex')
            })
            if (_.isFunction(this.dropDownMouseLeaveUnlistener)) this.dropDownMouseLeaveUnlistener()
            this.dropDownMouseLeaveUnlistener = this.renderer.listen(element, 'mouseleave', (e) => {
                this.renderer.setStyle(this.dropdownEl, 'display', 'none')
            })
        }
    }

    ngOnDestroy(): void {
        this.dropDownMouseOverUnlistener()
        this.dropDownMouseLeaveUnlistener()
    }

    getContentWidth(element) {
        const styles = getComputedStyle(element)
        return element.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
    }
    checkIsOverFlow(element, line: number, deviation: number) {
        const elementStyles = getComputedStyle(element)
        return Number(elementStyles.lineHeight.replace(/[^0-9.]/gi, '')) * line < element.scrollHeight - deviation
    }
}
