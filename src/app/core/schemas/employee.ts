import { RoleCode } from "@schemas/center";

export interface Employee {
    id: string
    connection_status: EmployeeConnectionStatus
    membership_number: string
    name: string
    sex: string
    birth_date: string
    email: string
    phone_number: string
    color: string
    memo: string
    picture: string
    background: string
    role_code: RoleCode
    role_name: string
}

export type EmployeeConnectionStatus =
    | 'employee_connection_status_disconnected'
    | 'employee_connection_status_pending'
    | 'employee_connection_status_connected'
