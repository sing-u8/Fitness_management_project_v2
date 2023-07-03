export interface Employee {
    id: string
    connection_status:
        | 'employee_connection_status_disconnected'
        | 'employee_connection_status_pending'
        | 'employee_connection_status_connected'
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
    role_code: string
    role_name: string
}
