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
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'

import { Loading } from '@schemas/loading'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { changesOn } from '@shared/helper/component-helper'
import { Center } from '@schemas/center'
import { CenterExpiredInfo, CenterStatus } from '@services/helper/center-list-item.service'
import { StorageService } from '@services/storage.service'

@Component({
    selector: 'rwm-center-expired-modal',
    templateUrl: './center-expired-modal.component.html',
    styleUrls: ['./center-expired-modal.component.scss'],
})
export class CenterExpiredModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() width
    @Input() height
    @Input() padding = '25px'

    @Input() center: Center
    @Input() centerExpiredInfo: CenterExpiredInfo
    @Input() centerStatus: CenterStatus

    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() close = new EventEmitter<any>()

    public changed: boolean

    public isMouseModalDown = false

    public confirmButtonLoading: Loading = 'idle'

    showLoading() {
        this.confirmButtonLoading = 'pending'
    }

    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private router: Router,
        private storageService: StorageService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
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

    ngAfterViewChecked() {}

    ngAfterViewInit() {}

    onClose(): void {
        this.close.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }

    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    //
    routeToPayment() {
        this.router.navigate([`${this.center.name}`, 'payment'])
    }
    routeToRedWhaleHome() {
        this.storageService.removeCenter()
        this.router.navigate(['redwhale-home'])
    }
}
