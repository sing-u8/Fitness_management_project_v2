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
    AfterViewInit,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

import { Observe } from '@shared/helper/decorator/Observe'
import { Loading } from '@schemas/loading'
import { Observable } from 'rxjs'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'

@Component({
    selector: 'rwa-vacant-modal',
    templateUrl: './vacant-modal.component.html',
    styleUrls: ['./vacant-modal.component.scss'],
})
export class VacantModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Observe('visible') visible$: Observable<boolean>
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() width = '335px'
    @Input() height = '195px'
    @Input() padding = '25px'

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<ModalOutPut>()

    public changed: boolean

    public isMouseModalDown = false

    public confirmButtonLoading: Loading = 'idle'

    showLoading() {
        this.confirmButtonLoading = 'pending'
    }

    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private spinner: NgxSpinnerService) {}

    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewChecked() {}

    ngAfterViewInit() {
        this.visible$.subscribe((v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        })
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({
            showLoading: this.showLoading.bind(this),
            hideLoading: this.hideLoading.bind(this),
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }

    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
