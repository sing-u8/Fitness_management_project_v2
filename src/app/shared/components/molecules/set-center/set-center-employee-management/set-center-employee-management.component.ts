import { Component } from '@angular/core'

@Component({
    selector: 'rwm-set-center-employee-management',
    templateUrl: './set-center-employee-management.component.html',
    styleUrls: ['./set-center-employee-management.component.scss'],
})
export class SetCenterEmployeeManagementComponent {
    public instructors = []
    public administrators = []
    public owners = []

    public instructorFlipOpen = false
    public administratorFlipOpen = false
    public ownerFlipOpen = false

    public employeeNumber = 0

    public createEmployeeOpen = false

    constructor() {}
}
