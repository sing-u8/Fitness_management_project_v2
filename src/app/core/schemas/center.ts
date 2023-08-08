import { PermissionCode } from '@schemas/permission-category'
import { ProductCode } from '@schemas/payment/product-code'

export interface Center {
    id: string
    code: string
    name: string
    zip_no: string
    road_full_addr: string
    addr_detail: string
    phone_number: string
    color: string
    timezone: string
    product_code: 'free_trial_membership' | '1_years_membership' | '2_years_membership' | 'subscription_membership'
    start_date: string
    end_date: string
    schedule_at: string
    next_end_date: string
    next_start_date: string
    next_product_code: string
    picture: string
    background: string
    connection_status_code: CenterConnectionStatus

    role_code: RoleCode
    role_name: string
    permissions: Array<string> // 권한 코드 리스트

    // 아래 삭제 예정
    product_start_date?: string // YYYY-MM-DD
    product_end_date?: string // YYYY-MM-DD
}

export type RoleCode = 'owner' | 'member' | 'administrator' | 'instructor'

export type CenterConnectionStatus =
    | 'employee_connection_status_disconnected'
    | 'employee_connection_status_pending'
    | 'employee_connection_status_connected'
