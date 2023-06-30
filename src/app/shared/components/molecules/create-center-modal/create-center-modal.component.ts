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
import { Store, select } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { forkJoin, Subject } from 'rxjs'

@Component({
    selector: 'rwm-create-center-modal',
    templateUrl: './create-center-modal.component.html',
    styleUrls: ['./create-center-modal.component.scss'],
})
export class CreateCenterModalComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public createButtonLoading: Loading = 'idle'

    public originalOrder = originalOrder
    public unDescriber$ = new Subject<boolean>()

    public centerForm = this.fb.group({
        centerName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        zonecode: ['', [Validators.required, Validators.pattern(/^[0-9]/)]],
        roadAddress: ['', Validators.required],
        detailedAddress: [''],
    })
    get centerName() {
        return this.centerForm.get('centerName')
    }
    get phoneNumber() {
        return this.centerForm.get('phoneNumber')
    }
    get zonecode() {
        return this.centerForm.get('zonecode')
    }
    get roadAddress() {
        return this.centerForm.get('roadAddress')
    }
    get detailedAddress() {
        return this.centerForm.get('detailedAddress')
    }

    public centerPicture: FileList = undefined
    public centerPictureSrc = ''
    onCenterPictureChange(res: { pictureFile: FileList; pictureSrc: string }) {
        this.centerPicture = res.pictureFile
        this.centerPictureSrc = res.pictureSrc
    }

    public businessLicenseFile: FileList = undefined
    public businessLicenseFileName = ''

    onBusinessLicenseClicked(event) {
        event.target.value = null
    }
    setBusinessLicenseFile(file: any) {
        if (this.fileService.checkFileSizeTooLarge(file.files[0], 2)) {
            this.nxStore.dispatch(
                showToast({
                    text: '파일의 용량이 커서 업로드할 수 없어요. (최대 2MB)',
                })
            )
            return
        }

        this.businessLicenseFile = file.files
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.businessLicenseFileName = this.businessLicenseFile[0].name
        }
        fileReader.readAsDataURL(this.businessLicenseFile[0])
    }

    public freeTrialAgree = false

    reset() {
        this.centerForm.reset()

        this.centerPicture = undefined
        this.centerPictureSrc = ''

        this.businessLicenseFile = undefined
        this.businessLicenseFileName = ''

        this.freeTrialAgree = false
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
    createCenter() {
        this.createButtonLoading = 'pending'
        this.centerService
            .createCenter({
                name: this.centerName.value,
                zip_no: this.zonecode.value,
                road_full_addr: this.roadAddress.value,
                addr_detail: this.detailedAddress.value,
                phone_number: _.replace(this.phoneNumber.value, /[^0-9]/gi, ''),
                free_trial_terms: this.freeTrialAgree,
            })
            .subscribe((center) => {
                console.log('create center : ', center)
                const cb = () => {
                    this.nxStore.dispatch(showToast({ text: '✨ 새로운 센터를 만들었어요.' }))
                    this.onClose(false)
                    this.createButtonLoading = 'idle'
                }
                if (!_.isEmpty(this.centerPicture) && !_.isEmpty(this.businessLicenseFile)) {
                    forkJoin([
                        this.fileService.uploadFile(
                            center.id,
                            { type_code: 'file_type_center_picture' },
                            this.centerPicture
                        ),
                        this.fileService.uploadFile(
                            center.id,
                            { type_code: 'file_type_center_business_registration' },
                            this.businessLicenseFile
                        ),
                    ]).subscribe(([centerPictureFile, businessLicenseFile]) => {
                        cb()
                    })
                } else if (_.isEmpty(this.centerPicture) && !_.isEmpty(this.businessLicenseFile)) {
                    this.fileService
                        .uploadFile(
                            center.id,
                            { type_code: 'file_type_center_business_registration' },
                            this.businessLicenseFile
                        )
                        .subscribe((businessLicenseFile) => {
                            cb()
                        })
                } else {
                    cb()
                }
            })
    }

    // -----------------------------------------------------------------------------------------------------------
    openSearchAddressPopup() {
        const width = 400
        const height = 400
        const popupKey = 'daumPopupKey'

        new window['daum'].Postcode({
            oncomplete: (data) => {
                this.zonecode.setValue(data.zonecode)
                this.roadAddress.setValue(data.roadAddress)
            },
            onclose: (state) => {},
            width,
            height,
        }).open({
            left: window.screen.width / 2 - width / 2,
            top: window.screen.height / 2 - height / 2,
            popupKey,
        })
    }

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
