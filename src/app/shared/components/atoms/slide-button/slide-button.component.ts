import {
    Component,
    Input,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    ViewChild,
    ElementRef,
} from '@angular/core'

import { detectChangesOn } from '@shared/helper/component-helper'
import _ from 'lodash'

@Component({
    selector: 'rwa-slide-button',
    templateUrl: './slide-button.component.html',
    styleUrls: ['./slide-button.component.scss'],
})
export class SlideButtonComponent implements AfterViewInit, OnChanges {
    @Input() disable = false
    @Input() curNumber = 0
    @Output() curNumberChange = new EventEmitter<number>()
    @Input() slideNumber = 0
    @Input() allowAdditionalNext = false

    @ViewChildren('button') button_els: QueryList<HTMLButtonElement>
    @ViewChild('left_button') left_button_el: ElementRef
    @ViewChild('right_button') right_button_el: ElementRef
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {}
    ngAfterViewInit() {}

    onLeftArrowClick() {
        this.left_button_el.nativeElement.blur()
        if (this.curNumber == 1 || this.disable) return
        this.curNumber--
        this.curNumberChange.emit(this.curNumber)
    }
    onRightArrowClick() {
        this.right_button_el.nativeElement.blur()
        if (
            (!this.allowAdditionalNext && this.curNumber == this.slideNumber) ||
            (this.allowAdditionalNext && this.curNumber == this.slideNumber + 1) ||
            this.disable
        ) {
            return
        }
        this.curNumber++
        this.curNumberChange.emit(this.curNumber)
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
}
