import { Component, Input } from '@angular/core'

@Component({
    selector: 'rwa-svg-xor-o-icon',
    templateUrl: './xor-o-icon.component.html',
    styleUrls: ['./xor-o-icon.component.scss'],
})
export class XorOIconComponent {
    @Input() value = false
    constructor() {}
}
