import { ChangeDetectorRef, Component, Input, Renderer2, ElementRef, ViewChild } from '@angular/core'

@Component({
    selector: 'rwa-vacant-tooltip',
    templateUrl: './vacant-tooltip.component.html',
    styleUrls: ['./vacant-tooltip.component.scss'],
})
export class VacantTooltipComponent {
    @Input() padding = '11px 13px 9px'
    @Input() borderRadius: string
    @Input() colorType: 'white' | 'black' | 'red' = 'black'
    @Input() movable = false

    @Input() tail: 'none' | 'left' | 'right' | 'bottom' | 'top' = 'none'

    @ViewChild('tooltip') tooltip_el: ElementRef
    constructor(private el: ElementRef) {}
}
