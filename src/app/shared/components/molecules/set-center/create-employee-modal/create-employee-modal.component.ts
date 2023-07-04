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
import { CenterEmployeeService, CreateEmployeeReqBody, RoleCode } from '@services/center-employee.service'

import { Loading } from '@schemas/loading'

import { changesOn } from '@shared/helper/component-helper'
import { originalOrder } from '@shared/helper/pipe/keyvalue-helper'

import _ from 'lodash'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { forkJoin, Subject } from 'rxjs'
import { TabInput } from '@schemas/components/tab'
import { Employee } from '@schemas/employee'
import { Center } from '@schemas/center'
import { Status } from '@schemas/components/status'

@Component({
    selector: 'rwm-create-employee-modal',
    templateUrl: './create-employee-modal.component.html',
    styleUrls: ['./create-employee-modal.component.scss'],
})
export class CreateEmployeeModalComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() center: Center

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
    public emailStatus: Status = 'none'

    public employeePicture: FileList = undefined
    public employeePictureSrc = ''
    onCenterPictureChange(res: { pictureFile: FileList; pictureSrc: string }) {
        this.employeePicture = res.pictureFile
        this.employeePictureSrc = res.pictureSrc
    }
    public linkEmailAccount = false

    reset() {
        this.centerForm.reset()

        this.employeePicture = undefined
        this.employeePictureSrc = ''

        this.linkEmailAccount = false

        this.emailStatus = 'none'
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
        private fb: FormBuilder,
        private centerEmployeeService: CenterEmployeeService
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
            this.linkEmailAccount = v?.length != 0
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
        this.emailStatus = 'none'

        const reqBody: CreateEmployeeReqBody = {
            role_code: _.find(this.positionTabs, (v) => v.selected).value as RoleCode,
            name: this.employeeName.value,
            phone_number: _.replace(this.phoneNumber.value, /[^0-9]/gi, ''),
            email: this.email.value ?? '',
            connection: this.linkEmailAccount,
        }

        this.centerEmployeeService.createEmployee(this.center.id, reqBody).subscribe({
            next: (emp) => {
                const cb = (employee: Employee) => {
                    this.createButtonLoading = 'idle'
                    this.nxStore.dispatch(showToast({ text: '직원이 등록되었어요.' }))
                    this.onEmployeeCreated.emit(employee)
                }

                if (!_.isEmpty(this.employeePicture)) {
                    this.fileService
                        .uploadFile('file_type_center_employee_picture', this.employeePicture, this.center.id, emp.id)
                        .subscribe((files) => {
                            const empCopy = _.cloneDeep(emp)
                            empCopy.picture = files[0].url
                            cb(empCopy)
                        })
                } else {
                    cb(emp)
                }
            },
            error: (err) => {
                this.createButtonLoading = 'idle'
                if (err.code == 'FUNCTION_CENTER_EMPLOYEE_001') {
                    this.emailStatus = 'error'
                }
            },
        })
    }

    // -----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------

    @Output() close = new EventEmitter()
    @Output() onEmployeeCreated = new EventEmitter<Employee>()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
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
