import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { StorageService } from '@services/storage.service'
import { CenterEmployeeService } from '@services/center-employee.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { CenterListItemService } from '@services/helper/center-list-item.service'
import { Center } from '@schemas/center'
import { Employee } from '@schemas/employee'
import { Loading } from '@schemas/loading'
import { detectChangesOn } from '@shared/helper/component-helper'
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
    initFlips() {
        this.instructorFlipOpen = true
        this.administratorFlipOpen = true
        this.ownerFlipOpen = true
    }

    public rolePermission: Record<Role, RolePermission[]> = {
        administrator: [],
        instructor: [],
    }

    public createEmployeeOpen = false
    public managePermissionOpen = false

    public empLoading: Loading = 'idle'
    public rpsLoading: Loading = 'idle'

    @Input() center: Center
    public prevCenter: Center

    @Input() isOpen: boolean
    @Output() isOpenChange = new EventEmitter<boolean>()
    @Input() modalVisible: boolean

    empInit() {
        // if (this.isEmpInit || !this.isOpen) return
        this.empLoading = 'pending'
        this.centerEmployeeService.getEmployee(this.center.id).subscribe({
            next: (emps) => {
                this.instructors = emps.instructor
                this.administrators = emps.administrator
                this.owners = emps.owner
                this.getEmployeeNumber()
                this.empLoading = 'idle'
                console.log('empInit : ', this.instructors, this.administrators)
            },
            error: (err) => {
                this.empLoading = 'idle'
            },
        })
    }
    rpsInit() {
        // if (this.isRpsInit || !this.isOpen || !this.permissionObj.settings_update_permission) return
        // if (!this.permissionObj.settings_update_permission) return
        this.rpsLoading = 'pending'
        this.centerRolePermissionService.getRolePermission(this.center.id).subscribe({
            next: (rps) => {
                this.rolePermission = rps
                this.rpsLoading = 'idle'
            },
            error: (err) => {
                this.rpsLoading = 'idle'
            },
        })
    }

    getEmployeeNumber() {
        this.employeeNumber = this.instructors.length + this.administrators.length + this.owners.length
    }

    public permissionObj = {
        settings_update_employee: false,
        settings_update_permission: false,
    }
    initPermission() {
        this.permissionObj = {
            settings_update_employee:
                !!_.find(this.center.permissions, (v) => v == 'settings_update_employee') ||
                this.center.role_code == 'owner',
            settings_update_permission:
                !!_.find(this.center.permissions, (v) => v == 'settings_update_permission') ||
                this.center.role_code == 'owner',
        }
    }

    constructor(
        private storageService: StorageService,
        private centerEmployeeService: CenterEmployeeService,
        private centerRolePermissionService: CenterRolePermissionService,
        private centerListService: CenterListItemService
    ) {}
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', () => {
            // && this.center.id != this.prevCenter?.id
            if (this.isOpen && this.center) {
                this.initPermission()
                this.rpsInit()
                this.empInit()
                this.prevCenter = this.center
            }
        })
        detectChangesOn(changes, 'modalVisible', () => {
            if (this.modalVisible) {
                this.initFlips()
            }
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
        this.centerListService.setChangedCenter(changedCenter, 'change')
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
        this.getEmployeeNumber()
    }
}
