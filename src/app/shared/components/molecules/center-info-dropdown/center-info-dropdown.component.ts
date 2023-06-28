import { Component, Input } from '@angular/core'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/loading'

@Component({
    selector: 'rwm-center-info-dropdown',
    templateUrl: './center-info-dropdown.component.html',
    styleUrls: ['./center-info-dropdown.component.scss'],
})
export class CenterInfoDropdownComponent {
    @Input() center: Center
    @Input() centerList: Center[] = []
    @Input() centerListLoading: Loading = 'idle'
    constructor() {}
}
