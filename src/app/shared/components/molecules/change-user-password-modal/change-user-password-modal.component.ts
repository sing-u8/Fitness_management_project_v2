import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { Loading } from '@schemas/loading'
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { changesOn } from '@shared/helper/component-helper'

import { UsersService } from '@services/users.service'
import { User } from '@schemas/user'
import { PasswordErrors } from '@schemas/errors/password-error'

import { showToast } from '@store/app/actions/app.actions'
import { Store } from '@ngrx/store'
import { passwordValidator } from '@shared/helper/form-helper'

export type ChangeUserPasswordOutput = {
    value: string
}

@Component({
    selector: 'rwm-change-user-password-modal',
    templateUrl: './change-user-password-modal.component.html',
    styleUrls: ['./change-user-password-modal.component.scss'],
})
export class ChangeUserPasswordModalComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() user: User

    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Output() onPasswordConfirm = new EventEmitter<void>()
    onConfirm() {
        this.onPasswordConfirm.emit()
    }

    @Input() blockClickOutside = true

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() close = new EventEmitter<any>()
    onClose(): void {
        this.close.emit({})
    }

    public confirmButtonLoading: Loading = 'idle'
    showLoading() {
        this.confirmButtonLoading = 'pending'
    }
    hideLoading() {
        this.confirmButtonLoading = 'idle'
    }

    public step: 'one' | 'two' = 'one'

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private usersService: UsersService,
        private nxStore: Store
    ) {}

    ngOnChanges(changes: SimpleChanges) {
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
                this.resetModal()
            }
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    // on mouse rw-modal down
    public isMouseModalDown = false
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // -----------------------------------------------------------------------------------------------------------

    public curPassword = this.fb.control('', {
        validators: [passwordValidator(), Validators.required],
    })
    public matchCurPasswordLoading: Loading = 'idle'
    matchCurPassword() {
        this.matchCurPasswordLoading = 'pending'
        this.usersService.checkPassword(this.user.id, { password: this.curPassword.value }).subscribe({
            next: (v) => {
                this.step = 'two'
                this.matchCurPasswordLoading = 'idle'
            },
            error: (err) => {
                this.nxStore.dispatch(showToast({ text: PasswordErrors[err.code].message }))
                this.matchCurPasswordLoading = 'idle'
            },
        })
    }

    public newPassword = this.fb.control('', {
        validators: [this.changePasswordValidator(), Validators.required],
    })
    public confirmNewPassword = this.fb.control('', {
        validators: [this.changePasswordConfirmValidator(), Validators.required],
    })
    public matchNewPasswordLoading: Loading = 'idle'

    public newPasswordStatus: 'warning' | 'error' | 'success' | 'none' = 'none'
    public newPasswordError: string
    public newPasswordValid: boolean

    public confirmNewPasswordStatus: 'warning' | 'error' | 'success' | 'none' = 'none'
    public confirmNewPasswordError: string
    public confirmNewPasswordValid: boolean

    resetModal() {
        this.step = 'one'

        this.curPassword.setValue('')
        this.newPassword.setValue('')
        this.confirmNewPassword.setValue('')

        this.newPasswordStatus = 'none'
        this.newPasswordError = ''
        this.newPasswordValid = false
        this.confirmNewPasswordStatus = 'none'
        this.confirmNewPasswordError = ''
        this.confirmNewPasswordValid = false
    }

    changePasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            console.log('passwordValidator -- ', control, control.value)
            const pattern1 = /[0-9]/
            const pattern2 = /[a-zA-Z]/
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
            const pattern4 = /\s/

            if (control.value.length == 0) {
                this.newPasswordError = ''
                this.newPasswordValid = false
                this.newPasswordStatus = 'none'
                return null
            } else if (pattern4.test(control.value)) {
                this.newPasswordError = '공백을 포함할 수 없어요.'
                this.newPasswordValid = false
                this.newPasswordStatus = 'warning'
                return {
                    include_space: true,
                }
            } else if (control.value.length < 8) {
                this.newPasswordError = '비밀번호가 너무 짧아요. (8자 이상)'
                this.newPasswordValid = false
                this.newPasswordStatus = 'warning'
                return {
                    short_length: true,
                }
            } else if (
                !pattern1.test(control.value) ||
                !pattern2.test(control.value) ||
                !pattern3.test(control.value)
            ) {
                this.newPasswordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
                this.newPasswordValid = false
                this.newPasswordStatus = 'warning'
                return {
                    not_complicated: true,
                }
            } else {
                this.newPasswordError = ''
                this.newPasswordValid = true
                this.newPasswordStatus = 'success'

                this.confirmNewPassword.setValue(this.confirmNewPassword.value)
                return null
            }
        }
    }
    changePasswordConfirmValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            console.log(
                'passwordValidator confirm -- ',
                control.value,
                '  -  ',
                control.value,
                '  -  ',
                this.confirmNewPassword?.value
            )
            const pattern1 = /[0-9]/
            const pattern2 = /[a-zA-Z]/
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
            const pattern4 = /\s/

            if (control.value.length == 0) {
                this.confirmNewPasswordError = ''
                this.confirmNewPasswordValid = false
                this.confirmNewPasswordStatus = 'none'
                return null
            } else if (pattern4.test(control.value)) {
                this.confirmNewPasswordError = '공백을 포함할 수 없어요.'
                this.confirmNewPasswordValid = false
                this.confirmNewPasswordStatus = 'warning'
                return {
                    include_space: true,
                }
            } else if (control.value.length < 8) {
                this.confirmNewPasswordError = '비밀번호가 너무 짧아요. (8자 이상)'
                this.confirmNewPasswordValid = false
                this.confirmNewPasswordStatus = 'warning'
                return {
                    short_length: true,
                }
            } else if (
                !pattern1.test(control.value) ||
                !pattern2.test(control.value) ||
                !pattern3.test(control.value)
            ) {
                this.confirmNewPasswordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
                this.confirmNewPasswordValid = false
                this.confirmNewPasswordStatus = 'warning'
                return {
                    not_complicated: true,
                }
            } else if (control.value != this.newPassword.value) {
                this.confirmNewPasswordError = '비밀번호가 일치하지 않아요.'
                this.confirmNewPasswordValid = false
                this.confirmNewPasswordStatus = 'error'
                return {
                    not_matched: true,
                }
            } else {
                this.confirmNewPasswordError = ''
                this.confirmNewPasswordValid = true
                this.confirmNewPasswordStatus = 'success'
                return null
            }
        }
    }

    changePassword() {
        this.matchNewPasswordLoading = 'pending'
        this.usersService
            .changePassword(this.user.id, { password: this.curPassword.value, new_password: this.newPassword.value })
            .subscribe({
                next: (user) => {
                    this.nxStore.dispatch(showToast({ text: '비밀번호가 변경되었어요.' }))
                    this.matchNewPasswordLoading = 'idle'
                    this.onConfirm()
                },
                error: (e) => {
                    this.matchNewPasswordLoading = 'idle'
                    if (e.code == 'FUNCTION_AUTH_008') {
                    } else if (e.code == 'FUNCTION_AUTH_011') {
                        this.nxStore.dispatch(showToast({ text: '유효하지 않은 토큰입니다.' }))
                    } else {
                        this.nxStore.dispatch(showToast({ text: e.message }))
                    }
                },
            })
    }
}
