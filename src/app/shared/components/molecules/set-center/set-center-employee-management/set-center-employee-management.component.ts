import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { StorageService } from '@services/storage.service'
import { CenterEmployeeService } from '@services/center-employee.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { Center } from '@schemas/center'
import { Employee } from '@schemas/employee'
import { Loading } from '@schemas/loading'
import { detectChangesOn } from '@shared/helper/component-helper'
import { forkJoin } from 'rxjs'
import { Role, RolePermission } from '@schemas/role-permission'

@Component({
    selector: 'rwm-set-center-employee-management',
    templateUrl: './set-center-employee-management.component.html',
    styleUrls: ['./set-center-employee-management.component.scss'],
})
export class SetCenterEmployeeManagementComponent implements OnInit, OnChanges {
    public instructors = []
    public administrators = []
    public owners = []
    public employeeNumber = 0

    public instructorFlipOpen = false
    public administratorFlipOpen = false
    public ownerFlipOpen = false

    public rolePermission: Record<Role, RolePermission[]> = undefined

    public createEmployeeOpen = false
    public managePermissionOpen = false

    public loading: Loading = 'idle'

    @Input() center: Center

    @Input() isInit: boolean
    @Output() isInitChange = new EventEmitter<boolean>()

    @Input() isOpen: boolean
    @Output() isOpenChange = new EventEmitter<boolean>()

    init() {
        if (this.isInit || !this.isOpen) return
        this.loading = 'pending'

        forkJoin([
            this.centerEmployeeService.getEmployee(this.center.id),
            this.centerRolePermissionService.getRolePermission(this.center.id),
        ]).subscribe({
            next: ([emps, rps]) => {
                // emps
                this.instructors = emps.instructor
                this.administrators = emps.administrator
                this.owners = emps.owner
                this.employeeNumber = this.instructors.length + this.administrators.length + this.owners.length
                console.log('getEmployee -- ', emps, this.instructors, this.administrators, this.owners)
                // rps
                this.rolePermission = rps
                console.log('rolePermission : ', rps)
                // common
                this.loading = 'idle'
                this.isInit = true
                this.isInitChange.emit(this.isInit)
            },
            error: (err) => {
                this.loading = 'idle'
                this.isInit = false
                this.isInitChange.emit(this.isInit)
            },
        })
    }

    constructor(
        private storageService: StorageService,
        private centerEmployeeService: CenterEmployeeService,
        private centerRolePermissionService: CenterRolePermissionService
    ) {}
    ngOnInit() {
        console.log('ngOnInit -- set center employee management ')
    }
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'isOpen', (v) => {
            this.init()
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
        this.editEmployeeModalOpen = false
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
