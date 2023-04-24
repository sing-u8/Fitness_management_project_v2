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
} from '@angular/core'
import { NgxSpinnerService, Size } from 'ngx-spinner'
import { Observe } from '@shared/helper/decorator/Observe'
import { Observable } from 'rxjs'

import _ from 'lodash'

export type ItemsType = { name: string; value: any }
export type ValueType = any

@Component({
    selector: 'rwa-textfield-dropdown',
    templateUrl: './textfield-dropdown.component.html',
    styleUrls: ['./textfield-dropdown.component.scss'],
})
export class TextfieldDropdownComponent {
    @Input() items: Array<ItemsType> = []
    @Input() value: ValueType = undefined
    @Observe('value') value$: Observable<ValueType>
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
    @Observe('isOpen') isOpen$: Observable<boolean>
    @ViewChild('l_dropdown_items') l_dropdown_items_el: ElementRef
    toggleIsOpen() {
        if (this.disable || this.items.length == 0) return
        this.isOpen = !this.isOpen
    }
    closeDropdown() {
        this.isOpen = false
    }

    constructor(private renderer: Renderer2) {
        this.isOpen$.subscribe((v) => {
            if (v) {
                const h = Number(_.trimEnd(this.height, 'px')) + 5
                this.renderer.setStyle(this.l_dropdown_items_el.nativeElement, 'top', `${h}px`)
            }
        })
        this.value$.subscribe((v) => {
            console.log('value$ : ', v, this.value, this.bindValue, this.items)
        })
    }
}
