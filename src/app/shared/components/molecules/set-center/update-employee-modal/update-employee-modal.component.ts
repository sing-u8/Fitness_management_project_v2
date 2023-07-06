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
import {
    CenterEmployeeService,
    CreateEmployeeReqBody,
    RoleCode,
    UpdateEmployeeReqBody,
} from '@services/center-employee.service'

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
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { User } from '@schemas/user'

@Component({
    selector: 'rwm-update-employee-modal',
    templateUrl: './update-employee-modal.component.html',
    styleUrls: ['./update-employee-modal.component.scss'],
})
export class UpdateEmployeeModalComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() center: Center
    @Input() employee: Employee
    public _employee: Employee
    public user: User
    initEmployee() {
        this.user = this.storageService.getUser()
        this._employee = _.cloneDeep(this.employee)
        this.reset()
        if (!_.isEmpty(this._employee.email)) {
            this.email.setValue(this._employee.email ?? '', { emitEvent: false })
            this.linkEmailAccount = this.email.value?.length != 0
        }
        this.employeeName.setValue(this._employee.name)
        this.phoneNumber.setValue(this._employee.phone_number)
        this.initPositionTab()
        this.initStatus()

        if (this.user.email == this.employee.email) this.email.disable()
    }

    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public updateButtonLoading: Loading = 'idle'
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

    public positionTabsForOwner: Array<TabInput> = [
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
        {
            name: '운영자',
            selected: false,
            value: 'owner',
        },
    ]
    public positionTabForSameOwner: Array<TabInput> = [
        {
            name: '운영자',
            selected: true,
            value: 'owner',
        },
    ]
    initPositionTab() {
        if (this.center.role_code == 'owner') {
            _.forEach(this.positionTabsForOwner, (v, idx) => {
                this.positionTabsForOwner[idx].selected = this.employee.role_code == v.value
            })
        } else {
            _.forEach(this.positionTabs, (v, idx) => {
                this.positionTabs[idx].selected = this.employee.role_code == v.value
            })
        }
    }

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
            this.showTag = false
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
                if (!this.keepData) {
                    this.initEmployee()
                }
            }
        })

        changesOn(changes, 'employee', (v) => {
            this.keepData = false
            this.initEmployee()
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}
    ngOnDestroy() {
        this.unDescriber$.next(true)
        this.unDescriber$.complete()
    }

    // -----------------------------------------------------------------------------------------------------------
    checkYieldOwner() {
        if (this.center.role_code == 'owner' && this.positionTabsForOwner[2].selected) {
            this.openYieldModal()
        } else {
            this.updateEmployee()
        }
    }
    updateEmployee() {
        this.updateButtonLoading = 'pending'
        this.emailStatus = 'none'

        const reqBody: UpdateEmployeeReqBody = {
            role_code:
                this.center.role_code == 'owner'
                    ? (_.find(this.positionTabsForOwner, (v) => v.selected).value as RoleCode)
                    : (_.find(this.positionTabs, (v) => v.selected).value as RoleCode),
            name: this.employeeName.value,
            phone_number: _.replace(this.phoneNumber.value, /[^0-9]/gi, ''),
            email: this.email.value ?? '',
            connection: this.linkEmailAccount,
        }
        if (this.center.role_code == 'owner' && this._employee.email == this.user.email) delete reqBody['role_code']

        this.centerEmployeeService.updateEmployee(this.center.id, this._employee.id, reqBody).subscribe({
            next: (emp) => {
                const cb = (employee: Employee) => {
                    this.updateButtonLoading = 'idle'
                    this.nxStore.dispatch(showToast({ text: '직원 정보가 수정되었어요.' }))
                    this.onEmployeeUpdated.emit(employee)
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
                this.updateButtonLoading = 'idle'
                if (err.code == 'FUNCTION_CENTER_EMPLOYEE_001') {
                    this.emailStatus = 'error'
                }
            },
        })
    }

    // -----------------------------------------------------------------------------------------------------------
    public statusText = ''
    public showTag = false
    initStatus() {
        if (this.employee.connection_status == 'employee_connection_status_connected') {
            this.statusText = '연동'
            this.showTag = true
        } else if (this.employee.connection_status == 'employee_connection_status_disconnected') {
            this.statusText = '미연동'
            this.showTag = !_.isEmpty(this.employee.email)
        } else {
            this.statusText = '연동 요청중'
            this.showTag = true
        }
    }

    // -----------------------------------------------------------------------------------------------------------
    public yieldOwnerOpen = false
    public yieldOwnerData: ModalInput = {
        title: `‘직원명’ 직원에게
            운영자 권한을 양도하시겠어요?`,
        desc: `운영자 양도는 취소하실 수 없으며, 양도 후
            본인의 권한은 관리자로 변경돼요.`,
        cancel: '아니요',
        confirm: '권한을 양도할게요',
    }
    openYieldModal() {
        this.yieldOwnerOpen = true
        this.yieldOwnerData.title = `‘${this._employee.name}’ 직원에게
                            운영자 권한을 양도하시겠어요?`
        this.onClose()
    }
    onYieldConfirm(mo: ModalOutPut) {
        if (this._employee.connection_status != 'employee_connection_status_connected') {
            this.onClose()
            this.yieldOwnerOpen = false
            this.disableToYieldModalOpen = true
        } else {
            mo.showLoading()
            this.emailStatus = 'none'
            const reqBody: UpdateEmployeeReqBody = {
                name: this.employeeName.value,
                phone_number: _.replace(this.phoneNumber.value, /[^0-9]/gi, ''),
                email: this.email.value ?? '',
                connection: this.linkEmailAccount,
            }
            this.centerEmployeeService.updateEmployee(this.center.id, this._employee.id, reqBody).subscribe({
                next: (emp) => {
                    const cb = (employee: Employee) => {
                        this.centerService
                            .delegate(this.center.id, { center_user_id: this._employee.id })
                            .subscribe(() => {
                                this.updateButtonLoading = 'idle'
                                this.nxStore.dispatch(showToast({ text: '직원 정보가 수정되었어요.' }))
                                employee.role_code = 'owner'
                                employee.role_name = '운영자'
                                mo.hideLoading()
                                this.onYieldOwner.emit(employee)
                            })
                    }
                    if (!_.isEmpty(this.employeePicture)) {
                        this.fileService
                            .uploadFile(
                                'file_type_center_employee_picture',
                                this.employeePicture,
                                this.center.id,
                                emp.id
                            )
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
                    this.updateButtonLoading = 'idle'
                    mo.hideLoading()
                    if (err.code == 'FUNCTION_CENTER_EMPLOYEE_001') {
                        this.emailStatus = 'error'
                    }
                },
            })
        }
    }
    onYieldCancel() {
        this.open.emit()
        this.yieldOwnerOpen = false
    }

    public disableToYieldModalOpen = false
    public disableToYieldModalData: ModalInput = {
        title: `앗! 계정이 연동 되지 않은 직원에게는
                운영자 권한을 양도하실 수 없어요.`,
        desc: `해당 직원의 이메일 계정을 연동한 후
            다시 운영자 권한을 양도해 주세요.`,
        confirm: '확인',
    }
    public onDisableToYieldCancel() {
        this.open.emit()
        this.disableToYieldModalOpen = false
    }

    public deleteEmployeeOpen = false
    public deleteEmployeeData: ModalInput = {
        title: `‘직원명’ 직원을 삭제하시겠어요?`,
        desc: `해당 직원의 이름으로 등록된 수업, 스케줄 등
            의 정보는 유지되며, 계정이 연동된 경우 해당
            직원의 계정으로 센터에 입장할 수 없어요.`,
        cancel: '취소',
        confirm: '직원 삭제',
    }
    onDeleteClick() {
        this.deleteEmployeeData.title = `'${this.employee.name}' 직원을 삭제하시겠어요?`
        this.deleteEmployeeOpen = true
        this.onClose()
    }
    onDeleteCancel() {
        this.open.emit()
        this.deleteEmployeeOpen = false
    }
    onDeleteConfirm(mo: ModalOutPut) {
        mo.showLoading()
        this.centerEmployeeService.deleteEmployee(this.center.id, this._employee.id).subscribe({
            next: () => {
                mo.hideLoading()
                this.deleteEmployeeOpen = false
                this.onEmployeeDeleted.emit(this._employee)
                // this.close.emit()
            },
            error: (err) => {
                mo.hideLoading()
                this.deleteEmployeeOpen = false
                this.open.emit()
            },
        })
    }

    public cancelEditEmployeeOpen = false
    public cancelEditEmplyeeData: ModalInput = {
        title: `직원 정보 수정을 취소하시겠어요?`,
        desc: `취소 시, 수정한 내용이 모두 삭제돼요.`,
        cancel: '아니요',
        confirm: '수정 취소',
    }
    onEditCancelClick() {
        this.onClose()
        this.cancelEditEmployeeOpen = true
    }
    onCancelConfirm() {
        this.cancelEditEmployeeOpen = false
        this.onClose(false)
    }
    onCancelModalCancel() {
        this.open.emit()
        this.cancelEditEmployeeOpen = false
    }
    // -----------------------------------------------------------------------------------------------------------

    @Output() close = new EventEmitter()
    @Output() open = new EventEmitter()
    @Output() onEmployeeUpdated = new EventEmitter<Employee>()
    @Output() onYieldOwner = new EventEmitter<Employee>()
    @Output() onEmployeeDeleted = new EventEmitter<Employee>()
    public scrollTop = 0
    public keepData = false
    onClose(keepData = true): void {
        this.scrollTop = keepData ? this.bodyElement.nativeElement.scrollTop : 0
        this.keepData = keepData
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
