import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { Center } from '@schemas/center'

import _ from 'lodash'
import { detectChangesOn } from '@shared/helper/component-helper'
import { ChangeCenterNameOutput } from '@shared/components/molecules/change-center-name-modal/change-center-name-modal.component'
import { ChangeCenterPhoneNumberOutput } from '@shared/components/molecules/change-center-phone-number-modal/change-center-phone-number-modal.component'

import { CenterService } from '@services/center.service'
import { FileService } from '@services/file.service'
import { CenterListService } from '@services/center-list/center-list.service'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/loading'
import { ChangeAddressOutput } from '@shared/components/molecules/change-center-address-modal/change-center-address-modal.component'
import { ModalInput, ModalOutPut } from '@schemas/components/modal'
import { WordService } from '@services/helper/word.service'

export type CenterInfo = 'name' | 'phoneNumber' | 'address'

@Component({
    selector: 'rwm-set-center-info',
    templateUrl: './set-center-info.component.html',
    styleUrls: ['./set-center-info.component.scss'],
})
export class SetCenterInfoComponent implements OnChanges, AfterViewInit {
    @Input() center: Center

    @Input() isInit: boolean
    @Output() isInitChange = new EventEmitter<boolean>()

    @Output() goEmployeeManagement = new EventEmitter()

    @ViewChild('businessLicense') businessLicense_el: ElementRef

    public centerPicture: FileList = undefined
    public centerPictureSrc = ''
    onCenterPictureChange(res: { pictureFile: FileList; pictureSrc: string }) {
        this.fileService.uploadFile('file_type_center_picture', res.pictureFile, this.center.id).subscribe({
            next: (v) => {
                this.nxStore.dispatch(showToast({ text: '센터 사진이 등록되었어요.' }))
                this.center.picture = v[0].url
                this.centerListService.setChangedCenter(this.center)
            },
            error: () => {},
        })
    }
    onCenterPictureRemove(location: string) {
        console.log('onCenterPictureRemove - ', location)
        this.fileService.deleteFile(location).subscribe({
            next: () => {
                this.nxStore.dispatch(showToast({ text: '센터 사진이 삭제되었어요.' }))
                this.center.picture = null
                this.centerListService.setChangedCenter(this.center)
            },
            error: () => {},
        })
    }

    copyCenterCode() {
        window.navigator.clipboard.writeText(this.center.code).then(() => {
            this.nxStore.dispatch(showToast({ text: '센터 코드가 복사되었어요.' }))
        })
    }

    public centerInfoList = [
        {
            type: 'center-name',
            name: '센터 이름',
            value: '',
            changeAvailable: true,
            onChangeClick: () => {},
        },
        {
            type: 'phone-number',
            name: '전화번호',
            value: '',
            changeAvailable: true,
            onChangeClick: () => {},
        },
        {
            type: 'center-address',
            name: '주소',
            value: '',
            changeAvailable: true,
            onChangeClick: () => {},
        },
        {
            type: 'business-license',
            name: '사업자 등록증',
            file: undefined,
            value: '',
            changeAvailable: true,
            onChangeClick: () => {
                this.businessLicense_el.nativeElement.click()
            },
        },
    ]
    public businessLicenseLoading: Loading = 'idle'
    centerInfoInit() {
        _.forEach(this.centerInfoList, (v, idx) => {
            switch (v.type) {
                case 'center-name':
                    this.centerInfoList[idx].value = this.center.name
                    this.centerInfoList[idx].onChangeClick = () => {
                        this.showChangeNameModal = true
                    }
                    break
                case 'phone-number':
                    this.centerInfoList[idx].value = this.center.phone_number
                    this.centerInfoList[idx].onChangeClick = () => {
                        this.showChangePhoneNumberModal = true
                    }
                    break
                case 'center-address':
                    this.centerInfoList[
                        idx
                    ].value = `(${this.center.zip_no}) ${this.center.road_full_addr}, ${this.center.addr_detail}`
                    this.centerInfoList[idx].onChangeClick = () => {
                        this.showChangeAddressModal = true
                    }
                    break
                case 'business-license':
                    if (!_.isObject(this.centerInfoList[idx].file)) this.businessLicenseLoading = 'pending'
                    this.fileService
                        .getFile({ center_id: this.center.id, type_code: 'file_type_center_business_registration' })
                        .subscribe((files) => {
                            console.log('business-license file ', files, this.center.name)
                            this.businessLicenseLoading = 'idle'
                            if (files.length > 0) {
                                this.centerInfoList[idx].file = files[0]
                                this.centerInfoList[idx].value = files[0].originalname
                            } else {
                                this.centerInfoList[idx].value = '-'
                            }
                        })
                    break
            }
        })
    }

    constructor(
        private fileService: FileService,
        private nxStore: Store,
        private centerService: CenterService,
        private centerListService: CenterListService,
        private wordService: WordService
    ) {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', (v) => {
            this.centerInfoInit()
        })
    }
    ngAfterViewInit() {
        this.centerInfoInit()
    }

    // -----------------------------------------------------------------------------------------------------------
    onBusinessLicenseClicked(event) {
        event.target.value = null
    }
    setBusinessLicenseFile(file: any) {
        if (this.fileService.checkFileSizeTooLarge(file.files[0], 2)) {
            this.nxStore.dispatch(
                showToast({
                    text: '파일의 용량이 커서 업로드할 수 없어요. (최대 2MB)',
                })
            )
            return
        }

        const businessLicenseFile = file.files
        this.fileService.deleteFile(this.centerInfoList[3].file.url).subscribe(() => {
            this.fileService
                .uploadFile('file_type_center_business_registration', businessLicenseFile, this.center.id)
                .subscribe({
                    next: (v) => {
                        this.centerInfoList[3].file = v[0]
                        this.centerInfoList[3].value = v[0].originalname
                        this.nxStore.dispatch(showToast({ text: '사업자 등록증이 변경되었어요.' }))
                    },
                    error: () => {},
                })
        })
    }

    // -----------------------------------------------------------------------------------------------------------
    public showChangeNameModal = false
    public showChangePhoneNumberModal = false
    public showChangeAddressModal = false

    onChangeName(res: ChangeCenterNameOutput) {
        res.loadingFn.showLoading()

        this.centerService
            .updateCenter(this.center.id, {
                name: res.value,
            })
            .subscribe({
                next: (center) => {
                    res.loadingFn.hideLoading()
                    this.showChangeNameModal = false

                    this.nxStore.dispatch(showToast({ text: '센터 이름이 변경되었어요.' }))
                    this.centerInfoList[0].value = center.name
                    this.center = center
                    this.centerListService.setChangedCenter(center)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                    this.showChangeNameModal = false
                },
            })
    }
    onChangePhoneNumber(res: ChangeCenterPhoneNumberOutput) {
        res.loadingFn.showLoading()
        this.centerService
            .updateCenter(this.center.id, {
                phone_number: res.value,
            })
            .subscribe({
                next: (center) => {
                    res.loadingFn.hideLoading()
                    this.showChangePhoneNumberModal = false

                    this.nxStore.dispatch(showToast({ text: '센터 이름이 변경되었어요.' }))
                    this.centerInfoList[1].value = center.phone_number
                    this.center = center
                    this.centerListService.setChangedCenter(center)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                    this.showChangePhoneNumberModal = false
                },
            })
    }
    onAddressConfirm(res: ChangeAddressOutput) {
        res.loadingFn.showLoading()
        this.centerService
            .updateCenter(this.center.id, {
                zip_no: res.value.zonecode,
                road_full_addr: res.value.roadAddress,
                addr_detail: res.value.detailedAddress,
            })
            .subscribe({
                next: (center) => {
                    res.loadingFn.hideLoading()
                    this.showChangeAddressModal = false

                    this.nxStore.dispatch(showToast({ text: '주소가 변경되었어요.' }))
                    this.centerInfoList[2].value = `(${center.zip_no}) ${center.road_full_addr}, ${center.addr_detail}`
                    this.center = center
                    this.centerListService.setChangedCenter(center)
                },
                error: (err) => {
                    res.loadingFn.hideLoading()
                    this.showChangePhoneNumberModal = false
                },
            })
    }

    public showLeaveCenterModal = false
    public leaveCenterModaData: ModalInput = {
        title: `‘센터명’
            에서 나가시겠어요?`,
        desc:
            '센터에서 나가면 더 이상 입장하실 수 없어요.\n' +
            '다시 입장하고 싶으시다면, 센터로부터 초대 요청을 받아야 해요.',
        cancel: '취소',
        confirm: '센터 나가기',
    }
    openLeaveCenterModal() {
        this.leaveCenterModaData.title = `'${this.wordService.ellipsis(this.center.name, 20)}'
                                        에서 나가시겠어요?`
        this.showLeaveCenterModal = true
    }
    onLeaveCenterConfirm(res: ModalOutPut) {
        console.log('onLeaveCenterConfirm -- ', this.center)
        if (this.center.role_code == 'owner') {
            this.showLeaveCenterFailedModal = true
            this.showLeaveCenterModal = false
        } else {
            // ????
            this.showLeaveCenterModal = false
        }
    }

    public showLeaveCenterFailedModal = false
    public leaveCenterFailedModalData: ModalInput = {
        title: '운영자는 센터를 나가실 수 없어요.',
        desc: `센터 운영자는 운영자 권한을 양도해야만
                센터를 나가실 수 있어요.`,
        cancel: '양도하기',
        confirm: '확인',
    }
    onYieldCenterClick() {
        this.showLeaveCenterFailedModal = false
        this.goEmployeeManagement.emit()
    }
}
