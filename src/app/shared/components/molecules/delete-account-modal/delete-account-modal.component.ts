import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
    AfterViewInit,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

import { Loading } from '@schemas/loading'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { UsersCenterService } from '@services/users-center.service'
import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'
import { changesOn } from '@shared/helper/component-helper'
import { User } from '@schemas/user'

import _ from 'lodash'
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

@Component({
    selector: 'rwm-delete-account-modal',
    templateUrl: './delete-account-modal.component.html',
    styleUrls: ['./delete-account-modal.component.scss'],
})
export class DeleteAccountModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() user: User
    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<ModalOutPut>()

    public changed: boolean
    public isMouseModalDown = false

    public deleteUserLoading: Loading = 'idle'
    public deleteUserConfirmLoading: Loading = 'idle'
    showLoading() {
        this.deleteUserConfirmLoading = 'pending'
    }
    hideLoading() {
        this.deleteUserConfirmLoading = 'idle'
    }

    public step: 'one' | 'two' | 'disableToDelete' = 'one'

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private usersCenterService: UsersCenterService,
        private usersService: UsersService,
        private storageService: StorageService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'user', (v) => {
            this.getLinkedAccountString()
        })

        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.step = 'one'
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {
        this.getLinkedAccountString()
    }

    // ----------------------------------------------------------------------------------------------------

    public linkedAccountString = ''
    getLinkedAccountString() {
        const arr = _.split(this.user.providers, ', ')
        const accountList = []
        _.forEach(arr, (v) => {
            if (v == 'google.com') {
                accountList.push('구글')
            } else if (v == 'kakao.com') {
                accountList.push('카카오')
            } else if (v == 'apple.com') {
                accountList.push('애플')
            }
        })
        this.linkedAccountString = _.join(accountList, ', ')
        console.log('get linked accountstring : ', accountList, this.linkedAccountString)
    }

    // ----------------------------------------------------------------------------------------------------

    public deleteUserForm = this.fb.control('', {
        validators: [this.deleteUserValidator(), Validators.required],
    })

    deleteUserValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value != '계정 삭제') {
                return {
                    notValid: true,
                }
            }
            return null
        }
    }

    checkAvailableToDelete() {
        this.deleteUserLoading = 'pending'
        this.usersCenterService.getCenterList(this.user.id).subscribe((centers) => {
            const isOwnerCenterExist = _.some(centers, (v) => v.role_code == 'owner')
            if (isOwnerCenterExist) {
                this.step = 'disableToDelete'
            } else {
                this.step = 'two'
            }
            this.deleteUserLoading = 'idle'
        })
    }
    deleteUserConfirm() {
        this.deleteUserConfirmLoading = 'pending'
        this.usersService.deleteUser(this.user.id).subscribe(() => {
            this.deleteUserConfirmLoading = 'idle'
            this.confirm.emit()
            this.storageService.logout()
        })
    }

    // ----------------------------------------------------------------------------------------------------

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({
            showLoading: this.showLoading.bind(this),
            hideLoading: this.hideLoading.bind(this),
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
