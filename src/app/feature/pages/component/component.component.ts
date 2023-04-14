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
            this.button1.width = '140px'
            this.button1.status = 'done'
            this.button1.progress = 0
            this.button2.status = 'pending'
            this.button2.progress = 80
        }, 2000)
    }

    // button
    button1 = {
        width: '110px',
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
    button1_2Disable = true

    // // ghost button
    gbt1 = {
        disable: false,
    }
    gbt2 = {
        progress: 'idle' as Loading,
    }
    gbt2Click() {
        if (this.gbt2.progress == 'idle') {
            this.gbt2.progress = 'pending'
        } else if (this.gbt2.progress == 'pending') {
            this.gbt2.progress = 'done'
        } else {
            this.gbt2.progress = 'idle'
        }
    }
}
