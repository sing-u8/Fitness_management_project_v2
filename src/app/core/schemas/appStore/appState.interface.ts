import { Toast } from './toast.interface'
// import { Drawer } from './drawer.interface'
// import { Modal, RoleModal } from './modal.interface'
import { Registration } from './registration.interface'

export interface AppStateInterface {
    toast: Toast
    registration: Registration
    // scheduleDrawerIsReset: boolean
    // drawer: Drawer
    // modal: Modal
    // roleModal: RoleModal
}
