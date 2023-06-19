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

import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'

import { Loading } from '@schemas/loading'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { User } from '@schemas/user'

import { changesOn } from '@shared/helper/component-helper'
import { originalOrder } from '@shared/helper/pipe/keyvalue-helper'
import { getLinkedAccountStr, getMarketingStr, isLinkedAccountExist } from '@shared/helper/account-helper'

import { ChangeUserNameOutput } from '@shared/components/molecules/change-user-name-modal/change-user-name-modal.component'
import dayjs from 'dayjs'
import _ from 'lodash'

import { showToast } from '@store/app/actions/toast.action'
import { Store, select } from '@ngrx/store'

@Component({
    selector: 'rwm-create-center-modal',
    templateUrl: './create-center-modal.component.html',
    styleUrls: ['./create-center-modal.component.scss'],
})
export class CreateCenterModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public originalOrder = originalOrder
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private nxStore: Store,
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
    // -----------------------------------------------------------------------------------------------------------

    @Output() close = new EventEmitter()
    @Output() open = new EventEmitter()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
    }
    onOpen() {
        this.open.emit()
    }
    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
