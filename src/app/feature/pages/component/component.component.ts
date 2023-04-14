import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@shared/shared.module'

import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwp-component',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss'],
})
export class ComponentComponent {
    constructor() {
        setTimeout(() => {
            this.button1.status = 'done'
            this.button1.progress = 0
            this.button2.status = 'pending'
            this.button2.progress = 80
        }, 2000)
    }

    // button
    button1 = {
        status: 'idle' as Loading,
        loadingName: 'button1',
        progress: 0,
    }
    button2 = {
        status: 'idle' as Loading,
        loadingName: 'button2',
        progress: 0,
    }
    button1_1 = {
        status: 'idle' as Loading,
        loadingName: 'button2',
    }
    button1_2 = {
        status: 'idle' as Loading,
    }
}
