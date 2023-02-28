import { Toast } from './toast.interface'
// import { Drawer } from './drawer.interface'
import { Modal, RoleModal } from './modal.interface'
import { Registration } from './registration.interface'

export interface AppStateInterface {
    toast: Toast
    registration: Registration
    modal: Modal
    // scheduleDrawerIsReset: boolean
    // drawer: Drawer
    // roleModal: RoleModal
}
