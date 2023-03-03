import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'

import { setVisibleOnChange } from '@shared/helper/modal-helper'

@Component({
    selector: 'rw-terms-eula',
    templateUrl: './terms-eula.component.html',
    styleUrls: ['./terms-eula.component.scss'],
})
export class TermsEULAComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        setVisibleOnChange(changes, this.renderer, this.modalBackgroundElement, this.modalWrapperElement)
    }

    ngAfterViewChecked() {}

    onCancel(): void {
        this.cancel.emit({})
    }
}
