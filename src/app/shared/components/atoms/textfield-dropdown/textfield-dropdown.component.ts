import {
    AfterViewInit,
    Component,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
    RendererStyleFlags2,
    TemplateRef,
    ViewChild,
    OnChanges,
    SimpleChanges,
} from '@angular/core'

import _ from 'lodash'
import { changesOn } from '@shared/helper/component-helper'

export type ItemsType = { name: string; value: any }
export type ValueType = any

@Component({
    selector: 'rwa-textfield-dropdown',
    templateUrl: './textfield-dropdown.component.html',
    styleUrls: ['./textfield-dropdown.component.scss'],
})
export class TextfieldDropdownComponent implements AfterViewInit, OnChanges {
    @Input() items: Array<ItemsType> = []
    @Input() value: ValueType = undefined
    @Output() onSelectValue = new EventEmitter<ValueType>()
    _onSelectValue(v: ItemsType) {
        this.closeDropdown()
        this.onSelectValue.emit(v.value)
    }
    @Input() bindValue = 'id'

    @Input() labelVisible = true
    @Input() label = '필드 레이블'
    @Input() placeholder = '플레이스 홀더'
    @Input() disable = false
    @Input() advice = ''
    @Input() hint = ''
    @Input() status: 'warning' | 'error' | 'success' | 'none' = 'none'
    @Input() statusText = ''

    @Input() width = '400px'
    @Input() height = '48px'

    public isOpen = false
    @ViewChild('l_dropdown_items') l_dropdown_items_el: ElementRef
    toggleIsOpen() {
        if (this.disable || this.items.length == 0) return
        this.isOpen = !this.isOpen
    }
    closeDropdown() {
        this.isOpen = false
    }

    constructor(private renderer: Renderer2) {}
    ngAfterViewInit() {
        const h = Number(_.trimEnd(this.height, 'px')) + 5
        this.renderer.setStyle(this.l_dropdown_items_el.nativeElement, 'top', `${h}px`)
    }
    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'height', (v) => {
            const h = Number(_.trimEnd(v, 'px')) + 5
            this.renderer.setStyle(this.l_dropdown_items_el.nativeElement, 'top', `${h}px`)
        })
    }
}
