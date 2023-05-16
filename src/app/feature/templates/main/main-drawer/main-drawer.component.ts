import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'
import { ChattingDrawerComponent } from '@feature/organisms/main/chatting-drawer/chatting-drawer.component'
import { MemberListDrawerComponent } from '@feature/organisms/main/member-list-drawer/member-list-drawer.component'

import { ViewDrawer } from '@schemas/components/main/ViewDrawer'

@Component({
    selector: 'rwt-main-drawer',
    standalone: true,
    imports: [CommonModule, SharedModule, ChattingDrawerComponent, MemberListDrawerComponent],
    templateUrl: './main-drawer.component.html',
    styleUrls: ['./main-drawer.component.scss'],
})
export class MainDrawerComponent {
    @Input() viewDrawer: ViewDrawer = undefined
    @Input() showDrawer = false
    @Output() onShowDrawerChange = new EventEmitter<{ showDrawer: boolean; viewDrawer: ViewDrawer }>()

    onShowDrawerClick(viewDrawer: ViewDrawer, showDrawer = true) {
        this.showDrawer = showDrawer
        this.onShowDrawerChange.emit({ showDrawer: this.showDrawer, viewDrawer })
    }
    constructor() {}
}
