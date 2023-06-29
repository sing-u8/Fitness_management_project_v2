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

import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

import { changesOn } from '@shared/helper/component-helper'
import { originalOrder } from '@shared/helper/pipe/keyvalue-helper'
import { getLinkedAccountStr, getMarketingStr, isLinkedAccountExist } from '@shared/helper/account-helper'

import { ChangeUserNameOutput } from '@shared/components/molecules/change-user-name-modal/change-user-name-modal.component'
import dayjs from 'dayjs'
import _ from 'lodash'

import { showToast } from '@store/app/actions/toast.action'
import { Store, select } from '@ngrx/store'
import { ChangeUserGenderOutput } from '@shared/components/molecules/change-user-gender-modal/change-user-gender-modal.component'
import { ChangeUserMarketingOutput } from '@shared/components/molecules/change-user-marketing-modal/change-user-marketing-modal.component'

export type MyInfo = 'name' | 'email' | 'phoneNumber' | 'gender' | 'birthDate' | 'marketing' | 'linkedAccount'

@Component({
    selector: 'rwm-my-profile-modal',
    templateUrl: './my-profile-modal.component.html',
    styleUrls: ['./my-profile-modal.component.scss'],
})
export class MyProfileModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = true

    @Input() user: User

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('body') bodyElement: ElementRef

    public isMouseModalDown = false

    public termsEULAVisible = false
    public termsPrivacyVisible = false

    public basicInfo: Record<MyInfo, { value: string; visible: boolean; category: string }> = {
        name: { value: '', visible: true, category: '이름' },
        email: { value: '', visible: true, category: '이메일 주소' },
        linkedAccount: { value: '', visible: true, category: '연동된 계정' },
        phoneNumber: { value: '', visible: true, category: '전화번호' },
        gender: { value: '', visible: true, category: '성별' },
        birthDate: { value: '', visible: true, category: '생년월일' },
        marketing: { value: '', visible: true, category: '마케팅 정보 수신' },
    }
    getBasicInfo(user: User) {
        this.basicInfo = {
            name: { value: user.name, visible: true, category: '이름' },
            email: { value: user.email, visible: true, category: '이메일 주소' },
            linkedAccount: {
                value: getLinkedAccountStr(user.providers),
                visible: isLinkedAccountExist(this.user.providers),
                category: '연동된 계정',
            },
            phoneNumber: { value: user.phone_number, visible: true, category: '전화번호' },
            gender: {
                value: user.sex == 'female' ? '여성' : user.sex == 'male' ? '남성' : null,
                visible: true,
                category: '성별',
            },
            birthDate: {
                value: user.birth_date ? dayjs(user.birth_date).format('YYMMDD') : undefined,
                visible: true,
                category: '생년월일',
            },
            marketing: { value: getMarketingStr(user), visible: true, category: '마케팅 정보 수신' },
        }
    }

    public originalOrder = originalOrder
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private storageService: StorageService,
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private nxStore: Store
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        changesOn(changes, 'visible', (v) => {
            if (v) {
                this.getBasicInfo(this.user)
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                    this.bodyElement.nativeElement.scrollTo({ top: this.scrollTop })
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        })
        changesOn(changes, 'user', (v) => {
            this.getBasicInfo(this.user)
        })
    }
    ngAfterViewChecked() {}
    ngAfterViewInit() {}

    // -----------------------------------------------------------------------------------------------------------
    logout() {
        this.storageService.logout()
    }
    // -----------------------------------------------------------------------------------------------------------
    onChangeName(res: ChangeUserNameOutput) {
        res.loadingFn.showLoading()
        this.usersService
            .updateUser(this.user.id, {
                name: res.value,
            })
            .subscribe({
                next: (v) => {
                    this.showChangeNameModal = false
                    this.onOpen()
                    res.loadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '이름이 변경되었어요.' }))

                    this.storageService.setUser(v)
                    this.user = _.cloneDeep(v)
                    this.getBasicInfo(this.user)
                    this.storageService.userChangeSubject.next(true)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                },
            })
    }
    onChangeGender(res: ChangeUserGenderOutput) {
        res.loadingFn.showLoading()
        this.usersService
            .updateUser(this.user.id, {
                sex: res.value,
            })
            .subscribe({
                next: (v) => {
                    this.showChangeGenderModal = false
                    this.onOpen()
                    res.loadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '성별이 변경되었어요.' }))

                    this.storageService.setUser(v)
                    this.user = _.cloneDeep(v)
                    this.getBasicInfo(this.user)
                    this.storageService.userChangeSubject.next(true)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                },
            })
    }
    onChangeBirthDate(res: ChangeUserGenderOutput) {
        res.loadingFn.showLoading()
        this.usersService
            .updateUser(this.user.id, {
                birth_date: res.value,
            })
            .subscribe({
                next: (v) => {
                    this.showChangeBirthDateModal = false
                    this.onOpen()
                    res.loadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '생년월일이 변경되었어요.' }))

                    this.storageService.setUser(v)
                    this.user = _.cloneDeep(v)
                    this.getBasicInfo(this.user)
                    this.storageService.userChangeSubject.next(true)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                },
            })
    }
    onChangeMarketing(res: ChangeUserMarketingOutput) {
        res.loadingFn.showLoading()
        this.usersService
            .updateUser(this.user.id, {
                marketing_email: res.value.email,
                marketing_sms: res.value.sms,
            })
            .subscribe({
                next: (v) => {
                    this.showChangeMarketingModal = false
                    this.onOpen()
                    res.loadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '마케팅 정보 수신 여부가 변경되었어요.' }))

                    this.storageService.setUser(v)
                    this.user = _.cloneDeep(v)
                    this.getBasicInfo(this.user)
                    this.storageService.userChangeSubject.next(true)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                },
            })
    }
    onChangePhoneNumber() {
        this.showChangePhoneNumberModal = false
        this.onOpen()
        this.user = this.storageService.getUser()
        this.getBasicInfo(this.user)
        this.storageService.userChangeSubject.next(true)
    }

    // -----------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------
    public showChangeNameModal = false
    public showChangePhoneNumberModal = false
    public showChangeGenderModal = false
    public showChangeBirthDateModal = false
    public showChangeMarketingModal = false
    public showChangePasswordModal = false
    public showDeleteUserModal = false

    onBasicInfoClick(type: string) {
        const _type = type as MyInfo
        switch (_type) {
            case 'name':
                this.showChangeNameModal = true
                break
            case 'phoneNumber':
                this.showChangePhoneNumberModal = true
                break
            case 'gender':
                this.showChangeGenderModal = true
                break
            case 'birthDate':
                this.showChangeBirthDateModal = true
                break
            case 'marketing':
                this.showChangeMarketingModal = true
                break
            default:
                break
        }
    }

    // -----------------------------------------------------------------------------------------------------------

    @Output() close = new EventEmitter()
    @Output() open = new EventEmitter()
    public scrollTop = 0
    onClose(keepScroll = true): void {
        this.scrollTop = keepScroll ? this.bodyElement.nativeElement.scrollTop : 0
        this.close.emit()
    }
    onOpen() {
        this.open.emit()
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
