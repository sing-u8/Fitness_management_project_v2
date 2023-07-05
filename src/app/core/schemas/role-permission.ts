export interface RolePermission {
    code: string
    name: string
    sequence_number: number
    permission_category_code: string
    permission_category_name: string
    permission_category_sequence_number: number
    approved: boolean
}

export type Role = 'administrator' | 'instructor'
