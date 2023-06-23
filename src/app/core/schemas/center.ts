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
    free_trial_terms: boolean
    start_date: string
    end_date: string
    picture: string
    background: string
    role_code: string
    role_name: string
    permissions: Array<PermissionCode> // 권한 코드 리스트

    // 아래 삭제 예정
    // id: string
    // name: string
    // address: string
    // open_time: string // hh:mm:ss
    // close_time: string // hh:mm:ss
    // all_day: boolean
    // day_of_the_week: number[] // [0일 ~ 6토]
    // color: string
    // timezone: string
    // picture: string
    // background: string
    // role_code: RoleCode
    // role_name: string //
    // permissions: Array<PermissionCode> // 권한 코드 리스트
    // notice: string
    // contract_terms: string
    product_start_date?: string // YYYY-MM-DD
    product_end_date?: string // YYYY-MM-DD
    // latest_subscription_failed_at: string
    // free_trial_end_date: string // 오늘일자에서 무료체험기간(14일)과 유예기간(3일)을 더한 일자  ex) 오늘이 2023-02-23인 경우 free_trial_end_date -> 2023-03-12
}

export type RoleCode = 'owner' | 'member' | 'administrator' | 'instructor'
