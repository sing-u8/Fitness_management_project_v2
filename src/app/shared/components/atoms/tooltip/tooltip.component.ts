import { ChangeDetectorRef, Component, Input, Renderer2 } from '@angular/core'

@Component({
    selector: 'rwa-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
    @Input() minWidth: string
    @Input() width: string
    @Input() height: string
    @Input() padding: string
    @Input() borderRadius: string
    @Input() colorType: 'white' | 'black' | 'red' = 'black'
    @Input() type: 'normal' | 'withDetail' | 'title-content' = 'normal'
    @Input() movable = false

    @Input() tail: 'none' | 'left' | 'right' | 'bottom' | 'top' = 'none'

    @Input() textObj: {
        title: string
        desc?: string
    }

    public showDetail = false
    constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}
}
