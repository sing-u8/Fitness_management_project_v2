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

    checkbox1 = false
    checkbox2 = false
    onCheckBox1(e) {
        this.checkbox1 = e
        console.log('on check box 1 click : ', this.checkbox1)
    }
    onCheckBox2(e) {
        this.checkbox2 = e
        console.log('on check box 2 click : ', this.checkbox2)
    }

    radio1 = false
    radio2 = false
    onRadio1(e) {
        this.radio1 = e
        console.log('on radio 1 click : ', this.radio1)
    }
    onRadio2(e) {
        this.radio2 = e
        console.log('on radio 2 click : ', this.radio2)
    }

    toggle1 = false
    toggle2 = false
    ontoggle1(e) {
        this.toggle1 = e
        console.log('on toggle 1 click : ', this.toggle1)
    }
    ontoggle2(e) {
        this.toggle2 = e
        console.log('on radio 2 click : ', this.radio2)
    }
}
