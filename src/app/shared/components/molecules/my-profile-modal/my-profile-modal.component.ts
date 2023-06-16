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

import { Loading } from '@schemas/loading'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { User } from '@schemas/user'

import { changesOn } from '@shared/helper/component-helper'
import { originalOrder } from '@shared/helper/pipe/keyvalue-helper'
import { getLinkedAccountStr, getMarketingStr, isLinkedAccountExist } from '@shared/helper/account-helper'

import { ChangeUserNameOutput } from '@shared/components/molecules/change-user-name-modal/change-user-name-modal.component'
import dayjs from 'dayjs'
import _ from 'lodash'

import { showToast } from '@store/app/actions/toast.action'
import { Store, select } from '@ngrx/store'

export type MyInfo = 'name' | 'email' | 'phoneNumber' | 'gender' | 'birthDate' | 'marketing' | 'linkedAccount'

@Component({
    selector: 'rwm-my-profile-modal',
    templateUrl: './my-profile-modal.component.html',
    styleUrls: ['./my-profile-modal.component.scss'],
})
export class MyProfileModalComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Output() onUserChange = new EventEmitter<User>() // 나중에 storage service에서 subject로 내보내기

    @Input() blockClickOutside = true

    @Input() user: User

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

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
            gender: { value: user.sex, visible: true, category: '성별' },
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
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private nxStore: Store,
        private storageService: StorageService
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
    onChangeName(res: ChangeUserNameOutput) {
        res.loadingFn.showLoading()
        this.usersService
            .updateUser(this.user.id, {
                name: res.value,
            })
            .subscribe({
                next: (v) => {
                    this.showChangeNameModal = false
                    res.loadingFn.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '이름이 변경되었어요.' }))

                    this.storageService.setUser(v)
                    this.user = _.cloneDeep(v)
                    this.getBasicInfo(this.user)
                    this.onUserChange.emit(this.user)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                },
            })
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

    @Output() close = new EventEmitter<any>()
    onClose(): void {
        this.close.emit({})
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
