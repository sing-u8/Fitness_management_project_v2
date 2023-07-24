import { Component, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core'

import _ from 'lodash'
import { TabInput } from '@schemas/components/tab'

@Component({
    selector: 'rwa-sm-icon-tab',
    templateUrl: './sm-icon-tab.component.html',
    styleUrls: ['./sm-icon-tab.component.scss'],
})
export class SmIconTabComponent {
    @Input() tabs: Array<TabInput> = []
    @Input() tabColor = 'var(--red-100)'

    @Output() onTabItemSelected = new EventEmitter<TabInput[]>()

    @ViewChildren('button') button_els: QueryList<HTMLButtonElement>

    onItemSelected(idx: number) {
        this.button_els['_results'][idx].nativeElement.blur()
        if (this.tabs[idx].selected) return
        _.forEach(this.tabs, (v, i) => {
            this.tabs[i].selected = i == idx
        })
        this.onTabItemSelected.emit(this.tabs)
    }

    public isMouseDown = false
    onMouseDown() {
        this.isMouseDown = true
    }
    onMouseUp() {
        this.isMouseDown = false
    }
    constructor() {}
}
