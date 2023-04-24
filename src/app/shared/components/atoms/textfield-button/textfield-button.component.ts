import { Component, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'
import { FormBuilder } from '@angular/forms'

import _ from 'lodash'

@Component({
    selector: 'rwa-textfield-button',
    templateUrl: './textfield-button.component.html',
    styleUrls: ['./textfield-button.component.scss'],
})
export class TextfieldButtonComponent implements AfterViewInit {
    @Input() value = ''
    @Input() onClick = new EventEmitter<any>()
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

    @Observe('tagText') tagText$: Observable<string>

    constructor(private renderer: Renderer2) {}
    ngAfterViewInit() {
        this.tagText$.subscribe((v) => {
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
