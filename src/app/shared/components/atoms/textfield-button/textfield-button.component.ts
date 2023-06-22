import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'

import _ from 'lodash'
import { changesOn } from '@shared/helper/component-helper'

@Component({
    selector: 'rwa-textfield-button',
    templateUrl: './textfield-button.component.html',
    styleUrls: ['./textfield-button.component.scss'],
})
export class TextfieldButtonComponent implements AfterViewInit, OnChanges {
    @Input() value = ''
    @Input() placeHolder = ''
    @Output() onClick = new EventEmitter<any>()
    @Input() tagText = '변경'

    @Input() width = '400px'
    @Input() height = '48px'

    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() disable = false
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: 'warning' | 'error' | 'success' | 'none' = 'none'
    @Input() statusText = ''

    @ViewChild('button') button_el: ElementRef
    @ViewChild('tag_text') tag_text_el: ElementRef

    constructor(private renderer: Renderer2) {}
    ngAfterViewInit() {
        const spaceLen = _.split(this.tagText, ' ').length - 1
        const vWidth = (this.tagText.length - spaceLen) * 15 + spaceLen * 8
        this.renderer.setStyle(this.tag_text_el.nativeElement, 'minWidth', `${vWidth}px`)
    }
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'tagText', (v) => {
            const spaceLen = _.split(v, ' ').length - 1
            const vWidth = (v.length - spaceLen) * 15 + spaceLen * 8
            this.renderer.setStyle(this.tag_text_el.nativeElement, 'minWidth', `${vWidth}px`)
        })
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    onFocus() {
        if (!this.isMouseDown) this.renderer.addClass(this.button_el.nativeElement, 'focused')
    }
    onFocusOut() {
        this.renderer.removeClass(this.button_el.nativeElement, 'focused')
    }
}
