import { Center } from '@schemas/center'
import { PermissionCategory } from '@schemas/permission-category'
import { ModalInput } from '@schemas/components/modal'
export interface Modal {
    isVisible: boolean
    data: ModalInput
}

export interface Permission {
    administrator: Array<PermissionCategory>
    instructor: Array<PermissionCategory>
    visible: boolean
}

export interface RoleModal {
    center: Center
    permissionCategoryObj: Permission
}
