import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { StorageService } from '@services/storage.service'
import { CenterEmployeeService } from '@services/center-employee.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { CenterListService } from '@services/center-list/center-list.service'
import { Center } from '@schemas/center'
import { Employee } from '@schemas/employee'
import { Loading } from '@schemas/loading'
import { detectChangesOn } from '@shared/helper/component-helper'
import { forkJoin } from 'rxjs'
import { Role, RolePermission } from '@schemas/role-permission'
import _ from 'lodash'

@Component({
    selector: 'rwm-set-center-employee-management',
    templateUrl: './set-center-employee-management.component.html',
    styleUrls: ['./set-center-employee-management.component.scss'],
})
export class SetCenterEmployeeManagementComponent implements OnInit, OnChanges {
    public instructors: Employee[] = []
    public administrators: Employee[] = []
    public owners: Employee[] = []
    public employeeNumber = 0

    public instructorFlipOpen = true
    public administratorFlipOpen = true
    public ownerFlipOpen = true

    public rolePermission: Record<Role, RolePermission[]> = undefined

    public createEmployeeOpen = false
    public managePermissionOpen = false

    public empLoading: Loading = 'idle'
    public rpsLoading: Loading = 'idle'

    @Input() center: Center

    @Input() isEmpInit: boolean
    @Output() isEmpInitChange = new EventEmitter<boolean>()
    @Input() isRpsInit: boolean
    @Output() isRpsInitChange = new EventEmitter<boolean>()

    @Input() isOpen: boolean
    @Output() isOpenChange = new EventEmitter<boolean>()

    empInit() {
        if (this.isEmpInit || !this.isOpen) return
        this.empLoading = 'pending'
        this.centerEmployeeService.getEmployee(this.center.id).subscribe({
            next: (emps) => {
                this.instructors = emps.instructor
                this.administrators = emps.administrator
                this.owners = emps.owner
                this.employeeNumber = this.instructors.length + this.administrators.length + this.owners.length

                this.empLoading = 'idle'
                this.isEmpInit = true
                this.isEmpInitChange.emit(this.isEmpInit)
            },
            error: (err) => {
                this.empLoading = 'idle'
                this.isEmpInit = false
                this.isEmpInitChange.emit(this.isEmpInit)
            },
        })
    }
    rpsInit() {
        if (this.isRpsInit || !this.isOpen || !this.permissionObj.settings_update_permission) return
        this.rpsLoading = 'pending'
        this.centerRolePermissionService.getRolePermission(this.center.id).subscribe({
            next: (rps) => {
                this.rolePermission = rps

                this.rpsLoading = 'idle'
                this.isRpsInit = true
                this.isRpsInitChange.emit(this.isRpsInit)
            },
            error: (err) => {
                this.rpsLoading = 'idle'
                this.isRpsInit = false
                this.isRpsInitChange.emit(this.isRpsInit)
            },
        })
    }

    public permissionObj = {
        settings_update_employee: false,
        settings_update_permission: false,
    }
    initPermission() {
        this.permissionObj = {
            settings_update_employee:
                !!_.find(this.center.permissions, (v) => v.permission_code == 'settings_update_employee') ||
                this.center.role_code == 'owner',
            settings_update_permission:
                !!_.find(this.center.permissions, (v) => v.permission_code == 'settings_update_permission') ||
                this.center.role_code == 'owner',
        }
    }

    constructor(
        private storageService: StorageService,
        private centerEmployeeService: CenterEmployeeService,
        private centerRolePermissionService: CenterRolePermissionService,
        private centerListService: CenterListService
    ) {}
    ngOnInit() {
        console.log('ngOnInit -- set center employee management ')
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            this.initPermission()
            this.rpsInit()
            this.empInit()
        })
    }

    // ---------------------------------------------------------------------------------------------------
    public editEmployeeModalOpen = false
    public editEmployee: Employee = undefined
    onEditClick(emp: Employee) {
        this.editEmployee = emp
        this.editEmployeeModalOpen = true
    }
    onEmployeeEdited(emp: Employee) {
        if (this.editEmployee.role_code == 'instructor') {
            _.remove(this.instructors, (v) => v.id == emp.id)
        } else if (this.editEmployee.role_code == 'administrator') {
            _.remove(this.administrators, (v) => v.id == emp.id)
        } else {
            _.remove(this.owners, (v) => v.id == emp.id)
        }

        if (emp.role_code == 'instructor') {
            this.instructors.push(emp)
        } else if (emp.role_code == 'administrator') {
            this.administrators.push(emp)
        } else {
            this.owners.push(emp)
        }

        this.editEmployeeModalOpen = false
    }
    onYieldOwner(emp: Employee) {
        const preOwner = _.cloneDeep(this.owners[0])
        preOwner.role_code = 'administrator'
        preOwner.role_name = '관리자'
        this.owners = []
        this.administrators.push(preOwner)
        this.onEmployeeEdited(emp)

        const changedCenter = _.cloneDeep(this.center)
        changedCenter.role_code = 'administrator'
        changedCenter.role_name = '관리자'
        this.centerListService.setChangedCenter(changedCenter)
    }
    // ---------------------------------------------------------------------------------------------------
    onEmployeeDeleted(emp: Employee) {
        if (emp.role_code == 'instructor') {
            _.remove(this.instructors, (v) => v.id == emp.id)
        } else if (emp.role_code == 'administrator') {
            _.remove(this.administrators, (v) => v.id == emp.id)
        } else {
            _.remove(this.owners, (v) => v.id == emp.id)
        }
    }
    // ---------------------------------------------------------------------------------------------------
    onEmployeeCreated(emp: Employee) {
        this.createEmployeeOpen = false
        this.addCreatedEmployeeToList(emp)
    }
    addCreatedEmployeeToList(emp: Employee) {
        if (emp.role_code == 'instructor') {
            this.instructors.push(emp)
        } else if (emp.role_code == 'administrator') {
            this.administrators.push(emp)
        }
    }

    protected readonly undefined = undefined
}
