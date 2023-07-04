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

import { FileService } from '@services/file.service'

import { showToast } from '@store/app/actions/toast.action'
import { Store } from '@ngrx/store'

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

    @ViewChild('businessLicense') businessLicense_el: ElementRef

    public centerPicture: FileList = undefined
    public centerPictureSrc = ''
    onCenterPictureChange(res: { pictureFile: FileList; pictureSrc: string }) {
        this.centerPicture = res.pictureFile
        this.centerPictureSrc = res.pictureSrc
    }

    copyCenterCode() {
        window.navigator.clipboard.writeText(this.center.code).then(() => {
            this.nxStore.dispatch(showToast({ text: '센터 코드가 복사되었어요.' }))
        })
    }

    leaveCenter() {}

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
            value: '',
            changeAvailable: true,
            onChangeClick: () => {
                this.businessLicense_el.nativeElement.click()
            },
        },
    ]
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
                        this.openSearchAddressPopup()
                    }
                    break
                case 'business-license':
                    this.centerInfoList[idx].value = '더미 사업자 등록증.jpg'
                    break
            }
        })
    }

    constructor(private fileService: FileService, private nxStore: Store) {}
    ngOnChanges(changes: SimpleChanges) {
        detectChangesOn(changes, 'center', (v) => {
            this.centerInfoInit()
        })
    }
    ngAfterViewInit() {
        this.centerInfoInit()
    }

    // -----------------------------------------------------------------------------------------------------------
    public businessLicenseFile: FileList = undefined
    public businessLicenseFileName = ''

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

        this.businessLicenseFile = file.files
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.businessLicenseFileName = this.businessLicenseFile[0].name
        }
        fileReader.readAsDataURL(this.businessLicenseFile[0])
    }

    // -----------------------------------------------------------------------------------------------------------
    public showChangeNameModal = false
    public showChangePhoneNumberModal = false

    onChangeName(res: ChangeCenterNameOutput) {
        res.loadingFn.showLoading()

        res.loadingFn.hideLoading()
        this.showChangeNameModal = false
    }
    onChangePhoneNumber(res: ChangeCenterPhoneNumberOutput) {
        res.loadingFn.showLoading()

        res.loadingFn.hideLoading()
        this.showChangePhoneNumberModal = false
    }

    openSearchAddressPopup() {
        const width = 400
        const height = 400
        const popupKey = 'daumPopupKey'

        new window['daum'].Postcode({
            oncomplete: (data) => {
                // this.zonecode.setValue(data.zonecode)
                // this.roadAddress.setValue(data.roadAddress)
            },
            onclose: (state) => {},
            width,
            height,
        }).open({
            left: window.screen.width / 2 - width / 2,
            top: window.screen.height / 2 - height / 2,
            popupKey,
        })
    }
}
