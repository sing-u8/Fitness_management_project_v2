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
    ChangeDetectorRef,
} from '@angular/core'
import { setVisibleOnChange } from '@shared/helper/modal-helper'

@Component({
    selector: 'rw-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges {
    @Input() visible = false
    @Input() data: {
        text?: string
        subText?: string
        cancelButtonText?: string
        confirmButtonText?: string
    }
    @Input() type: string

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef) {
        this.type = 'type1'
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        setVisibleOnChange(changes, this.renderer, this.modalBackgroundElement, this.modalWrapperElement)
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
