import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Employee } from '@schemas/employee'

@Component({
    selector: ' rwm-employee-card',
    templateUrl: './employee-card.component.html',
    styleUrls: ['./employee-card.component.scss'],
})
export class EmployeeCardComponent implements OnInit {
    @Input() employee: Employee
    @Output() onEdit = new EventEmitter<Employee>()
    constructor() {}
    ngOnInit() {
        this.initStatus()
    }

    public statusText = ''
    initStatus() {
        if (this.employee.connection_status == 'employee_connection_status_connected') {
            this.statusText = '연동'
        } else if (this.employee.connection_status == 'employee_connection_status_disconnected') {
            this.statusText = '미연동'
        } else {
            this.statusText = '연동 요청중'
        }
        console.log('employee card : ', this.employee)
    }
}
