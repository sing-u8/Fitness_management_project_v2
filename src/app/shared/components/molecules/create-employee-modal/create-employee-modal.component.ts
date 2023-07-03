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
    OnInit,
    OnDestroy,
} from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'

import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'
import { SearchAddressService } from '@services/search-address/search-address.service'
import { CenterService } from '@services/center.service'
import { FileService } from '@services/file.service'

import { Loading } from '@schemas/loading'

import { changesOn } from '@shared/helper/component-helper'
import { originalOrder } from '@shared/helper/pipe/keyvalue-helper'

import _ from 'lodash'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { forkJoin, Subject } from 'rxjs'
import { TabInput } from '@schemas/components/tab'

@Component({
    selector: 'rwm-create-employee-modal',
    templateUrl: './create-employee-modal.component.html',
    styleUrls: ['./create-employee-modal.component.scss'],
})
export class CreateEmployeeModalComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public createButtonLoading: Loading = 'idle'
    public originalOrder = originalOrder
    public unDescriber$ = new Subject<boolean>()

    public positionTabs: Array<TabInput> = [
        {
            name: '강사',
            selected: true,
            value: 'instructor',
        },
        {
            name: '관리자',
            selected: false,
            value: 'administrator',
        },
    ]

    public centerForm = this.fb.group({
        employeeName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)]],
    })
    get employeeName() {
        return this.centerForm.get('employeeName')
    }
    get phoneNumber() {
        return this.centerForm.get('phoneNumber')
    }
    get email() {
        return this.centerForm.get('email')
    }

    public centerPicture: FileList = undefined
    public centerPictureSrc = ''
    onCenterPictureChange(res: { pictureFile: FileList; pictureSrc: string }) {
        this.centerPicture = res.pictureFile
        this.centerPictureSrc = res.pictureSrc
    }
    public linkEmailAccount = false

    reset() {
        this.centerForm.reset()

        this.centerPicture = undefined
        this.centerPictureSrc = ''

        this.linkEmailAccount = false
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private nxStore: Store,
        private storageService: StorageService,
        private searchAddressService: SearchAddressService,
        private centerService: CenterService,
        private fileService: FileService,
        public location: Location,
        public router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.phoneNumber.valueChanges.pipe(takeUntil(this.unDescriber$)).subscribe((v) => {
            let value = _.isEmpty(v) ? '' : _.replace(v, /[^0-9]/gi, '')
            if (value.length > 0) {
                if (value.length > 3 && value.length < 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3)
                } else if (value.length >= 8) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
                }
            }
            this.phoneNumber.setValue(value, { emitEvent: false })
        })
        this.email.valueChanges.pipe(takeUntil(this.unDescriber$)).subscribe((v) => {
            this.linkEmailAccount = v.length != 0
        })
    }

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
                this.reset()
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    // -----------------------------------------------------------------------------------------------------------
    createEmployee() {
        this.createButtonLoading = 'pending'
    }

    // -----------------------------------------------------------------------------------------------------------

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
