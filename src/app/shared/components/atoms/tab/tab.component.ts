import { Component, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core'

import _ from 'lodash'
import { TabInput } from '@schemas/components/tab'

@Component({
    selector: 'rwa-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
    @Input() label = ''
    @Input() tabs: Array<TabInput> = []
    @Input() width = 400
    @Input() height = 48

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
